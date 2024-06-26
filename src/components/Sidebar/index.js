import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
//import assets and vectors
import ADDFILE from "../../assets/svg/add-file.svg";
import UPLOAD from "../../assets/svg/upload.svg";
import FRAME from "../../assets/svg/frame1.svg";
import MENU from "../../assets/svg/menu.svg";
import OFF from "../../assets/svg/off.svg";
import CloseIcon from "@mui/icons-material/Close";

//redux
import { logOut } from "../../redux/slice/authSlice";
//relative path import
import LoadingButton from "../LoadingButton";
import { toast } from "react-toastify";

const activeMenuStyle = {
  backgroundColor: "#D9D9D980",
  height: "70px",
  width: "70px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setISOpen] = useState(false);

  const manageLogout = () => {
    dispatch(logOut());
    navigate("/login");
    toast.success("Logout successfull");
  };

  return (
    <Stack
      sx={{
        width: "148px",
        height: "100vh",
        backgroundColor: "primary.main",
      }}
    >
      <Stack
        py={4}
        height={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box>
          <Typography
            variant="h4"
            textTransform={"uppercase"}
            color={"primary.contrastText"}
          >
            <Box component="span" color={"#FFA500"}>
              a
            </Box>
            nxt
          </Typography>
          <Stack alignItems={"center"} spacing={4} mt={4}>
            <NavLink
              style={({ isActive }) =>
                isActive && !isOpen ? activeMenuStyle : undefined
              }
              to={"/create-project"}
            >
              <img src={ADDFILE} alt="add-file" height={30} width={30} />
            </NavLink>
            <NavLink
              style={({ isActive }) =>
                isActive && !isOpen ? activeMenuStyle : undefined
              }
              to={"/upload-data"}
            >
              <img src={UPLOAD} alt="upload" height={30} width={30} />
            </NavLink>
            <NavLink
              style={({ isActive }) =>
                isActive && !isOpen ? activeMenuStyle : undefined
              }
              to={"/ai-mapping"}
            >
              <img src={FRAME} alt="frame" height={30} width={30} />
            </NavLink>
            <NavLink
              style={({ isActive }) =>
                isActive && !isOpen ? activeMenuStyle : undefined
              }
              to={"/project-list"}
            >
              <img src={MENU} alt="menu" height={30} width={30} />
            </NavLink>
          </Stack>
        </Box>
        <Box>
          <Stack alignItems={"center"} spacing={4}>
            <NavLink
              to="#"
              style={({ isActive }) =>
                isActive && isOpen ? activeMenuStyle : undefined
              }
              onClick={() => setISOpen(true)}
            >
              <Box sx={{ cursor: "pointer" }}>
                <img src={OFF} alt="off" height={30} width={30} />
              </Box>
            </NavLink>
          </Stack>
        </Box>
      </Stack>

      <Dialog
        fullWidth
        open={isOpen}
        onClose={() => setISOpen(false)}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          mt: 1,
        }}
        PaperProps={{
          style: {
            margin: 0,
            position: "absolute",
            top: "10%",
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "primary.main" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle2"
              fontWeight={"700"}
              color={"primary.contrastText"}
            >
              Confirmation
            </Typography>
            <IconButton onClick={() => setISOpen(false)}>
              <CloseIcon sx={{ fontSize: 32, color: "primary.contrastText" }} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1">
            Please confirm before logout, Any unsaved data will be lost!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ mr: 4 }}>
          <LoadingButton onClick={() => setISOpen(false)} variant="outlined">
            Cancel
          </LoadingButton>
          <LoadingButton onClick={manageLogout} variant="contained">
            Logout
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Sidebar;
