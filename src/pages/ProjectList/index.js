import React, { useEffect, useState } from "react";
//relative path import
import Layout from "../../components/Layout";
import ProjectListSteps from "./Steps";
import List from "./List";
//api
import { getAllProjects, getSingleProject } from "../../api";

const ProjectList = () => {
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isStepValidate, setIsStepValidate] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = () => {
    setIsLoading(true);
    let page = 1;
    let limit = 100;
    getAllProjects(page, limit)
      .then((res) => {
        if (res?.data) {
          const { results } = res?.data?.data;
          setProjectData(results);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const manageProjectEdit = (projectId) => {
    setIsEditLoading(true);
    getSingleProject(projectId)
      .then((res) => {
        if (res?.data) {
          const { data } = res?.data;
          setProjectDetails(data);
          setIsEditLoading(false);
          setIsStepValidate(true);
        }
      })
      .catch((e) => {
        setIsEditLoading(false);
      });
  };

  return (
    <Layout>
      {isStepValidate ? (
        <ProjectListSteps projectDetails={projectDetails} />
      ) : (
        <List
          isLoading={isLoading}
          isEditLoading={isEditLoading}
          projectData={projectData}
          manageProjectEdit={manageProjectEdit}
        />
      )}
    </Layout>
  );
};

export default ProjectList;
