export interface InterviewEvidence {
  label: string
  href?: string
}

export interface InterviewQuestion {
  id: string
  category: string
  question: string
  keyPoints: string[]
  answer: string
  answerStructure: string[]
  evidence: InterviewEvidence[]
  followUps: string[]
  relatedSection?: {
    label: string
    href: string
  }
}
