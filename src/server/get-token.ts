import { readFileSync } from 'fs'
import os from 'os'

const TOKEN_PREFIX = ':_authToken='

export const getToken = async (): Promise<string> => {
  const npmrc = await readFileSync(`${os.homedir()}/.npmrc`)

  const data = npmrc.toString()

  const token = data.substring(
    data.indexOf(TOKEN_PREFIX) + TOKEN_PREFIX.length,
    data.indexOf('\n')
  )
  return token
}
