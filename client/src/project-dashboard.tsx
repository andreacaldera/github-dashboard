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
import { useDate } from './useDate'

const DATA_FETCH_INTERVAL = 30 * 1000

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

export const ProjectDashboard: React.FunctionComponent<Props> = ({
  organisation,
  project,
  action
}) => {
  const [projectStatus, setProjectStatus] = useState<any>() // todo type
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
    const dataFetch = setTimeout(fetchFromApi, DATA_FETCH_INTERVAL)
    return () => {
      clearTimeout(dataFetch)
    }
  }, [])

  const subheader = useDate(projectStatus?.created, `Last update: `)

  const firstCommit = projectStatus ? projectStatus.commits[0] : null
  const completedProject =
    firstCommit?.conclusion === 'success'
      ? classes.successFont
      : classes.failureFont

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
              {organisation} / {project} {status ? `: ${status}` : ''}
            </div>
          }
          subheader={subheader}
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
                    {projectStatus?.commits.map((row: any) => {
                      const { conclusion, status } = row
                      const completedClass =
                        conclusion === 'success'
                          ? classes.success
                          : classes.failure
                      const runningClass =
                        status !== 'completed' ? classes.running : ''
                      return (
                        <TableRow
                          key={row.commitSha}
                          className={runningClass || completedClass}
                        >
                          <TableCell align="left">
                            <a
                              href={row.commit.html_url}
                              target={`commit-url-${row.head_sha}`}
                            >
                              {row.head_sha}
                            </a>
                          </TableCell>
                          <TableCell align="left">
                            {row.commit.commit.author.name}
                          </TableCell>
                          <TableCell align="left">{row.status}</TableCell>
                          <TableCell align="left">{row.conclusion}</TableCell>
                          <TableCell align="left">
                            <a href={row.html_url} target={row.html_url}>
                              View action
                            </a>
                          </TableCell>
                          <TableCell align="left">
                            {useDate(row.started_at)}
                          </TableCell>
                          <TableCell align="left">
                            {useDate(row.completed_at)}
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
