import {
  IconButton,
  CardHeader,
  CardContent,
  Typography,
  Collapse,
  TableContainer,
  Paper,
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

import React from 'react'
import styled from '@emotion/styled'

import { Card } from '@mui/material'
import { useRelativeDate } from '../use-date'

const StyledCard = styled(Card)`
  margin: 1rem 0;
`

type Props = {
  title: React.ReactElement
  lastUpdated?: string
  children: React.ReactElement
}

export const ProjectCard = ({ title, children, lastUpdated }: Props) => {
  const [expanded, setExpanded] = React.useState(false)
  return (
    <StyledCard>
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
        title={title}
        subheader={useRelativeDate(lastUpdated, {
          defaultMessage: 'Loading...',
          prefix: 'Updated ',
        })}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography color="textSecondary" component="p">
            Last update: {useRelativeDate(lastUpdated)}
          </Typography>
          <Typography color="textSecondary" component="p">
            Average execution time: N/A
          </Typography>
          <TableContainer component={Paper}>{children}</TableContainer>
        </CardContent>
      </Collapse>
    </StyledCard>
  )
}
