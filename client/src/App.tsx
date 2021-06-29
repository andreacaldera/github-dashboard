import { CssBaseline, ThemeProvider, Typography } from '@material-ui/core'
import React from 'react'
import { ProjectDashboard } from './project-dashboard'
import theme from './theme'

const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Typography variant="h3" component="h3">
          Github Dashboard
        </Typography>
        <ProjectDashboard
          organisation="pretamanger"
          project="web"
          action="Build+and+deploy"
        />
        <ProjectDashboard organisation="pretamanger" project="auth-api" />
        <ProjectDashboard
          organisation="pretamanger"
          project="customer-account-profiles"
        />
        <ProjectDashboard organisation="pretamanger" project="platform-api" />
        <ProjectDashboard
          organisation="pretamanger"
          project="coffee-subscription"
        />
        <ProjectDashboard
          organisation="pretamanger"
          project="coffee-subscription-manage"
        />
        {/* <ProjectDashboard
          organisation="andreacaldera"
          project="eastendcc-www"
        />
        <ProjectDashboard
          organisation="andreacaldera"
          project="eastendcc-api"
        /> */}
      </div>
    </ThemeProvider>
  )
}

export default App
