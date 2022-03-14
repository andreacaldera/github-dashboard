import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { githubApi } from '../../src/server/github-service'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const organisation = 'DigitalInnovation'
  const project = 'onyx-nx'
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).end()
  }
  try {
    const body = await githubApi(
      `repos/${organisation}/${project}/actions/runs?exclude_pull_requests=true&branch=main`
    )

    const releases = body.workflow_runs.filter(
      ({ name, head_branch }) => head_branch === 'main' && name === 'Release'
    )
    res.send(releases)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
}
