export function getAssetAgeLabel(acquisitionDate: string | Date | null | undefined) {
  if (!acquisitionDate) return 'Age unavailable'

  const startDate = acquisitionDate instanceof Date ? acquisitionDate : new Date(acquisitionDate)
  if (Number.isNaN(startDate.getTime())) return 'Age unavailable'

  const now = new Date()
  const years = now.getFullYear() - startDate.getFullYear()
  const months = now.getMonth() - startDate.getMonth()
  const totalMonths = years * 12 + months

  if (totalMonths < 1) return 'Less than 1 month'
  if (totalMonths < 12) return `${totalMonths} month${totalMonths === 1 ? '' : 's'}`

  const roundedYears = Math.floor(totalMonths / 12)
  return `${roundedYears} year${roundedYears === 1 ? '' : 's'}`
}
