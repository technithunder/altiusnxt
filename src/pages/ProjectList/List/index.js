import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  styled,
} from "@mui/material";

const StyledList = styled(Box)(({ theme, isActive }) => ({
  backgroundColor: isActive
    ? theme.palette.primary.main
    : theme.palette.secondary.light,
  padding: "10px 40px",
  borderRadius: "16px",
  marginBlock: "10px",
  cursor: "pointer",
}));

const List = ({ isLoading, projectData, manageProjectEdit, isEditLoading }) => {
  const [isSelected, setIsSelceted] = useState();

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={"600"}>
        Project List
      </Typography>

      <Box mt={2} width={"70%"} height={600} overflow={"auto"}>
        {isLoading ? (
          <CircularProgress
            sx={{
              display: "flex",
              margin: "30px auto",
            }}
          />
        ) : (
          <>
            {projectData?.length > 0 ? (
              <>
                {projectData?.map((ele, index) => {
                  return (
                    <StyledList
                      isActive={isSelected === index}
                      onClick={() => setIsSelceted(index)}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Typography
                          variant="body2"
                          color={
                            isSelected === index
                              ? "primary.contrastText"
                              : "dark"
                          }
                        >
                          {ele?.project_name}
                        </Typography>
                        {isEditLoading ? (
                          <CircularProgress
                            size={20}
                            sx={{ color: "primary.contrastText" }}
                          />
                        ) : (
                          <>
                            {isSelected === index && (
                              <Box
                                px={2}
                                py={1}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                border={"1px solid #fff"}
                                borderRadius={"10px"}
                                onClick={() => manageProjectEdit(ele.id)}
                              >
                                <Typography
                                  variant="caption"
                                  color={
                                    isSelected === index &&
                                    "primary.contrastText"
                                  }
                                >
                                  Edit
                                </Typography>
                              </Box>
                            )}
                          </>
                        )}
                      </Stack>
                    </StyledList>
                  );
                })}
              </>
            ) : (
              <Typography mt={2} variant="h6">
                No Data Found
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default List;
