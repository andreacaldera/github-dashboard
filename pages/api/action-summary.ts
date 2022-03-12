import { getSession } from 'next-auth/react'
import {
  getGithubData,
  getReleaseJobData,
} from '../../src/server/github-service'

export default async (req, res) => {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).end()
  }
  const organisation = req.query.organisation as string
  const project = req.query.project as string
  const action = req.query.action as string | undefined

  console.log(1111)
  try {
    const data = await getReleaseJobData(organisation, project, action)
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
}
