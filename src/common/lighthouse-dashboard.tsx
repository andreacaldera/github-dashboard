import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { LighthouseScore } from './lighthouse-score'
import { LighthouseResponse } from './lighthouse-type'

import { useDate } from './use-date'

const DATA_FETCH_INTERVAL = 5 * 1000

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

  if (!lighthouseData.length) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <Card>
        <CardHeader
          action={
            <IconButton
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label="show more"
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
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
