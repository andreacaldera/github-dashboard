import React, { useEffect, useState } from 'react'

import {
  Modal,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from '@mui/material'

import { ProjectCard } from './components/project-card'

import styled from '@emotion/styled'
import { useDate, useDateDifference, useElapsedTime } from './use-date'
import { StyleButton } from './components/button'
import { JobStats } from './components/job-stats'
import { Status } from './components/status'
import { useActionDashboardApi } from './use-action-dashboard-api'
import { useActionRunTimes } from './use-action-run-times'

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

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

export const ActionDashboard: React.FunctionComponent<Props> = ({
  organisation,
  project,
  action,
  nxApp,
}) => {
  const actionsData = useActionDashboardApi({
    organisation,
    project,
    action,
    nxApp,
  })

  const [expandedJobIndexes, setExpandedJobIndexes] = useState<number[]>([])

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
              <span style={{ display: 'inline-block' }}>
                <Status conclusion={actionsData?.data[0].conclusion} />
              </span>{' '}
              {organisation} / {project} / {action} {nxApp && ` / ${nxApp}`}
            </a>
          </div>
        }
      >
        <>
          <div>
            {actionsData?.data && <JobStats actionStatus={actionsData.data} />}
          </div>
          <Table aria-label="Project actions">
            <TableHead>
              <TableRow>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Commit</TableCell>
                <TableCell align="left">Action</TableCell>
                <TableCell align="left">Run</TableCell>
                <TableCell align="left">Author</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Started at</TableCell>
                <TableCell align="left">Completed at</TableCell>
                <TableCell align="left">Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {actionsData?.data.map((actionData, i) => {
                const actionRunTimes = useActionRunTimes(actionData.jobs.jobs)
                return (
                  <TableRow key={actionData.head_sha}>
                    <TableCell align="left">
                      <Status conclusion={actionData.conclusion} />
                    </TableCell>
                    <CommitMessage align="left">
                      <a
                        href={`https://github.com/${organisation}/${project}/commit/${actionData.head_sha}`}
                        target={`commit-url-${actionData.head_commit.message}`}
                      >
                        {actionData.head_commit.message}
                      </a>
                      {expandedJobIndexes.some((ind) => ind === i) && (
                        <List>
                          {actionData?.jobs?.jobs.map(
                            ({
                              name,
                              conclusion,
                              completed_at,
                              started_at,
                            }) => {
                              const elapsedTime = useElapsedTime({
                                completed_at,
                                started_at,
                              })

                              return elapsedTime > 0 ? (
                                <li>
                                  <span style={{ display: 'inline-block' }}>
                                    <Status conclusion={conclusion} />
                                  </span>
                                  <span>
                                    {name}: {elapsedTime} min(s)
                                  </span>
                                </li>
                              ) : null
                            }
                          )}
                        </List>
                      )}
                    </CommitMessage>
                    <TableCell align="left">
                      <StyleButton
                        onClick={() => {
                          if (expandedJobIndexes.some((ind) => ind === i)) {
                            setExpandedJobIndexes(
                              expandedJobIndexes.filter((ind) => ind !== i)
                            )
                          } else {
                            setExpandedJobIndexes([...expandedJobIndexes, i])
                          }
                        }}
                      >
                        {expandedJobIndexes.some((ind) => ind === i)
                          ? 'Show less jobs data'
                          : 'Show more jobs data'}
                      </StyleButton>
                    </TableCell>
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
                    <TableCell align="left">
                      {useDate(actionRunTimes.startDate)}
                    </TableCell>
                    <TableCell align="left">
                      {useDate(actionRunTimes.completedDate)}
                    </TableCell>
                    <TableCell align="left">
                      {actionRunTimes.elapsedTime} min(s)
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      </ProjectCard>
    </div>
  )
}
