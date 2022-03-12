import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
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
import { LighthouseScore } from './lighthouse-score'
import { LighthouseResponse } from './lighthouse-type'

import { useDate } from './use-date'

const DATA_FETCH_INTERVAL = 5 * 1000

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
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

interface Props {
  organisation: string
  project: string
  action?: string
}

export const LighthouseDashboard: React.FunctionComponent<Props> = ({
  organisation,
  project,
}) => {
  const [lighthouseData, setLighthouseData] = useState<
    LighthouseResponse['scores']
  >([])

  const [expanded, setExpanded] = useState(true)
  const classes = useStyles()

  const fetchFromApi = async () => {
    const data = await fetch(
      `/api/lighthouse-score?organisation=${organisation}&project=${project}`
    )
    if (data.status >= 400) {
      console.error('Unable to retrieve data')
    }
    const body = await data.json()
    setLighthouseData(body.scores)
  }

  useEffect(() => {
    void fetchFromApi()
    const dataFetch = setInterval(fetchFromApi, DATA_FETCH_INTERVAL)
    return () => {
      clearTimeout(dataFetch)
    }
  }, [])

  return (
    <div className={classes.container}>
      <Card>
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
            <div>
              <a
                href={`https://github.com/${organisation}/${project}`}
                target={`https://github.com/${organisation}/${project}`}
              >
                {organisation} / {project} / Jaeger
              </a>
            </div>
          }
          subheader={''}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <TableContainer component={Paper}>
              <Table aria-label="lighthouse results">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">PR</TableCell>
                    <TableCell align="left">Merged At</TableCell>
                    <TableCell align="left">Mobile</TableCell>
                    <TableCell align="left">Desktop</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lighthouseData.map(
                    ({ url, title, number, mergedAt, mobile, desktop }, i) => {
                      const previousData = lighthouseData[i + 1]
                      const prUrl = `https://github.com/${organisation}/${project}/pull/${number}`
                      return (
                        <TableRow key={url}>
                          <TableCell align="left">
                            <a href={prUrl} target={url}>
                              {title}
                            </a>
                          </TableCell>
                          <TableCell align="left">
                            {mergedAt ? useDate(mergedAt) : 'Not merged yet'}
                          </TableCell>
                          <LighthouseScore
                            data={mobile}
                            previousData={previousData?.mobile}
                          />
                          <LighthouseScore
                            data={desktop}
                            previousData={previousData?.desktop}
                          />
                        </TableRow>
                      )
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  )
}
