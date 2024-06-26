import React from "react";
import {
  Stack,
  OutlinedInput,
  Typography,
  InputAdornment,
} from "@mui/material";

const variantStyles = {
  contained: {
    backgroundColor: "secondary.main",
    border: "1px solid #E5E5E5",
    fontWeight: "600",
    borderRadius: "16px",
    paddingLeft: "20px",
  },
  outlined: {
    border: "1px solid #000",
    fontWeight: "500",
    borderRadius: "8px",
  },
};

const InputField = ({
  placeholder,
  onChange,
  value,
  fullWidth = false,
  helperText,
  disabled = false,
  label,
  type = "text",
  startAdornment,
  endAdornment,
  variant,
  sx,
}) => {
  return (
    <Stack spacing={1}>
      {label && <Typography variant="body1">{label}</Typography>}
      <OutlinedInput
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        fullWidth={fullWidth}
        type={type}
        startAdornment={
          startAdornment && (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          )
        }
        endAdornment={
          endAdornment && (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          )
        }
        sx={{
          ...sx,
          color: "secondary.contrastText",
          height: "50px",
          fontSize: "18px",
          ...variantStyles[variant],
        }}
      />
      {helperText && (
        <Typography color={"error"} variant="body2">
          {helperText}
        </Typography>
      )}
    </Stack>
  );
};

export default InputField;
