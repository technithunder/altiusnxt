import React from "react";
import { Box, Dialog, IconButton } from "@mui/material";
//import vectors and images
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

const FullScreenView = ({ open, onClose, selectedCellValue }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        style: {
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Box height={"90vh"} width={"90vw"} position={"relative"}>
        <IconButton
          aria-label="close"
          style={{
            position: "absolute",
            bottom: "-10px",
            backgroundColor: "#fff",
            right: "-10px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            color: "#fff",
          }}
          onClick={onClose}
        >
          <CloseFullscreenIcon sx={{ color: "#000", fontSize: "18px" }} />
        </IconButton>
        <iframe
          src={selectedCellValue}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
          }}
          title="External Website"
        />
      </Box>
    </Dialog>
  );
};

export default FullScreenView;
