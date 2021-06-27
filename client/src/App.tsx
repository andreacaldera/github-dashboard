import { CssBaseline, ThemeProvider } from '@material-ui/core'
import React from 'react'
import { ProjectDashboard } from './project-dashboard'
import theme from './theme'

const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        {/* <ProjectDashboard organisation="pretamanger" project="web" />
        <ProjectDashboard organisation="pretamanger" project="auth-api" />
        <ProjectDashboard
          organisation="pretamanger"
          project="customer-account-profiles"
        /> */}
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
