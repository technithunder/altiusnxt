import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Step,
  StepButton,
  Stepper,
  Typography,
  styled,
} from "@mui/material";
//relative path imports
import Layout from "../../components/Layout";
import ProjectCreate from "./step1";
import UploadHeader from "./step2";
import Configurations from "./step3";
import MapHeaders from "./step4";
//api
import { createProject } from "../../api";

const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

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

const stepHeadingObj = {
  0: "Create New Project",
  1: "Upload Headers",
  2: "Configurations",
  3: "Map Headers",
};

const CreateProject = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [headers, setHeaders] = useState();
  const [projectData, setProjectData] = useState({
    step1Info: null,
    step2Info: null,
    step3Info: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const markStepCompleted = (step) => {
    setCompletedSteps((prevCompletedSteps) => ({
      ...prevCompletedSteps,
      [step]: true,
    }));
  };

  const manageSteps = (data) => {
    if (activeStep === 0) {
      setProjectData({ ...projectData, step1Info: data.step1 });
      markStepCompleted(activeStep);
      setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 1) {
      setProjectData({ ...projectData, step2Info: data.step2 });
      markStepCompleted(activeStep);
      setActiveStep((prevStep) => prevStep + 1);
      setErrorMessage("");
    } else if (activeStep === 2) {
      setProjectData({ ...projectData, step3Info: data?.step3 });
      setIsLoading(true);
      const formData = new FormData();
      formData.append("project_name", projectData?.step1Info?.projectName);
      formData.append("file", projectData?.step2Info?.csv["0"]);
      formData.append("number_of_attributes", data?.step3?.attributes);
      formData.append("number_of_links", data?.step3?.link);

      createProject(formData)
        .then((res) => {
          if (res?.data?.data) {
            setHeaders(res?.data?.data);
            markStepCompleted(activeStep);
            toast.success(res?.data?.message);
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

  const handleStepClick = (index) => {
    if (index !== 3 && completedSteps[index - 1]) {
      setErrorMessage("");
      setActiveStep(index);
    } else if (index === 0 && activeStep !== 3) {
      setErrorMessage("");
      setActiveStep(index);
    }
  };

  return (
    <Layout>
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
            <ProjectCreate
              projectData={projectData?.step1Info}
              manageSteps={manageSteps}
            />
          )}
          {activeStep === 1 && (
            <UploadHeader
              projectData={projectData?.step2Info}
              manageSteps={manageSteps}
            />
          )}
          {activeStep === 2 && (
            <Configurations
              projectData={projectData?.step3Info}
              errorMessage={errorMessage}
              manageSteps={manageSteps}
              isLoading={isLoading}
            />
          )}
          {activeStep === 3 && <MapHeaders headers={headers} />}
        </Box>
      </Box>
    </Layout>
  );
};

export default CreateProject;
