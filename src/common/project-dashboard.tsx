import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { ProjectStatus } from './project-status'
import { ProjectSubheader } from './project-subheader'
import { useCommitData } from './use-commit-data'
import { useDate, useRelativeDate } from './use-date'
import { Modal, Button } from '@mui/material'
import styled from '@emotion/styled'

const DATA_FETCH_INTERVAL = 60 * 1000

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  table: {},
  success: {
    background: theme.palette.success.main,
  },
  failure: {
    background: theme.palette.error.main,
  },
  successFont: {
    '& a': {
      color: `${theme.palette.success.main} !important`,
    },
  },
  runningFont: {
    '& a': {
      color: `${theme.palette.warning.light} !important`,
    },
  },
  failureFont: {
    '& a': {
      color: `${theme.palette.error.main} !important`,
    },
  },
  running: {
    background: theme.palette.warning.light,
  },
  root: {
    paddingLeft: '5rem',
    paddingRight: '5rem',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}))

const StyledModal = styled(Modal)`
  background: white;
  margin: auto;
  width: 40vw;
  height: 20vw;
`

interface Props {
  organisation: string
  project: string
  action?: string
}

const StyleButton = styled(Button)`
  color: black;
  background: grey;
`

export const ProjectDashboard: React.FunctionComponent<Props> = ({
  organisation,
  project,
  action,
}) => {
  const [commitData, setCommitData] = useState<ProjectStatus | undefined>()
  const { getLastCommit, getLastSuccessfulCommit, getAverageCommitTime } =
    useCommitData(commitData)
  const [expanded, setExpanded] = React.useState(false)
  const [jobSummary, setJobSummary] =
    useState<ProjectStatus['commits'][0]['jobSummary']>()
  const classes = useStyles()

  const fetchFromApi = async () => {
    const data = await fetch(
      `/api/action-status?organisation=${organisation}&project=${project}${
        action ? `&action=${action}` : ''
      }`
    )
    const body = await data.json()
    setCommitData(body)
  }

  useEffect(() => {
    void fetchFromApi()
    const dataFetch = setInterval(fetchFromApi, DATA_FETCH_INTERVAL)
    return () => {
      clearTimeout(dataFetch)
    }
  }, [])

  const firstCommit = getLastCommit()
  const completedProject =
    firstCommit?.conclusion === 'success'
      ? classes.successFont
      : classes.failureFont

  const runningProject =
    firstCommit?.status !== 'completed' ? classes.runningFont : ''

  const lastSuccessfulCommit = getLastSuccessfulCommit()

  return (
    <div className={classes.container}>
      <Card className={`${classes.root}`}>
        <CardHeader
          action={
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          title={
            <div className={runningProject || completedProject}>
              <a
                href={`https://github.com/${organisation}/${project}/commits`}
                target={`https://github.com/${organisation}/${project}/commits`}
              >
                {organisation} / {project}
              </a>
            </div>
          }
          subheader={
            <ProjectSubheader lastSuccessfulCommit={lastSuccessfulCommit} />
          }
        />
        <StyledModal open={!!jobSummary}>
          <>
            <StyleButton onClick={() => setJobSummary(undefined)}>
              Close
            </StyleButton>
            <ul>
              {jobSummary?.map(({ name, conclusion }) => {
                const completedClass =
                  conclusion === 'success' ? classes.success : classes.failure
                return (
                  <li className={completedClass}>
                    {name}: {conclusion}
                  </li>
                )
              })}
            </ul>
          </>
        </StyledModal>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography color="textSecondary" component="p">
              Last update: {useRelativeDate(commitData?.created)} ago
            </Typography>
            <Typography color="textSecondary" component="p">
              Average execution time: {getAverageCommitTime()} minutes
            </Typography>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Commit</TableCell>
                    <TableCell align="left">Author</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Conclusion</TableCell>
                    <TableCell align="left">Action</TableCell>
                    <TableCell align="left">Started at</TableCell>
                    <TableCell align="left">Completed at</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commitData?.commits.map((commit, i) => {
                    const { conclusion, status } = commit
                    const completedClass =
                      conclusion === 'success'
                        ? classes.success
                        : classes.failure
                    const runningClass =
                      status !== 'completed' ? classes.running : ''
                    return (
                      <TableRow
                        key={commit.headSha || `${organisation}${project}${i}`}
                        className={runningClass || completedClass}
                      >
                        <TableCell align="left">
                          <a
                            href={commit.htmlUrl}
                            target={`commit-url-${commit.headSha}`}
                          >
                            {commit.commitMessage.substring(0, 50)}
                          </a>
                          <StyleButton
                            onClick={() => setJobSummary(commit.jobSummary)}
                          >
                            Job summary
                          </StyleButton>
                        </TableCell>
                        {/* <TableCell align="left">
                          {commit.jobSummary
                            .map(
                              ({ name, conclusion }) => `${name}: ${conclusion}`
                            )
                            .join('\n')}
                        </TableCell> */}
                        <TableCell align="left">
                          <Link
                            href={commit.author.htmlUrl}
                            target={commit.author.htmlUrl}
                          >
                            {commit.author.name}
                          </Link>
                        </TableCell>
                        <TableCell align="left">{commit.status}</TableCell>
                        <TableCell align="left">{conclusion}</TableCell>
                        <TableCell align="left">
                          <a href={commit.htmlUrl} target={commit.htmlUrl}>
                            View action
                          </a>
                        </TableCell>
                        <TableCell align="left">
                          {useDate(commit.started_at)}
                        </TableCell>
                        <TableCell align="left">
                          {useDate(commit.completed_at)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  )
}
