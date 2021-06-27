import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core'
import React from 'react'
import { ProjectDashboard } from './project-dashboard'
import theme from './theme'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '5rem'
  },
  container: {
    width: '80vw'
  }
}))

const App: React.FunctionComponent = () => {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.paper}>
        <ProjectDashboard
          organisation="andreacaldera"
          project="eastendcc-www"
        />
        <ProjectDashboard
          organisation="andreacaldera"
          project="eastendcc-api"
        />
      </div>
    </ThemeProvider>
  )
}

export default App
