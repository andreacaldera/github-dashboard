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
import { ProjectSubheader } from '../project-subheader'
import clsx from 'clsx'
import { Card } from '@mui/material'

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

type Props = {
  title: React.ReactElement
  children: React.ReactElement
}

export const ProjectCard = ({ title, children }: Props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  return (
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
        title={title}
        subheader={<ProjectSubheader />}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography color="textSecondary" component="p">
            Last update: N/A
          </Typography>
          <Typography color="textSecondary" component="p">
            Average execution time: N/A
          </Typography>
          <TableContainer component={Paper}>{children}</TableContainer>
        </CardContent>
      </Collapse>
    </Card>
  )
}
