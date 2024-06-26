import React, { useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material";
//relative path import
import Layout from "../../components/Layout";
import LoadingButton from "../../components/LoadingButton";
//import images and vector
import UPLOADFILE from "../../assets/svg/upload-file.svg";
//api
import { searchByProject, uploadData } from "../../api";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  projectName: yup.string().required("Required"),
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

const UploadData = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const selectedFileName = watch("csv");

  const onSubmit = (data) => {
    setIsLoading(true);
    if (data) {
      const formData = new FormData();
      formData.append("project_id", data?.projectName);
      formData.append("file", data?.csv["0"]);

      uploadData(formData)
        .then((res) => {
          if (res) {
            setIsLoading(false);
            navigate("/ai-mapping");
            toast.success(res?.data?.message);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setErrorMessage(e?.response?.data?.message);
        });
    }
  };

  const onInputChange = (e, value) => {
    if (value.length <= 0) {
      setOptions([]);
      return;
    }

    searchByProject(value)
      .then((res) => {
        if (res?.data?.data?.results?.length > 0) {
          let temp = [];
          res?.data?.data?.results?.forEach((ele) => {
            temp.push({
              label: ele.project_name,
              value: ele.id,
            });
          });
          setOptions(temp);
        } else {
          setOptions([]);
        }
      })
      .catch((e) => {
        setOptions([]);
      });
  };

  return (
    <Layout>
      <Box width={"50%"}>
        <Typography
          variant={"subtitle1"}
          fontWeight={"600"}
          color={"primary.dark"}
        >
          Upload Data
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6} mt={4}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" color={"primary.dark"}>
                Select Project name
              </Typography>
              <Controller
                name="projectName"
                control={control}
                render={({ field: { ref, onChange, ...field } }) => (
                  <Autocomplete
                    {...field}
                    options={options}
                    getOptionLabel={(option) => option.label}
                    onInputChange={onInputChange}
                    onChange={(_, data) => onChange(data?.value || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputRef={ref}
                        placeholder="Select Project Name"
                        error={Boolean(errors.projectName)}
                        helperText={errors.projectName?.message}
                        sx={{
                          backgroundColor: "secondary.main",
                          color: "primary.dark",
                          outline: "none",
                          borderColor: "secondary.main",
                        }}
                      />
                    )}
                  />
                )}
              />
            </Stack>
            <Stack spacing={2}>
              <Typography variant="subtitle2" color={"primary.dark"}>
                Upload data file only
              </Typography>
              <Box>
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
                        onChange={(e) =>
                          e?.target?.files?.length > 0 &&
                          field.onChange(e.target.files)
                        }
                      />
                      <label htmlFor="csv-upload" style={{ cursor: "pointer" }}>
                        <Stack
                          sx={{
                            border: "3px dashed",
                            borderColor: "secondary.main",
                            borderRadius: 2,
                            p: 6,
                            textAlign: "center",

                            cursor: "pointer",
                          }}
                        >
                          {selectedFileName ? (
                            <>
                              {selectedFileName && (
                                <Typography
                                  variant="body2"
                                  color="primary.main"
                                  mt={2}
                                >
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

                {errorMessage && (
                  <Typography color="error" variant="body2">
                    {errorMessage}
                  </Typography>
                )}
              </Box>
            </Stack>
            <LoadingButton
              fullWidth
              type="submit"
              disabled={!isValid}
              sx={{ borderRadius: "60px", mt: 6 }}
              variant="contained"
              isLoading={isLoading}
            >
              <Typography fontWeight={"600"}>Submit</Typography>
            </LoadingButton>
          </Stack>
        </form>
      </Box>
    </Layout>
  );
};

export default UploadData;
