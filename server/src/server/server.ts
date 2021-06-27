import express from 'express'
import { createActionStatusRouter } from './routes/action-status'
const app = express()
const port = 4001

// define a route handler for the default home page
app.get('/api', (_req, res) => {
  res.send('Hello world!')
})

app.use('/api', createActionStatusRouter())

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
