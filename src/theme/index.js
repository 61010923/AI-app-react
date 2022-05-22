import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@mui/material/styles'
import typography from './typography'
import palette from './palette'

const theme = createMuiTheme({
  shape: {
    borderRadius: 8,
  },

  palette,
  typography,
})

export default theme
