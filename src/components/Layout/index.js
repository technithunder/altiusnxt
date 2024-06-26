import React from "react";
import { Box, Stack } from "@mui/material";
//relative path imports
import Sidebar from "../Sidebar";

const Layout = ({ children }) => {
  return (
    <Stack direction="row" sx={{ height: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          bgcolor: "primary.contrastText",
          flexGrow: 1,
          overflow: "auto",
          px: 5,
          pt: 5,
        }}
      >
        {children}
      </Box>
    </Stack>
  );
};

export default Layout;
