import { createMuiTheme } from '@material-ui/core/styles'
import { green, red } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[200],
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
})

export default theme
