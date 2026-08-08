import React from 'react';

/** WHY: The reusable "orbit ring + core" signature mark used in the navbar
 * brand, the loading spinner, and empty states - a planet with an orbiting
 * ring, echoing the platform name. */
export default function OrbitMark() {
  return (
    <span className="orbit-mark" aria-hidden="true">
      <span className="ring" />
      <span className="core" />
    </span>
  );
}
