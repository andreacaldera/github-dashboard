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
}

export interface ProjectStatus {
  created: Date
  commits: ReadonlyArray<ProjectCommit>
}
