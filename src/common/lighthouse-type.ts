export type Scores = {
  bestPractices: number
  accessibility: number
  performance: number
  seo: number
}

export type PrData = {
  number: number
  title: string
  url: string
  mergedAt: string | null
}

export type LighthouseResults = ReadonlyArray<
  {
    mobile: Scores
    desktop: Scores
  } & PrData
>

export type LighthouseResponse = {
  created: Date
  scores: LighthouseResults
}
