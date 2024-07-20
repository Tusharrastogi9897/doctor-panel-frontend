import { createTheme } from "@mui/material"
import colors from "./assets/colors";

const theme = createTheme({

  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    }
  },

  typography: {
    fontFamily: "sans-serif",
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
            textTransform: "none",
            fontSize: "16px"
        },
        contained: {
            background: colors.primaryGradient,
            borderRadius: 10,
            color: 'white',
            transition: 'background 0.3s',
            '&:hover': {
                background: colors.secondaryGradient,
            }
        }
      },
    },
    MuiInputBase: {
        styleOverrides: {
            root: {
                fontSize: '15px'
            }
        }
    }
  },
})

export default theme
