import { ResetTv } from '@mui/icons-material'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import { githubApi, openPrs } from '../../src/server/github-service'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const organisation = req.query.organisation as string
  const project = req.query.project as string
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).end()
  }

  try {
    const response = await openPrs({ organisation, project })
    res.send(response)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
}
