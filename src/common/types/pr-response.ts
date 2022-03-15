export type PrResponse = {
  data: ReadonlyArray<{
    user: {
      login: string
    }
    state: string
    title: string
    number: number
    url: string
    html_url: string
    compareStatus: string
    created_at: string
    updated_at: string
    draft: boolean
    auto_merge: boolean
    requested_teams: ReadonlyArray<{ name: string }>
    prData: { mergeable_state: string }
  }>
}
