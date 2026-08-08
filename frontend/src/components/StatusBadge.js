import React from 'react';

export default function StatusBadge({ status }) {
  return <span className={`status-chip status-${status}`}>{status}</span>;
}
