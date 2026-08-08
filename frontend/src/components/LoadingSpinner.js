import React from 'react';

export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="text-center py-5">
      <div className="orbit-loader">
        <div className="track" />
        <div className="planet" />
      </div>
      <p className="text-muted-orbit mb-0">{label}</p>
    </div>
  );
}
