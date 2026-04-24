/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return formatDate(d);
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format status badge
 */
export function formatStatus(status: string): { label: string; className: string } {
  const statuses: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'status-pending' },
    approved: { label: 'Approved', className: 'status-approved' },
    rejected: { label: 'Rejected', className: 'status-rejected' },
    'ready-for-pickup': { label: 'Ready for Pickup', className: 'status-ready' },
    'in-progress': { label: 'In Progress', className: 'status-progress' },
    completed: { label: 'Completed', className: 'status-completed' },
    open: { label: 'Open', className: 'status-open' },
    investigation: { label: 'Investigation', className: 'status-investigation' },
    resolved: { label: 'Resolved', className: 'status-resolved' },
    closed: { label: 'Closed', className: 'status-closed' },
    active: { label: 'Active', className: 'status-active' },
    inactive: { label: 'Inactive', className: 'status-inactive' },
  };

  return statuses[status] || { label: capitalize(status), className: 'status-default' };
}

/**
 * Generate initials from full name
 */
export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
