package com.joborbit.user.controller;

import com.joborbit.user.dto.*;
import com.joborbit.user.security.CurrentUser;
import com.joborbit.user.security.CurrentUserResolver;
import com.joborbit.user.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final CurrentUserResolver currentUserResolver;

    @org.springframework.beans.factory.annotation.Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileDto>> getMyProfile(HttpServletRequest request) {
        CurrentUser user = currentUserResolver.resolve(request);
        ProfileDto dto = profileService.getOrCreateProfile(user.getUserId(), user.getUsername(), user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", dto));
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<ProfileDto>> getProfileByUserId(HttpServletRequest request,
                                                                        @PathVariable Long userId) {
        CurrentUser user = currentUserResolver.resolve(request);
        currentUserResolver.requireRole(user, "RECRUITER", "ADMIN");
        return ResponseEntity.ok(ApiResponse.success("Candidate profile fetched", profileService.getProfileByUserId(userId)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileDto>> updateProfile(HttpServletRequest request,
                                                                   @Valid @RequestBody ProfileDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        ProfileDto updated = profileService.updateProfile(user.getUserId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", updated));
    }

    @PostMapping(value = "/profile/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadResume(HttpServletRequest request,
                                                              @RequestParam("file") MultipartFile file) {
        CurrentUser user = currentUserResolver.resolve(request);
        String url = profileService.uploadResume(user.getUserId(), file);
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded", url));
    }

    @GetMapping("/profile/resume/{fileName}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String fileName) {
        try {
            Path filePath = Path.of(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .contentType(resolveContentType(fileName))
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * WHY THIS METHOD EXISTS:
     * Files.probeContentType() is unreliable across OS/JDK combos - it
     * frequently returns null for common types like .pdf depending on the
     * environment's file-type-detection registry. When that happens the
     * response falls back to application/octet-stream, which browsers can
     * never render inline - they just download the blob with a random
     * generated name (exactly what was being reported). Mapping known
     * extensions explicitly guarantees resumes actually open in-browser.
     */
    private MediaType resolveContentType(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".pdf")) return MediaType.APPLICATION_PDF;
        if (lower.endsWith(".doc")) return MediaType.parseMediaType("application/msword");
        if (lower.endsWith(".docx")) return MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        if (lower.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    // ---------- Education ----------

    @PostMapping("/profile/education")
    public ResponseEntity<ApiResponse<EducationDto>> addEducation(HttpServletRequest request,
                                                                    @Valid @RequestBody EducationDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        return ResponseEntity.ok(ApiResponse.success("Education added", profileService.addEducation(user.getUserId(), dto)));
    }

    @PutMapping("/profile/education/{id}")
    public ResponseEntity<ApiResponse<EducationDto>> updateEducation(HttpServletRequest request,
                                                                       @PathVariable Long id,
                                                                       @Valid @RequestBody EducationDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        return ResponseEntity.ok(ApiResponse.success("Education updated", profileService.updateEducation(user.getUserId(), id, dto)));
    }

    @DeleteMapping("/profile/education/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(HttpServletRequest request, @PathVariable Long id) {
        CurrentUser user = currentUserResolver.resolve(request);
        profileService.deleteEducation(user.getUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("Education deleted", null));
    }

    // ---------- Experience ----------

    @PostMapping("/profile/experience")
    public ResponseEntity<ApiResponse<ExperienceDto>> addExperience(HttpServletRequest request,
                                                                      @Valid @RequestBody ExperienceDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        return ResponseEntity.ok(ApiResponse.success("Experience added", profileService.addExperience(user.getUserId(), dto)));
    }

    @PutMapping("/profile/experience/{id}")
    public ResponseEntity<ApiResponse<ExperienceDto>> updateExperience(HttpServletRequest request,
                                                                         @PathVariable Long id,
                                                                         @Valid @RequestBody ExperienceDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        return ResponseEntity.ok(ApiResponse.success("Experience updated", profileService.updateExperience(user.getUserId(), id, dto)));
    }

    @DeleteMapping("/profile/experience/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(HttpServletRequest request, @PathVariable Long id) {
        CurrentUser user = currentUserResolver.resolve(request);
        profileService.deleteExperience(user.getUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("Experience deleted", null));
    }

    // ---------- Skills ----------

    @PostMapping("/profile/skills")
    public ResponseEntity<ApiResponse<SkillDto>> addSkill(HttpServletRequest request, @Valid @RequestBody SkillDto dto) {
        CurrentUser user = currentUserResolver.resolve(request);
        return ResponseEntity.ok(ApiResponse.success("Skill added", profileService.addSkill(user.getUserId(), dto)));
    }

    @DeleteMapping("/profile/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(HttpServletRequest request, @PathVariable Long id) {
        CurrentUser user = currentUserResolver.resolve(request);
        profileService.deleteSkill(user.getUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted", null));
    }
}