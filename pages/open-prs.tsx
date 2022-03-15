import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { PrResponse } from '../src/common/types/pr-response'

const DATA_FETCH_INTERVAL = 60 * 1000

const Home = () => {
  const { data: session } = useSession()
  const [prData, setPrData] = useState<PrResponse>()

  const fetchFromApi = async () => {
    const data = await fetch(
      `/api/open-prs?organisation=DigitalInnovation&project=onyx-nx`
    )
    console.log('status', data.status)
    if (data.status >= 400) {
      console.error('Unable to retrieve data')
    }
    const body = await data.json()
    setPrData(body)
  }

  const updateBranch = (prNumber: number) => {
    void fetch(
      `/api/update-branch?organisation=DigitalInnovation&project=onyx-nx&prNumber=${prNumber}`,
      { method: 'PUT' }
    )
  }

  useEffect(() => {
    void fetchFromApi()
    const dataFetch = setInterval(fetchFromApi, DATA_FETCH_INTERVAL)
    return () => {
      clearTimeout(dataFetch)
    }
  }, [])
  if (!session?.user) {
    return <p>Please login to access this page</p>
  }
  return (
    <>
      <Typography variant="h3" component="h3">
        Open PRs
      </Typography>
      <Table aria-label="Open PRs">
        <TableHead>
          <TableRow>
            <TableCell align="left">PR</TableCell>
            <TableCell align="left">Draft</TableCell>
            <TableCell align="left">Mergeable</TableCell>
            <TableCell align="left">Auto-merge</TableCell>
            <TableCell align="left">Author</TableCell>
            <TableCell align="left">Requires review</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prData?.data.map((pr) => {
            return (
              <TableRow>
                <TableCell align="left">
                  <a href={pr.html_url} target={pr.html_url}>
                    {pr.title} #{pr.number}
                  </a>
                </TableCell>
                <TableCell align="left">
                  {Boolean(pr.draft).toString()}
                </TableCell>
                <TableCell align="left">{pr.prData.mergeable_state}</TableCell>
                <TableCell align="left">
                  {Boolean(pr.auto_merge).toString()}
                </TableCell>

                <TableCell align="left">{pr.user.login}</TableCell>
                <TableCell align="left">
                  {pr.requested_teams.length
                    ? pr.requested_teams.map(({ name }) => name).join(', ')
                    : 'Already reviewed'}
                </TableCell>
                <TableCell align="left">
                  {pr.compareStatus === 'diverged' ? (
                    <Button onClick={() => updateBranch(pr.number)}>
                      Update branch
                    </Button>
                  ) : (
                    'Branch is up to date'
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default Home
