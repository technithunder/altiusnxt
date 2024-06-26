import axios from "axios";
//redux
import { store } from "../redux/store/store";

export const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_KEY}/v1`,
});

//created axios interceptors
axiosInstance.interceptors.request.use(
  function (config) {
    const state = store.getState();
    const token = state.auth.token;
    config.headers["Content-Type"] = "application/json";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//generate pass key
export const generatePasskey = (payload) => {
  let result;
  try {
    result = axiosInstance.post("/passkey/generate-passkey", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

//verify pass key
export const verifyPassKey = (payload) => {
  let result;
  try {
    result = axiosInstance.post("/passkey/validate-passkey", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

//create project
export const createProject = (payload) => {
  let result;
  try {
    result = axiosInstance.post("/projects", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

//get all projects
export const getAllProjects = (page, limit) => {
  let result;
  try {
    result = axiosInstance.get(`/projects?page=${page}&limit=${limit}`);
  } catch (e) {
    result = e;
  }
  return result;
};

//attribute mapping
export const attributeMapping = (id, payload) => {
  let result;
  try {
    result = axiosInstance.patch(`/projects/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

//verify project name
export const verifyProjectName = (payload) => {
  let result;
  try {
    result = axiosInstance.get(
      `/projects/check-duplicate?projectName=${payload}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

//search projects
export const searchByProject = (payload) => {
  let result;
  try {
    result = axiosInstance.get(`/projects?search=${payload}&page=1&limit=100`);
  } catch (e) {
    result = e;
  }
  return result;
};

//upload data
export const uploadData = (payload) => {
  let result;
  try {
    result = axiosInstance.post(`/data/attributes`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

//get single project
export const getSingleProject = (projectID) => {
  let result;
  try {
    result = axiosInstance.get(`/projects/${projectID}`);
  } catch (e) {
    result = e;
  }
  return result;
};

//update project
export const updatedProject = (projectID, payload) => {
  let result;
  try {
    result = axiosInstance.put(`/projects/${projectID}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

//get all files
export const getAllFiles = (page, limit) => {
  let result;
  try {
    result = axiosInstance.get(`/data/attributes?page=${page}&limit=${limit}`);
  } catch (e) {
    result = e;
  }
  return result;
};

//get single file
export const getSingleFile = async (payload, page, limit) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/data/attributes/${payload}?page=${page}&limit=${limit}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

//search file
export const searchFile = (payload) => {
  let result;
  try {
    result = axiosInstance.get(`/data/attributes?search=${payload}`);
  } catch (e) {
    result = e;
  }
  return result;
};

//project name details
export const getProjectNameDetails = (payload) => {
  let result;
  try {
    result = axiosInstance.get(`/data/attributes/${payload}/details`);
  } catch (e) {
    result = e;
  }
  return result;
};

//run ai api
export const runAI = (payload) => {
  let result;
  try {
    result = axiosInstance.post(`/data/attributes/run-ai`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

//attribute details
export const getAttributesDetails = (payload) => {
  let result;
  try {
    result = axiosInstance.get(`/data/items/${payload}`);
  } catch (e) {
    result = e;
  }
  return result;
};

//run ai api
export const reRunAI = (payload) => {
  let result;
  try {
    result = axiosInstance.post(`/data/attributes/re-run-ai`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

//download csv
export const downloadCsv = (id, payload) => {
  let result;
  try {
    result = axiosInstance.put(`/data/items/${id}/csv`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};
