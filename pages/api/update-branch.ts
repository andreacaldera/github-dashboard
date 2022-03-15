import { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react'
import superagent from 'superagent'
import { getToken } from '../../src/server/get-token'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }
  const organisation = req.query.organisation
  const project = req.query.project
  const prNumber = req.query.prNumber
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).end()
  }
  const token = getToken()
  try {
    await superagent
      .put(
        `https://api.github.com/repos/${organisation}/${project}/pulls/${prNumber}/update-branch`
      )
      .set('User-Agent', ' curl/7.64.1')
      .set('Authorization', `Bearer ${token}`)

    res.send('done')
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
}
