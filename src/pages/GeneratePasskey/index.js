import React, { useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Box, Grid, Stack, Typography } from "@mui/material";
//relative path import
import InputField from "../../components/InputField";
import LoadingButton from "../../components/LoadingButton";
//import images and vectors
import BG_IMAGE from "../../assets/images/bg-image.png";
import HOME from "../../assets/svg/home.svg";
import COPY from "../../assets/svg/copy.svg";
//api path imports
import { generatePasskey } from "../../api";

const schema = yup.object().shape({
  id: yup.string().trim().required("Required"),
});

const GeneratePassKey = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState();

  const onSubmit = (data) => {
    if (data?.id !== process.env.REACT_APP_USERNAME) {
      toast.error("Invalid generator ID. Please enter valid generator ID");
      return;
    }

    let obj = {
      username: process.env.REACT_APP_USERNAME,
    };

    setIsLoading(true);

    generatePasskey(obj)
      .then((res) => {
        if (res?.data?.data) {
          setValue(res?.data?.data?.passkey);
          setMessage("Passkey Generated Successfully");
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const manageCopy = async () => {
    try {
      if (value) {
        setMessage("");
        await navigator?.clipboard?.writeText(value);
        setCopiedMessage("Copied Successfully");
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
      setCopiedMessage("Copy failed");
    }
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
              <Link to={"/login"}>
                <img src={HOME} alt="home" />
              </Link>
            </Stack>
            <Stack spacing={4} mt={15}>
              <Typography
                color={"primary.dark"}
                fontWeight={"600"}
                variant={"subtitle1"}
              >
                Generate New Passkey
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="id"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      {...field}
                      variant="contained"
                      placeholder="Generator ID"
                      helperText={errors?.id?.message}
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
                  <Typography fontWeight={"600"}>Generate</Typography>
                </LoadingButton>
                {message && (
                  <Typography
                    textAlign={"right"}
                    variant="body2"
                    color={"#25943E"}
                  >
                    {message}
                  </Typography>
                )}
              </form>

              <InputField
                value={value && value}
                disabled
                variant="contained"
                placeholder="Get your passkey here"
                endAdornment={
                  <Box mt={1} sx={{ cursor: "pointer" }} onClick={manageCopy}>
                    <img src={COPY} alt="copy" />
                  </Box>
                }
              />

              {copiedMessage && (
                <Typography
                  textAlign={"right"}
                  variant="caption"
                  color={"#25943E"}
                >
                  {copiedMessage}
                </Typography>
              )}
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

export default GeneratePassKey;
