import {
  CssBaseline, makeStyles, ThemeProvider,
  Typography
} from '@material-ui/core'
import { ProjectDashboard } from '../src/common/project-dashboard'
import theme from '../src/common/theme'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(1)
  }
}))

export default function Home() {
    const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.container}>
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
