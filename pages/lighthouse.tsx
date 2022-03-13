import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core'
import { LighthouseDashboard } from '../src/common/lighthouse-dashboard'
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
        <LighthouseDashboard
          organisation="DigitalInnovation"
          project="onyx-nx"
        />
      </div>
    </ThemeProvider>
  )
}
