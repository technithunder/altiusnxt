import React, { useState } from "react";
import {
  Box,
  Step,
  StepButton,
  Stepper,
  Typography,
  styled,
} from "@mui/material";
//api
import { updatedProject } from "../../../api";
//relative path imports
import UploadHeader from "../../CreateProject/step2";
import Configurations from "../../CreateProject/step3";
import MapHeaders from "../../CreateProject/step4";

const stepHeadingObj = {
  1: "Upload Headers",
  2: "Configurations",
  3: "Map Headers",
};

const steps = ["Step 1", "Step 2", "Step 3"];

const CustomStepButton = styled(StepButton)(
  ({ theme, isActive, isCompleted, disabled }) => ({
    color: isActive
      ? theme.palette.primary.main
      : isCompleted
      ? theme.palette.primary.main
      : theme.palette.secondary.main,
    cursor: disabled ? "default" : "pointer",
  })
);

const ProjectListSteps = ({ projectDetails }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [headers, setHeaders] = useState();
  const [projectData, setProjectData] = useState({
    step1Info: null,
    step2Info: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleStepClick = (index) => {
    if (index !== 3 && completedSteps[index - 1]) {
      setErrorMessage("");
      setActiveStep(index);
    } else if (index === 0 && activeStep !== 3) {
      setErrorMessage("");
      setActiveStep(index);
    }
  };

  const markStepCompleted = (step) => {
    setCompletedSteps((prevCompletedSteps) => ({
      ...prevCompletedSteps,
      [step]: true,
    }));
  };

  const manageSteps = (data) => {
    if (activeStep === 0) {
      setProjectData({ ...projectData, step1Info: data.step2 });
      markStepCompleted(activeStep);
      setActiveStep((prevStep) => prevStep + 1);
      setErrorMessage("");
    } else if (activeStep === 1) {
      setProjectData({ ...projectData, step2Info: data?.step3 });
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", projectData?.step1Info?.csv["0"]);
      formData.append("number_of_attributes", data?.step3?.attributes);
      formData.append("number_of_links", data?.step3?.link);

      updatedProject(projectDetails?.id, formData)
        .then((res) => {
          if (res?.data?.data) {
            setHeaders(res?.data?.data);
            markStepCompleted(activeStep);
            setActiveStep((prevStep) => prevStep + 1);
            errorMessage("");
            setIsLoading(false);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setErrorMessage(e?.response?.data?.message);
        });
    }
  };

  return (
    <Box>
      <Typography
        variant={"subtitle1"}
        fontWeight={"600"}
        color={"primary.dark"}
      >
        {stepHeadingObj[activeStep]}
      </Typography>

      <Box mt={6} width={"95%"}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => {
            const isDisabled = activeStep === steps.length - 1;
            return (
              <Step completed={completedSteps[index]} key={label}>
                <CustomStepButton
                  isActive={index === activeStep}
                  isCompleted={completedSteps[index]}
                  onClick={() => handleStepClick(index, isDisabled)}
                  disabled={isDisabled}
                />
              </Step>
            );
          })}
        </Stepper>

        <Box mt={5}>
          {activeStep === 0 && (
            <UploadHeader
              isEditFlow={true}
              projectData={projectData?.step1Info}
              manageSteps={manageSteps}
              projectDetails={projectDetails}
            />
          )}
          {activeStep === 1 && (
            <Configurations
              isEditFlow={true}
              projectData={projectData?.step2Info}
              errorMessage={errorMessage}
              manageSteps={manageSteps}
              isLoading={isLoading}
              projectDetails={projectDetails}
            />
          )}

          {activeStep === 2 && <MapHeaders headers={headers} />}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectListSteps;
