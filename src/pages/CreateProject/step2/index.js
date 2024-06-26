import React, { useEffect } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Stack, Typography } from "@mui/material";
//relative path import
import LoadingButton from "../../../components/LoadingButton";
//import images and vector
import UPLOADFILE from "../../../assets/svg/upload-file.svg";

const schema = yup.object().shape({
  csv: yup
    .mixed()
    .required("Required")
    .test(
      "fileType",
      "Invalid file format, please upload Excel / CSV",
      (value) => {
        return (
          value &&
          value[0] &&
          (value[0].type === "text/csv" ||
            value[0].type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            value[0].type === "application/vnd.ms-excel")
        );
      }
    ),
});

const UploadHeader = ({
  manageSteps,
  projectData,
  isEditFlow,
  projectDetails,
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (projectData) {
      setValue("csv", projectData?.csv);
      trigger("csv");
    }
  }, [projectData, trigger, setValue]);

  const selectedFileName = watch("csv");

  const onSubmit = (data) => {
    if (data) {
      manageSteps({ step2: data });
    }
  };

  return (
    <Stack width={"80%"}>
      <Typography variant="subtitle2" color={"primary.dark"}>
        Upload headers only
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="csv"
          control={control}
          render={({ field }) => (
            <Box>
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                style={{ display: "none" }}
                id="csv-upload"
                onChange={(e) => {
                  e?.target?.files?.length > 0 &&
                    field.onChange(e.target.files);
                }}
              />
              <label htmlFor="csv-upload" style={{ cursor: "pointer" }}>
                <Stack
                  sx={{
                    border: "3px dashed",
                    borderColor: "secondary.main",
                    borderRadius: 2,
                    p: 6,
                    textAlign: "center",
                    mt: 4,
                    cursor: "pointer",
                  }}
                >
                  {selectedFileName ? (
                    <>
                      {selectedFileName && (
                        <Typography variant="body2" color="primary.main" mt={2}>
                          {selectedFileName["0"]?.name}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Stack
                      direction={"row"}
                      justifyContent={"center"}
                      spacing={2}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={"600"}
                        color={"secondary.contrastText"}
                      >
                        Drop the file here or{" "}
                        <Box
                          component="span"
                          color={"#008DDA"}
                          sx={{ textDecorationLine: "underline" }}
                        >
                          Browse
                        </Box>
                        &nbsp;to upload
                      </Typography>
                      <img
                        src={UPLOADFILE}
                        alt="upload-file"
                        height={40}
                        width={40}
                      />
                    </Stack>
                  )}
                </Stack>
              </label>
            </Box>
          )}
        />

        {errors.csv && (
          <Typography color="error" variant="body2">
            {errors.csv.message}
          </Typography>
        )}

        <LoadingButton
          fullWidth
          disabled={!isValid}
          type="submit"
          sx={{ borderRadius: "60px", mt: 6 }}
          variant="contained"
          isLoading={isSubmitting}
        >
          <Typography fontWeight={"600"}>Continue</Typography>
        </LoadingButton>
      </form>
    </Stack>
  );
};

export default UploadHeader;
