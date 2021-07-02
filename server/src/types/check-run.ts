// todo review this, generated automatically

export interface CheckRun {
  total_count: number
  check_runs?: CheckRunsEntity[]
}
export interface CheckRunsEntity {
  id: number
  node_id: string
  head_sha: string
  external_id: string
  url: string
  html_url: string
  details_url: string
  status: string
  conclusion: string
  started_at: string
  completed_at: string
  output: Output
  name: string
  check_suite: CheckSuite
  app: App
  pull_requests?: null[] | null
}
export interface Output {
  title: string
  summary: string
  text?: null
  annotations_count: number
  annotations_url: string
}
export interface CheckSuite {
  id: number
}
export interface App {
  id: number
  slug: string
  node_id: string
  owner: Owner
  name: string
  description: string
  external_url: string
  html_url: string
  created_at: string
  updated_at: string
  permissions: Permissions
  events?: string[] | null
}
export interface Owner {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}
export interface Permissions {
  actions: string
  checks: string
  contents: string
  deployments: string
  discussions: string
  issues: string
  metadata: string
  organization_packages: string
  packages: string
  pages: string
  pull_requests: string
  repository_hooks: string
  repository_projects: string
  security_events: string
  statuses: string
  vulnerability_alerts: string
}
