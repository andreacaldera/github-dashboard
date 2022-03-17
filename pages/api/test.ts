import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getToken } from '../../src/server/get-token'
import { githubApi } from '../../src/server/github-service'
import superagent from 'superagent'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const organisation = 'DigitalInnovation'
  const project = 'onyx-nx'
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).end()
  }
  try {
    const token = getToken()
    const body = await githubApi(`repos/${organisation}/${project}/pulls`)

    await superagent
      .post('https://api.github.com/repos/andreacaldera/eastendcc-www/merges')
      .set('Accept', 'application/vnd.github.v3+json')
      .set('User-Agent', ' curl/7.64.1')
      .set('Authorization', `Bearer ${token}`)
      .send({ base: 'test-update-pr', head: 'main' })

    const openPrs = body
    res.send(openPrs)
  } catch (error: any) {
    console.error(error)
    res.status(500).send(error.message)
  }
}
