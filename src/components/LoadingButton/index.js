import React from "react";
import { Button, CircularProgress, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme, variant, fullWidth }) => ({
  ...(variant === "contained" && {
    backgroundColor: theme.palette?.primary.main,
    color: theme.palette?.primary.contrastText,
    borderColor: theme.palette?.primary.main,
    "&:hover": {
      backgroundColor: theme.palette?.primary.main,
    },
  }),
  ...(variant === "outlined" && {
    backgroundColor: theme.palette?.primary.contrastText,
    color: theme.palette.palette?.primary.dark,
    borderColor: theme.palette?.primary.main,
    borderWidth: "2px",
  }),
  ...(variant === "text" && {
    color: theme.palette?.primary.dark,
  }),
  textTransform: "capitalize",
  padding: "10px",
  fontSize: "16px",
  width: fullWidth ? "100%" : "120px",
  marginBlock: "20px",
}));

const LoadingButton = ({
  isLoading,
  disabled,
  variant = "text",
  children,
  fullWidth,
  onClick,
  type,
  ...props
}) => {
  return (
    <StyledButton
      disableRipple
      disabled={disabled || isLoading}
      variant={variant}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      {...props}
    >
      {isLoading ? (
        <CircularProgress
          size={20}
          sx={{
            color: "primary.main",
          }}
        />
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default LoadingButton;
