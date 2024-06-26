import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NotFound = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "secondary.main",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        display: "flex",
      }}
    >
      <Stack spacing={2}>
        <Typography fontSize={140} fontWeight={"bold"}>
          404
        </Typography>
        <Typography variant="h5">Page Not Found</Typography>
        <Link to={isAuthenticated ? "/create-project" : "/login"}>
          <Typography
            variant="h6"
            color={"primary.main"}
            sx={{ textDecorationLine: "underline" }}
          >
            Go to home
          </Typography>
        </Link>
      </Stack>
    </Box>
  );
};

export default NotFound;
