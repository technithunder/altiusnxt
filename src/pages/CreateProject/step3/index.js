import React, { useEffect } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Stack, Typography } from "@mui/material";
//relative path import
import InputField from "../../../components/InputField";
import LoadingButton from "../../../components/LoadingButton";

const schema = yup.object().shape({
  attributes: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9 ]*$/, "Special characters are not allowed")
    .test(
      "no-plus-sign",
      'The "+" character is not allowed',
      (value) => !value || !value.includes("+")
    )
    .test(
      "max-value",
      "Number of attributes must be less than or equal to 999",
      (value) => !value || parseInt(value) <= 999
    )
    .required("Required"),
  link: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9 ]*$/, "Special characters are not allowed")
    .test(
      "no-plus-sign",
      'The "+" character is not allowed',
      (value) => !value || !value.includes("+")
    )
    .test(
      "max-links",
      "Number of links must be less than or equal to 5",
      (value) => !value || parseInt(value) <= 5
    )
    .required("Required"),
});

const Configurations = ({
  manageSteps,
  errorMessage,
  projectData,
  isLoading,
  isEditFlow,
  projectDetails,
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (projectData) {
      setValue("attributes", projectData?.attributes);
      setValue("link", projectData?.link);
      trigger("attributes");
      trigger("link");
    }
  }, [projectData, trigger, setValue]);

  useEffect(() => {
    if (isEditFlow && projectDetails) {
      setValue("attributes", projectDetails?.number_of_attributes);
      setValue("link", projectDetails?.number_of_links);
      trigger("attributes");
      trigger("link");
    }
  }, [isEditFlow, projectDetails]);

  const onSubmit = (data) => {
    if (data) {
      manageSteps({ step3: data });
    }
  };

  return (
    <Box width={"80%"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={6}>
          <Stack spacing={4}>
            <Typography variant="subtitle2" color={"primary.dark"}>
              How many numbers of attributes you need?{" "}
              <span style={{ color: "#A91D3A", fontWeight: "bold" }}>
                &nbsp;*
              </span>
            </Typography>
            <Controller
              name="attributes"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  variant="contained"
                  type="number"
                  placeholder="Enter number of attribute"
                  helperText={errors?.attributes?.message}
                />
              )}
            />
          </Stack>
          <Stack spacing={4}>
            <Typography variant="subtitle2" color={"primary.dark"}>
              What is the maximum number of Links you need?{" "}
              <span style={{ color: "#A91D3A", fontWeight: "bold" }}>
                &nbsp;*
              </span>
            </Typography>
            <Controller
              name="link"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  variant="contained"
                  type="number"
                  placeholder="Enter number of links"
                  helperText={errors?.link?.message}
                />
              )}
            />
          </Stack>

          {errorMessage && (
            <Typography variant="body2" color={"error"}>
              {errorMessage}
            </Typography>
          )}

          <LoadingButton
            fullWidth
            type="submit"
            disabled={!isValid}
            sx={{ borderRadius: "60px" }}
            variant="contained"
            isLoading={isLoading}
          >
            <Typography fontWeight={"600"}>Continue</Typography>
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  );
};

export default Configurations;
