import {
  CssBaseline,
  makeStyles,
  ThemeProvider,
  Typography,
} from '@material-ui/core'
import { ProjectDashboard } from '../src/common/project-dashboard'
import theme from '../src/common/theme'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
  },
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
        {/* <ProjectDashboard
          organisation="andreacaldera"
          project="eastendcc-www"
        />
        <ProjectDashboard
          organisation="andreacaldera"
          project="eastendcc-api"
        /> */}
        <ProjectDashboard organisation="DigitalInnovation" project="onyx-nx" />
        <ProjectDashboard
          organisation="DigitalInnovation"
          project="jaeger-release"
        />
      </div>
    </ThemeProvider>
  )
}
