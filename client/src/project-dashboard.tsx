import {
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Typography
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'

const DATA_FETCH_INTERVAL = 30 * 1000

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: '3rem'
  },
  table: {},
  success: {
    background: '#28a745'
  },
  failure: {
    background: '#dc3545'
  },
  running: {
    background: '#6c757d'
  },
  root: {
    width: '100%'
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
}

export const ProjectDashboard: React.FunctionComponent<Props> = ({
  organisation,
  project
}) => {
  const [projectStatus, setProjectStatus] = useState<any[]>([]) // todo type
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const classes = useStyles()

  const fetchFromApi = async () => {
    const data = await fetch(
      `/api/action-status?organisation=${organisation}&project=${project}`
    )
    const body = await data.json()
    setProjectStatus(body)
    setLastUpdated(new Date())
  }

  useEffect(() => {
    void fetchFromApi()
    const dataFetch = setTimeout(fetchFromApi, DATA_FETCH_INTERVAL)
    return () => {
      clearTimeout(dataFetch)
    }
  }, [])

  return (
    <div className={classes.container}>
      <Card className={`${classes.root}`}>
        <CardHeader action={null} title={`${organisation} / ${project}`} />

        <CardContent>
          <Typography color="textSecondary" component="p">
            {lastUpdated && (
              <p>Last update: {format(lastUpdated, `yyyy-MM-dd HH:mm:ss`)}</p>
            )}
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
                  {projectStatus.map(row => {
                    const completedClass =
                      row.conclusion === 'success'
                        ? classes.success
                        : classes.failure
                    const runningClass =
                      row.status !== 'completed' ? classes.running : ''
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
                        <TableCell align="left">{row.started_at}</TableCell>
                        <TableCell align="left">{row.completed_at}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}
