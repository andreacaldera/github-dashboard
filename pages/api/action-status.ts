import { getSession } from 'next-auth/react'
import { getGithubData } from '../../src/server/github-service'

export default async (req, res) => {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).end()
  }
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
}
