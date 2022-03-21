import cache from 'memory-cache'
import superagent from 'superagent'

import { getToken } from './get-token'
import { logger } from './logger'
import { writeFileSync, readFileSync } from 'fs'

const dataCache = new cache.Cache()

const CACHE_TIMEOUT = 60 * 1000

const NUMBER_OF_COMMITS = 10

const cacheResponse = async (
  cacheKey: string,
  loader: () => Promise<any>
): Promise<any> => {
  const filename = `${process.cwd()}/github-responses/${cacheKey.replace(
    /\//g,
    '-'
  )}`
  if (process.env.USE_FILES) {
    logger.warn(`Returning content from file instead of hitting Github API`)
    return readFileSync(filename)
  }
  const cachedData = dataCache.get(cacheKey)
  if (cachedData) {
    logger.debug(`Using cache for key ${cacheKey}`)
    return cachedData
  }
  const data = {
    created: new Date(),
    data: await loader(),
  }

  await writeFileSync(filename, JSON.stringify(data, null, 2))
  dataCache.put(cacheKey, data, CACHE_TIMEOUT)
  logger.info(`Data added to cache using key ${cacheKey}`)
  return data
}

export const githubApi = async (endpoint: string) => {
  return cacheResponse(endpoint, async () => {
    const token = getToken()
    const url = endpoint.startsWith('http')
      ? endpoint
      : `https://api.github.com/${endpoint}`
    const { body } = await superagent
      .get(url)
      .set('Accept', 'application/vnd.github.v3+json')
      .set('User-Agent', ' curl/7.64.1')
      .set('Authorization', `Bearer ${token}`)
    return body
  })
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
  project: string
): Promise<any> => {
  const body = await githubApi(
    `repos/${organisation}/${project}/commits/${commit.sha}/check-runs`
  )
  const { check_runs = [], total_count } = body as any

  const jobSummary = body.check_runs.map(({ name, conclusion }: any) => ({
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

  const conclusion = body.check_runs.reduce(
    (result: any, { conclusion }: any) => {
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
    },
    ''
  )

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

export const openPrs = async ({
  organisation,
  project,
}: {
  organisation: string
  project: string
}) => {
  const key = `open-prs/${organisation}/${project}`
  return cacheResponse(key, async () => {
    const body = await githubApi(
      `repos/${organisation}/${project}/pulls?per_page=10`
    )
    return Promise.all(
      body.map(async (pr: any) => {
        const prSha = pr.head.ref
        const prData = await githubApi(
          `repos/${organisation}/${project}/pulls/${pr.number}`
        )
        const compare = await githubApi(
          `repos/${organisation}/${project}/compare/${prSha}...main`
        ).catch(() => {
          logger.warn(`Unable to compare branch ${prSha}`)
          return pr
        })
        return { ...pr, prData, compareStatus: compare.status }
      })
    )
  })
}

export const getGithubData = async (
  organisation: string,
  project: string
): Promise<any> => {
  const key = `${organisation}/${project}`
  return cacheResponse(key, async () => {
    const commits = await getCommits(organisation, project)
    return Promise.all(
      commits.map((commit) => getStatus(commit, organisation, project))
    )
  })
}

export const getReleaseJobData = async (
  organisation: string,
  project: string,
  action: string,
  nxApp?: string
): Promise<any> => {
  const key = `actions/${organisation}/${project}/${nxApp || '_no_app'}`

  return cacheResponse(key, async () => {
    const { data } = (await githubApi(
      `repos/${organisation}/${project}/actions/runs?&exclude_pull_requests=false&branch=main`
    )) as any

    const releases = data.workflow_runs.filter(
      ({ name }: any) => name === action
    )
    const withJobs = await Promise.all(
      releases.map(async (r: any) => {
        const { data } = await githubApi(r.jobs_url)
        return { ...r, jobs: data }
      })
    )
    return withJobs.filter(({ jobs }) => {
      return !nxApp || jobs.jobs.some(({ name }: any) => name.includes(nxApp))
    })
  })
}
