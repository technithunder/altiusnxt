import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
//relative path imports
import Login from "./pages/Login";
import CreateProject from "./pages/CreateProject";
import UploadData from "./pages/UploadData";
import AiMapping from "./pages/AiMapping";
import ProjectList from "./pages/ProjectList";
import SKULevel from "./pages/SKULevel";
import GeneratePassKey from "./pages/GeneratePasskey";
import NotFound from "./components/NotFound";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [isAuthenticated]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (!isAuthenticated) {
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/generate-passkey"
    ) {
      return <Navigate to="/login" />;
    }
  } else {
    if (
      location.pathname === "/login" ||
      location.pathname === "/generate-passkey"
    ) {
      return <Navigate to="/create-project" />;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/generate-passkey" element={<GeneratePassKey />} />
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/upload-data" element={<UploadData />} />
      <Route path="/ai-mapping" element={<AiMapping />} />
      <Route path="/project-list" element={<ProjectList />} />
      <Route path="/sku-level/:id/:projectID" element={<SKULevel />} />

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
