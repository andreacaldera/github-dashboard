import request from 'superagent'
import { getToken } from './service/get-token'

const run = async (): Promise<void> => {
  const { body } = await request
    .get(
      'https://api.github.com/repos/org-name/repo-name/commits/sha/check-runs'
    )
    .set('Accept', 'application/vnd.github.v3+json')
    .set('User-Agent', ' curl/7.64.1')
    .set('Authorization', `Bearer ${await getToken()}`)
  console.log(JSON.stringify(body, null, 2))
}

run()
  .then(() => {
    console.log('Run completed')
  })
  .catch(error => {
    console.error('Error', error)
  })
