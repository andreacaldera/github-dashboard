import { getLighthouseData } from '../../src/server/lighthouse-service'

export default async (req, res) => {
  const organisation = req.query.organisation as string
  const project = req.query.project as string

  try {
    const data = await getLighthouseData(organisation, project)
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
}
