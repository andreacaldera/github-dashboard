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
  actor: {
    login: string
    avatar_url: string
    html_url: string
  }
  head_commit: {
    message: string
  }
  created_at: string
  updated_at: string
  jobs: {
    total_count: number
    jobs: ReadonlyArray<{
      id: number
      status: string
      conclusion: string
      started_at: string
      completed_at: string
      name: string
      steps: ReadonlyArray<{
        name: string
        status: string
        conclusion: string
        started_at: string
        updated_at: string
      }>
    }>
  }
}

export interface ActionsStatus {
  created: string
  data: ReadonlyArray<ActionStatus>
}
