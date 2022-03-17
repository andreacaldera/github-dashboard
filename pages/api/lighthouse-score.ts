import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getLighthouseData } from '../../src/server/lighthouse-service'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).end()
  }
  const organisation = req.query.organisation as string
  const project = req.query.project as string

  try {
    const data = await getLighthouseData(organisation, project)
    res.json(data)
  } catch (error: any) {
    console.error(error)
    res.status(500).send(error.message)
  }
}
