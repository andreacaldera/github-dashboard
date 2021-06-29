import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
  Typography
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
import { ProjectSubheader } from './project-subheader'
import { useCommitData } from './use-commit-data'
import { useDate } from './use-date'

const DATA_FETCH_INTERVAL = 60 * 1000

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2)
  },
  table: {},
  success: {
    background: theme.palette.success.main
  },
  failure: {
    background: theme.palette.error.main
  },
  successFont: {
    color: theme.palette.success.main
  },
  failureFont: {
    color: theme.palette.error.main
  },
  running: {
    background: theme.palette.warning.light
  },
  root: {
    paddingLeft: '5rem',
    paddingRight: '5rem'
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
}))

interface Props {
  organisation: string
  project: string
  action?: string
}

export type Commit = {
  conclusion: string
  status: string
  commitSha: string
  head_sha: string
  started_at?: string
  completed_at?: string
  html_url?: string
  commit: {
    author: string
    html_url?: string
    commit: { author: { name: string } }
  }
}

export type CommitData = {
  commits: ReadonlyArray<Commit>
  created: string
}

export const ProjectDashboard: React.FunctionComponent<Props> = ({
  organisation,
  project,
  action
}) => {
  const { getLastCommit, getLastSuccessfulCommit } = useCommitData()
  const [projectStatus, setProjectStatus] = useState<CommitData | undefined>()
  const [expanded, setExpanded] = React.useState(false)
  const classes = useStyles()

  const fetchFromApi = async () => {
    const data = await fetch(
      `/api/action-status?organisation=${organisation}&project=${project}${
        action ? `&action=${action}` : ''
      }`
    )
    const body = await data.json()
    setProjectStatus(body)
  }

  useEffect(() => {
    void fetchFromApi()
    const dataFetch = setInterval(fetchFromApi, DATA_FETCH_INTERVAL)
    return () => {
      clearTimeout(dataFetch)
    }
  }, [])

  const lastUpdated = useDate(projectStatus?.created, `Last update: `)

  const firstCommit = getLastCommit(projectStatus)
  const completedProject =
    firstCommit?.conclusion === 'success'
      ? classes.successFont
      : classes.failureFont

  const lastSuccessfulCommit = getLastSuccessfulCommit(projectStatus)

  return (
    <div className={classes.container}>
      <Card className={`${classes.root}`}>
        <CardHeader
          action={
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          title={
            <div className={firstCommit?.conclusion && completedProject}>
              {organisation} / {project}
            </div>
          }
          subheader={
            <ProjectSubheader
              lastUpdated={lastUpdated}
              lastSuccessfulCommit={lastSuccessfulCommit}
            />
          }
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography color="textSecondary" component="p">
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Commit SHA</TableCell>
                      <TableCell align="left">Author</TableCell>
                      <TableCell align="left">Status</TableCell>
                      <TableCell align="left">Conclusion</TableCell>
                      <TableCell align="left">Action</TableCell>
                      <TableCell align="left">Started at</TableCell>
                      <TableCell align="left">Completed at</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectStatus?.commits.map(commit => {
                      const { conclusion, status } = commit
                      const completedClass =
                        conclusion === 'success'
                          ? classes.success
                          : classes.failure
                      const runningClass =
                        status !== 'completed' ? classes.running : ''
                      return (
                        <TableRow
                          key={commit.commitSha || Date.now()}
                          className={runningClass || completedClass}
                        >
                          <TableCell align="left">
                            <a
                              href={commit.commit.html_url}
                              target={`commit-url-${commit.head_sha}`}
                            >
                              {commit.head_sha}
                            </a>
                          </TableCell>
                          <TableCell align="left">
                            {commit.commit.commit.author.name}
                          </TableCell>
                          <TableCell align="left">{commit.status}</TableCell>
                          <TableCell align="left">{conclusion}</TableCell>
                          <TableCell align="left">
                            <a href={commit.html_url} target={commit.html_url}>
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
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  )
}
