import { createTheme } from "@mui/material";
//colors import
import { colors } from "../helper/color";

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      contrastText: colors.primaryContrast,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondaryLight,
      contrastText: colors.secondaryContrast,
    },
    error: {
      main: colors.error,
    },
  },
  typography: {
    allVariants: {
      fontFamily: `"Poppins", sans-serif`,
    },
    h4: {
      fontSize: "32px",
      fontWeight: "500",
      lineHeight: "48px",
    },
    subtitle1: {
      fontSize: "28px",
      fontWeight: "500",
      lineHeight: "40px",
    },
    subtitle2: {
      fontSize: "24px",
      fontWeight: "500",
      lineHeight: "28.8px",
    },
    body1: {
      fontSize: "20px",
      fontWeight: "500",
    },
    body2: {
      fontSize: "18px",
      fontWeight: "500",
      lineHeight: "40px",
    },
    caption: {
      fontSize: "16px",
      fontWeight: "500",
    },
  },
});
