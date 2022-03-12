import React, { useEffect, useState } from 'react'
import { ActionsStatus } from './project-status'

import { TableHead, TableRow } from '@mui/material'

import { ProjectCard } from './components/project-card'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import { StatusRow } from './components/status-row'

const DATA_FETCH_INTERVAL = 60 * 1000

interface Props {
  organisation: string
  project: string
  action: string
}

export const ActionDashboard: React.FunctionComponent<Props> = ({
  organisation,
  project,
  action,
}) => {
  const [actionsData, setActionsData] = useState<ActionsStatus>()

  const fetchFromApi = async () => {
    const data = await fetch(
      `/api/test?organisation=${organisation}&project=${project}${
        action ? `&action=${action}` : ''
      }`
    )
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
        title={
          <div>
            <a
              href={`https://github.com/${organisation}/${project}/actions/workflows/${action}.yml`}
              target={`https://github.com/${organisation}/${project}/actions/workflows/${action}.yml`}
            >
              {organisation} / {project}
            </a>
          </div>
        }
      >
        <Table aria-label="Project actions">
          <TableHead>
            <TableRow>
              <TableCell align="left">Run</TableCell>
              <TableCell align="left">Author</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Conclusion</TableCell>
              <TableCell align="left">Action</TableCell>
              <TableCell align="left">Started at</TableCell>
              <TableCell align="left">Completed at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actionsData?.actions.map((actionData, i) => {
              const { conclusion, status } = actionData
              return (
                <StatusRow
                  conclusion={conclusion}
                  runningStatus={status}
                  key={actionData.head_sha}
                >
                  <TableCell align="left">
                    <a
                      href={actionData.html_url}
                      target={`commit-url-${actionData.html_url}`}
                    >
                      {actionData.name} #{actionData.run_number}
                    </a>
                  </TableCell>
                  <TableCell align="left">N/A</TableCell>
                  <TableCell align="left">{actionData.status}</TableCell>
                  <TableCell align="left">{conclusion}</TableCell>
                  <TableCell align="left">
                    <a href={actionData.html_url} target={actionData.html_url}>
                      View action
                    </a>
                  </TableCell>
                  <TableCell align="left">N/A</TableCell>
                  <TableCell align="left">N/A</TableCell>
                </StatusRow>
              )
            })}
          </TableBody>
        </Table>
      </ProjectCard>
    </div>
  )
}
