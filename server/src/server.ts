import express from 'express'
import { createActionStatusRouter } from './routes/action-status'
const app = express()
const port = 4001

app.use('/api', createActionStatusRouter())

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
