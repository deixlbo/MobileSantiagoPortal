function normalizeProjectUpdatePayload(body = {}) {
  const {
    id,
    progress,
    status,
    spent,
    startDate,
    targetCompletion,
    endDate,
    budget,
    ...updates
  } = body

  const payload = {}

  if (id !== undefined) payload.id = id

  if (progress !== undefined) {
    payload.progress = Math.min(100, Math.max(0, Number(progress)))
  }

  if (status !== undefined) {
    payload.status = status
  }

  if (spent !== undefined && spent !== '') {
    payload.spent = Number(spent)
  }

  if (budget !== undefined && budget !== '') {
    payload.budget = Number(budget)
  }

  if (startDate !== undefined) {
    payload.start_date = startDate ? new Date(String(startDate)) : null
  }

  if (targetCompletion !== undefined) {
    payload.target_completion = targetCompletion ? new Date(String(targetCompletion)) : null
  } else if (endDate !== undefined) {
    payload.target_completion = endDate ? new Date(String(endDate)) : null
  }

  const camelToSnakeMap = {
    projectHead: 'project_head',
    projectHeadPosition: 'project_head_position',
    targetCompletion: 'target_completion',
    endDate: 'target_completion',
    startDate: 'start_date',
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue
    const snakeKey = camelToSnakeMap[key] || key
    payload[snakeKey] = value
  }

  return payload
}

module.exports = {
  normalizeProjectUpdatePayload,
}
