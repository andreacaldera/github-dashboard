import {
  IconButton,
  CardHeader,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React from 'react'
import styled from '@emotion/styled'
import clsx from 'clsx'
import { Card } from '@mui/material'
import { useRelativeDate } from '../use-date'

const useStyles = makeStyles((theme) => ({
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

const StyledCard = styled(Card)`
  margin: 1rem 0;
`

type Props = {
  title: React.ReactElement
  lastUpdated?: string
  children: React.ReactElement
}

export const ProjectCard = ({ title, children, lastUpdated }: Props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  return (
    <StyledCard>
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
