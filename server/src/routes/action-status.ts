import { Router } from 'express'
import { getGithubData } from '../service/github-service'

export const createActionStatusRouter = (): Router => {
  const router = Router()

  router.get('/action-status', async (req, res) => {
    const organisation = req.query.organisation as string
    const project = req.query.project as string
    const action = req.query.action as string | undefined

    try {
      const data = await getGithubData(organisation, project, action)
      res.json(data)
    } catch (error) {
      console.error(error)
      res.status(500).send(error.message)
    }
  })

  return router
}
