import cache from 'memory-cache'
import superagent from 'superagent'

import { getToken } from './get-token'

const dataCache = new cache.Cache()

const CACHE_TIMEOUT = 60 * 1000

const NUMBER_OF_COMMITS = 10

const githubApi = async (path: string) => {
  const token = getToken()
  const url = `https://api.github.com/${path}`
  const { body } = await superagent
    .get(url)
    .set('Accept', 'application/vnd.github.v3+json')
    .set('User-Agent', ' curl/7.64.1')
    .set('Authorization', `Bearer ${token}`)
  return body
}

const getCommits = async (
  organisation: string,
  project: string
): Promise<any[]> => {
  const body = await githubApi(`repos/${organisation}/${project}/commits`)
  const commits = body.slice(0, NUMBER_OF_COMMITS)

  return commits
}

const getStatus = async (
  commit: any,
  organisation: string,
  project: string,
  action?: string
): Promise<any> => {
  const checkName = action ? `?check_name=${action}` : ''
  const body = await githubApi(
    `repos/${organisation}/${project}/commits/${commit.sha}/check-runs${checkName}`
  )
  const { check_runs = [], total_count } = body

  const jobSummary = body.check_runs.map(({ name, conclusion }) => ({
    name,
    conclusion,
  }))

  if (total_count !== 1) {
    console.warn(`Expected one result but got ${body.total_count}`)
  }
  const author = {
    htmlUrl: commit.committer.html_url,
    name: commit.commit.author.name,
  }

  const conclusion = body.check_runs.reduce((result, { conclusion }) => {
    if (conclusion === 'skipped') {
      return result || conclusion
    }
    if (conclusion === 'success' && (result === 'success' || !result)) {
      return conclusion
    }
    if (conclusion === 'failure') {
      return conclusion
    }
    return result
  }, '')

  return {
    status: check_runs[0]?.status,
    conclusion,
    jobSummary,
    started_at: check_runs[0]?.started_at,
    completed_at: check_runs[0]?.completed_at,
    headSha: commit.sha,
    htmlUrl: commit.html_url,
    author,
    commitMessage: commit.commit.message,
  }
}

const cacheResponse = async (
  cacheKey: string,
  loader: () => Promise<any>
): Promise<any> => {
  const cachedData = dataCache.get(cacheKey)
  if (cachedData) {
    return cachedData
  }
  const data = {
    created: new Date(),
    data: await loader(),
  }

  dataCache.put(cacheKey, data, CACHE_TIMEOUT)
  console.info(`Data added to cache using key ${cacheKey}`)
  return data
}

export const getGithubData = async (
  organisation: string,
  project: string,
  action?: string
): Promise<any> => {
  const key = `${organisation}/${project}/${action || ''}`
  return cacheResponse(key, async () => {
    const commits = await getCommits(organisation, project)
    return Promise.all(
      commits.map((commit) => getStatus(commit, organisation, project, action))
    )
  })
}

export const getReleaseJobData = async (
  organisation: string,
  project: string
): Promise<any> => {
  const key = `actions/${organisation}/${project}`
  return cacheResponse(key, async () => {
    const body = await githubApi(
      `repos/${organisation}/${project}/actions/runs`
    )

    const releases = body.workflow_runs.filter(({ name }) => name === 'Release')
    return releases
  })
}
