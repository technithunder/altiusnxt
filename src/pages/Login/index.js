import React, { useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Box, Grid, Stack, Typography } from "@mui/material";
//relative path import
import InputField from "../../components/InputField";
import LoadingButton from "../../components/LoadingButton";
//import images and vectors
import BG_IMAGE from "../../assets/images/bg-image.png";
import KEY from "../../assets/svg/key.svg";
//api path imports
import { verifyPassKey } from "../../api";
//redux
import { manageAuth } from "../../redux/slice/authSlice";
import { useDispatch } from "react-redux";

const schema = yup.object().shape({
  passKey: yup.string().trim().required("Required"),
});

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [passKeyErrorMessage, setPassKeyErrorMessage] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    let obj = {
      username: process.env.REACT_APP_USERNAME,
      passkey: data.passKey,
    };

    verifyPassKey(obj)
      .then((res) => {
        if (res?.data?.data?.valid) {
          const token = res?.data?.data?.token;
          dispatch(manageAuth(token));
          setIsLoading(false);
          navigate("/create-project");
          toast.success(res?.data?.message);
        } else {
          setIsLoading(false);
          setPassKeyErrorMessage(res?.data?.message);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <Box sx={{ backgroundColor: "primary.contrastText" }}>
      <Grid container height={"100vh"}>
        <Grid item md={6} sm={12}>
          <Box mx={12} mt={10}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography fontSize={36} fontWeight="500" letterSpacing={6}>
                ALTIUS
                <Box component="span" color="primary.main">
                  NXT
                </Box>
              </Typography>
              <Link to={"/generate-passkey"}>
                <img src={KEY} alt="key" />
              </Link>
            </Stack>
            <Stack spacing={4} mt={15}>
              <Typography
                color={"primary.dark"}
                fontWeight={"600"}
                variant={"subtitle1"}
              >
                Login to AI Data Mapping
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="passKey"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      {...field}
                      variant="contained"
                      placeholder="Enter Pass Key"
                      helperText={
                        passKeyErrorMessage
                          ? passKeyErrorMessage
                          : errors?.passKey?.message
                      }
                    />
                  )}
                />

                <LoadingButton
                  fullWidth
                  type="submit"
                  sx={{ borderRadius: "60px" }}
                  variant="contained"
                  isLoading={isLoading}
                >
                  <Typography fontWeight={"600"}>Continue</Typography>
                </LoadingButton>
              </form>
            </Stack>
          </Box>
        </Grid>
        <Grid item md={6} sm={12} position={"relative"}>
          <Box
            component="img"
            src={BG_IMAGE}
            alt="bg-image"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              right: "50px",
              bottom: "30px",
              zindex: 10,
            }}
            variant="caption"
            color={"primary.contrastText"}
          >
            Copyright @ 2024 AltiusNxt Technologies
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
