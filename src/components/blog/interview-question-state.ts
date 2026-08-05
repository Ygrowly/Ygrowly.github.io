export function toggleInterviewQuestion(openId: string | null, questionId: string) {
  return openId === questionId ? null : questionId
}

export function markInterviewQuestionViewed(viewedIds: Set<string>, questionId: string) {
  if (viewedIds.has(questionId)) return viewedIds

  const next = new Set(viewedIds)
  next.add(questionId)
  return next
}
