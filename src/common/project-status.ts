export interface ProjectCommit {
  headSha: string
  htmlUrl: string
  author: {
    name: string
    htmlUrl: string
  }
  status?: string
  conclusion?: string
  started_at?: string
  completed_at?: string
  commitMessage: string
  jobSummary: ReadonlyArray<{ name: string; conclusion: string }>
}

export interface ProjectStatus {
  created: string
  data: ReadonlyArray<ProjectCommit>
}

export interface ActionStatus {
  id: number
  name: string
  status: string
  conclusion: 'success' | 'failure' | 'skipped'
  html_url: string
  run_number: string
  head_sha: string
}

export interface ActionsStatus {
  created: string
  data: ReadonlyArray<ActionStatus>
}
