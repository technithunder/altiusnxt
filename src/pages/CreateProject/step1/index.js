import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Typography } from "@mui/material";
//relative path import
import InputField from "../../../components/InputField";
import LoadingButton from "../../../components/LoadingButton";
//api
import { verifyProjectName } from "../../../api";

const schema = yup.object().shape({
  projectName: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Project name can only contain letters, numbers, and underscores"
    )
    .required("Required"),
});

const ProjectCreate = ({ manageSteps, projectData }) => {
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (projectData) {
      setValue("projectName", projectData?.projectName);
      trigger("projectName");
    }
  }, [projectData, trigger]);

  const projectName = watch("projectName");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    if (projectData?.projectName === projectName) {
      manageSteps({ step1: data });
      setErrorMessage("");
    } else {
      setIsLoading(true);
      verifyProjectName(projectName)
        .then((res) => {
          if (res?.data) {
            if (data) {
              manageSteps({ step1: data });
              setErrorMessage("");
              setIsLoading(false);
            }
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setErrorMessage(e?.response?.data?.message);
        });
    }
  };

  return (
    <Stack width={"70%"} spacing={4}>
      <Typography variant="subtitle2" color={"primary.dark"}>
        Enter Project name
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="projectName"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              variant="contained"
              placeholder="Enter Project Name"
              onChange={(e) => {
                setErrorMessage("");
                field.onChange(e.target.value);
              }}
              helperText={
                errorMessage ? errorMessage : errors?.projectName?.message
              }
            />
          )}
        />
        <LoadingButton
          fullWidth
          type="submit"
          disabled={!isValid}
          sx={{ borderRadius: "60px", mt: 6 }}
          variant="contained"
          isLoading={isLoading}
        >
          <Typography fontWeight={"600"}>Continue</Typography>
        </LoadingButton>
      </form>
    </Stack>
  );
};

export default ProjectCreate;
