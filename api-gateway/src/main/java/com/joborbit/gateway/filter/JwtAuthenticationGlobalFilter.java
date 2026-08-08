package com.joborbit.gateway.filter;

import com.joborbit.gateway.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * WHY THIS CLASS EXISTS:
 * This is the single security checkpoint for the whole platform. Every request
 * that reaches the Gateway (except /api/auth/register and /api/auth/login)
 * passes through here first. Downstream microservices trust the Gateway and
 * do not re-validate JWT signatures themselves - they simply read the
 * X-User-Name / X-User-Role headers that this filter injects.
 *
 * HOW IT WORKS:
 * Implements Spring Cloud Gateway's GlobalFilter interface, so it automatically
 * applies to EVERY route defined in application.yml without needing to be
 * wired into each route individually.
 *
 * HOW IT CONNECTS TO OTHER LAYERS:
 * Uses JwtUtil (util layer) to verify tokens signed by the Auth Service.
 * Both services share the same jwt.secret so a token minted by Auth Service
 * can be verified here without calling Auth Service over the network.
 */
@Slf4j
@Component
public class JwtAuthenticationGlobalFilter implements GlobalFilter, Ordered {

    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/auth/register",
            "/api/auth/login"
    );

    private final JwtUtil jwtUtil;

    public JwtAuthenticationGlobalFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        if (isPublic(path)) {
            return chain.filter(exchange);
        }

        List<String> authHeaders = request.getHeaders().get("Authorization");
        if (authHeaders == null || authHeaders.isEmpty() || !authHeaders.get(0).startsWith("Bearer ")) {
            return unauthorized(exchange, "Missing or malformed Authorization header");
        }

        String token = authHeaders.get(0).substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            return unauthorized(exchange, "Invalid or expired JWT token");
        }

        String username = jwtUtil.extractUsername(token);
        String role = jwtUtil.extractRole(token);
        String userId = jwtUtil.extractUserId(token);

        ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-User-Name", username)
                .header("X-User-Role", role)
                .header("X-User-Id", userId == null ? "" : userId)
                .build();

        log.info("Authenticated request -> user: {}, role: {}, path: {}", username, role, path);

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    @Override
    public int getOrder() {
        return -1; // run before routing filters
    }

    private boolean isPublic(String path) {
        return PUBLIC_ENDPOINTS.stream().anyMatch(path::equalsIgnoreCase);
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add("Content-Type", "application/json");
        String body = String.format("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"%s\"}", message);
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    }
}
