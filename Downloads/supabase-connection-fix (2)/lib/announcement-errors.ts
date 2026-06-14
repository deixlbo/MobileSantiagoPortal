export function isMissingAnnouncementImageColumnError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return message.includes("Could not find the 'image_url' column") && message.includes("'announcements'")
}
