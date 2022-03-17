import cache from 'memory-cache'
import superagent from 'superagent'
import {
  LighthouseResponse,
  LighthouseResults,
  PrData,
  Scores,
} from '../common/lighthouse-type'
import { truthy } from '../common/truthy'

import { getToken } from './get-token'

const dataCache = new cache.Cache()

const CACHE_TIMEOUT = 60 * 1000

export const getPrComments = async (
  token: string,
  organisation: string,
  project: string,
  prNumber: number
): Promise<{ id: string; body: string }[]> => {
  try {
    const { body } = await superagent
      .get(
        `https://api.github.com/repos/${organisation}/${project}/pulls/${prNumber}/reviews`
      )
      .set('Accept', 'application/vnd.github.v3+json')
      .set('User-Agent', ' curl/7.64.1')
      .set('Authorization', `Bearer ${token}`)
    return body
  } catch {
    return []
  }
}

export const getPrData = async (
  token: string,
  organisation: string,
  project: string,
  prNumber: number
): Promise<{ title: string; mergedAt: string } | undefined> => {
  try {
    const { body } = await superagent
      .get(
        `https://api.github.com/repos/${organisation}/${project}/pulls/${prNumber}`
      )
      .set('Accept', 'application/vnd.github.v3+json')
      .set('User-Agent', ' curl/7.64.1')
      .set('Authorization', `Bearer ${token}`)
    return { title: body.title, mergedAt: body.merged_at }
  } catch {
    return undefined
  }
}

const getScore = (text: string, type: string): number => {
  return parseInt(
    text.substring(
      text.indexOf(`https://img.shields.io/badge/${type}-`) +
        `https://img.shields.io/badge/${type}-`.length
    )
  )
}

type LighthouseScore = {
  mobile: Scores
  desktop: Scores
} & PrData

export const getLighthouseScore = async (
  token: string,
  organisation: string,
  project: string,
  prData: PrData
): Promise<LighthouseScore | null> => {
  const comments: { id: string; body: string }[] = await getPrComments(
    token,
    organisation,
    project,
    prData.number
  )

  const lighthouseComments = comments
    .filter(({ body }) => body.includes('generated by lighthouse-check'))
    .sort((a, b) => (a.id > b.id ? -1 : 1))
  if (!lighthouseComments[0]?.body) {
    return null
  }
  const text = lighthouseComments[0]?.body || ''

  const mobile = text.substring(text.indexOf('| desktop |'))
  const desktop = text.substring(0, text.indexOf('| desktop |'))

  return {
    ...prData,
    mobile: {
      bestPractices: getScore(mobile, 'Best%20Practices'),
      accessibility: getScore(mobile, 'Accessibility'),
      performance: getScore(mobile, 'Performance'),
      seo: getScore(mobile, 'SEO'),
    },
    desktop: {
      bestPractices: getScore(desktop, 'Best%20Practices'),
      accessibility: getScore(desktop, 'Accessibility'),
      performance: getScore(desktop, 'Performance'),
      seo: getScore(desktop, 'SEO'),
    },
  }
}

export const getLighthouseScores = async (
  token: string,
  organisation: string,
  project: string
): Promise<LighthouseResults> => {
  const { body } = await superagent
    .get(
      `https://api.github.com/repos/${organisation}/${project}/pulls?per_page=30&state=closed`
    )
    .set('Accept', 'application/vnd.github.v3+json')
    .set('User-Agent', ' curl/7.64.1')
    .set('Authorization', `Bearer ${token}`)

  const prData = body
    .filter(({ merged_at }: any) => merged_at)
    .map(({ number, title, url, merged_at }: any) => ({
      number,
      title,
      url,
      mergedAt: merged_at,
    }))

  const results: LighthouseScore[] = await Promise.all(
    prData.map((data: any) =>
      getLighthouseScore(token, organisation, project, data)
    )
  )

  return results
    .filter(truthy)
    .sort((a: any, b: any) => (a.mergedAt > b.mergedAt ? -1 : 1))
}

export const getLighthouseData = async (
  organisation: string,
  project: string
): Promise<LighthouseResponse> => {
  const token = await getToken()
  const key = `${organisation}/${project}/lighthouse`
  const cachedData = dataCache.get(key)
  if (cachedData) {
    return cachedData as LighthouseResponse
  }

  const scores = await getLighthouseScores(token, organisation, project)

  const data = {
    created: new Date(),
    scores,
  }

  console.info(`Data added to cache using key ${key}`)
  dataCache.put(key, data, CACHE_TIMEOUT)
  return data
}
