import { Router } from 'express'
import superagent from 'superagent'
import { getToken } from '../get-token'
import sampleResponse from './sample-response.json'

const getCommits = async (
  token: string,
  organisation: string,
  project: string
): Promise<string[]> => {
  const { body } = await superagent
    .get(`https://api.github.com/repos/${organisation}/${project}/commits`)
    .set('Accept', 'application/vnd.github.v3+json')
    .set('User-Agent', ' curl/7.64.1')
    .set('Authorization', `Bearer ${token}`)
  const commits = body.slice(0, 5)

  return commits
}

const getStatus = async (
  token: string,
  organisation: string,
  project: string,
  commit: any
) => {
  const { body } = await superagent
    .get(
      `https://api.github.com/repos/${organisation}/${project}/commits/${commit.sha}/check-runs` // ?check_name=Build+and+deploy
    )
    .set('Accept', 'application/vnd.github.v3+json')
    .set('User-Agent', ' curl/7.64.1')
    .set('Authorization', `Bearer ${token}`)
  if (body.total_count !== 1) {
    console.warn(
      `Expected one result but got ${body.total_count} for commit ${commit.sha}`
    )
  }

  return { ...body.check_runs[0], commit }
}

export const createActionStatusRouter = (): Router => {
  const router = Router()

  router.get('/action-status', async (req, res) => {
    const organisation = req.query.organisation as string
    const project = req.query.project as string

    try {
      const token = await getToken()
      if (Date.now() < 0) {
        res.json(sampleResponse)
        return
      }
      const commits = await getCommits(token, organisation, project)
      const data = await Promise.all(
        commits.map(commit => getStatus(token, organisation, project, commit))
      )
      res.json(data)
    } catch (error) {
      console.error(error)
      res.status(500).send(error.message)
    }
  })

  return router
}
