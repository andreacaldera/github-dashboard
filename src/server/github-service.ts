import cache from 'memory-cache'
import superagent from 'superagent'

import { getToken } from './get-token'

const dataCache = new cache.Cache()

const CACHE_TIMEOUT = 60 * 1000

const NUMBER_OF_COMMITS = 10

const getCommits = async (
  token: string,
  organisation: string,
  project: string
): Promise<any[]> => {
  const { body } = await superagent
    .get(`https://api.github.com/repos/${organisation}/${project}/commits`)
    .set('Accept', 'application/vnd.github.v3+json')
    .set('User-Agent', ' curl/7.64.1')
    .set('Authorization', `Bearer ${token}`)
  const commits = body.slice(0, NUMBER_OF_COMMITS)

  return commits
}

const getStatus = async (
  commit: any,
  token: string,
  organisation: string,
  project: string,
  action?: string
): Promise<any> => {
  const checkName = action ? `?check_name=${action}` : ''
  const url = `https://api.github.com/repos/${organisation}/${project}/commits/${commit.sha}/check-runs${checkName}`
  const { body } = await superagent
    .get(url)
    .set('Accept', 'application/vnd.github.v3+json')
    .set('User-Agent', ' curl/7.64.1')
    .set('Authorization', `Bearer ${token}`)
  const { check_runs = [], total_count } = body
  if (total_count !== 1) {
    console.warn(
      `Expected one result but got ${body.total_count} for using ${url}`
    )
  }
  const author = {
    htmlUrl: commit.committer.html_url,
    name: commit.commit.author.name,
  }

  return {
    status: check_runs[0]?.status,
    conclusion: check_runs[0]?.conclusion,
    started_at: check_runs[0]?.started_at,
    completed_at: check_runs[0]?.completed_at,
    headSha: commit.sha,
    htmlUrl: commit.html_url,
    author,
    commitMessage: commit.commit.message,
  }
}

export const getGithubData = async (
  organisation: string,
  project: string,
  action?: string
): Promise<any> => {
  const token = await getToken()
  const key = `${organisation}/${project}/${action || ''}`
  const cachedData = dataCache.get(key)
  if (cachedData) {
    return cachedData
  }

  const commits = await getCommits(token, organisation, project)
  const commitData = await Promise.all(
    commits.map((commit) =>
      getStatus(commit, token, organisation, project, action)
    )
  )
  const data = {
    created: new Date(),
    commits: commitData,
  }

  console.info(`Data added to cache using key ${key}`)
  dataCache.put(key, data, CACHE_TIMEOUT)
  return data
}
