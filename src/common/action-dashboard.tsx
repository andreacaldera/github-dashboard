import React, { useEffect, useState } from 'react'
import { ActionsStatus } from './project-status'

import { TableHead, TableRow } from '@mui/material'

import { ProjectCard } from './components/project-card'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import { StatusRow } from './components/status-row'
import styled from '@emotion/styled'
import { useDate, useDateDifference } from './use-date'

const DATA_FETCH_INTERVAL = 60 * 1000

interface Props {
  organisation: string
  project: string
  action: string
  nxApp?: string
}

const Avatar = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: -0.5rem;
  margin-right: 0.5rem;
`

const CommitMessage = styled(TableCell)`
  max-width: 20vw;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const ActionDashboard: React.FunctionComponent<Props> = ({
  organisation,
  project,
  action,
  nxApp,
}) => {
  const [actionsData, setActionsData] = useState<ActionsStatus>()

  const fetchFromApi = async () => {
    const data = await fetch(
      `/api/action-summary?organisation=${organisation}&project=${project}&action=${action}${
        nxApp ? `&nxApp=${nxApp}` : ''
      }`
    )
    console.log('status', data.status)
    if (data.status >= 400) {
      console.error('Unable to retrieve data')
    }
    const body = await data.json()
    setActionsData(body)
  }

  useEffect(() => {
    void fetchFromApi()
    const dataFetch = setInterval(fetchFromApi, DATA_FETCH_INTERVAL)
    return () => {
      clearTimeout(dataFetch)
    }
  }, [])

  return (
    <div>
      <ProjectCard
        lastUpdated={actionsData?.created}
        title={
          <div>
            <a
              href={`https://github.com/${organisation}/${project}/actions/workflows/${action}.yml`}
              target={`https://github.com/${organisation}/${project}/actions/workflows/${action}.yml`}
            >
              {organisation} / {project} / {action} {nxApp && ` / ${nxApp}`}
            </a>
          </div>
        }
      >
        <Table aria-label="Project actions">
          <TableHead>
            <TableRow>
              <TableCell align="left">Commit</TableCell>
              <TableCell align="left">Run</TableCell>
              <TableCell align="left">Author</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Conclusion</TableCell>
              <TableCell align="left">Started at</TableCell>
              <TableCell align="left">Completed at</TableCell>
              <TableCell align="left">Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actionsData?.data.map((actionData, i) => {
              const { conclusion, status } = actionData
              return (
                <StatusRow
                  conclusion={conclusion}
                  runningStatus={status}
                  key={actionData.head_sha}
                >
                  <CommitMessage align="left">
                    <a
                      href={`https://github.com/${organisation}/${project}/commit/${actionData.head_sha}`}
                      target={`commit-url-${actionData.head_commit.message}`}
                    >
                      {actionData.head_commit.message}
                    </a>
                  </CommitMessage>
                  <TableCell align="left">
                    <a
                      href={actionData.html_url}
                      target={`run-url-${actionData.html_url}`}
                    >
                      {actionData.run_number}
                    </a>
                  </TableCell>
                  <TableCell align="left">
                    <a
                      href={actionData.actor.html_url}
                      target={`login-${actionData.actor.login}`}
                    >
                      <Avatar src={actionData.actor.avatar_url} />
                      {actionData.actor.login}
                    </a>
                  </TableCell>
                  <TableCell align="left">{actionData.status}</TableCell>
                  <TableCell align="left">{conclusion}</TableCell>
                  <TableCell align="left">
                    {useDate(actionData.created_at)}
                  </TableCell>
                  <TableCell align="left">
                    {useDate(actionData.updated_at)}
                  </TableCell>
                  <TableCell align="left">
                    {useDateDifference(
                      actionData.created_at,
                      actionData.updated_at
                    )}{' '}
                    minutes
                  </TableCell>
                </StatusRow>
              )
            })}
          </TableBody>
        </Table>
      </ProjectCard>
    </div>
  )
}
