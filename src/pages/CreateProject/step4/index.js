import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Stack, Typography, styled } from "@mui/material";
//relative path import
import LoadingButton from "../../../components/LoadingButton";
//import images and vector
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
//api
import { attributeMapping } from "../../../api";
import { toast } from "react-toastify";

const StyledIcon = styled(Box)`
  border: 2px solid black;
  border-radius: 5px;
  height: 24px;
  width: 24px;
  position: absolute;
  top: 60px;
  left: calc(50% - 12px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  cursor: pointer;
`;

const StyledHeader = styled(Stack)(
  ({ isBounded, isUnbindingHeader, isDisabled, isActiveHeader, theme }) => ({
    paddingBlock: "5px",
    marginBottom: "2px",
    cursor: isDisabled ? "not-allowed" : "pointer",

    backgroundColor: isUnbindingHeader
      ? "#A91D3A"
      : isBounded
      ? "#25943E"
      : isActiveHeader
      ? theme.palette.primary.main
      : "#D9D9D9",

    "& .MuiTypography-root": {
      color: isBounded || isActiveHeader ? "#fff" : "#000",
    },
  })
);

const MapHeaders = ({ headers }) => {
  const [preDefinedHeaders, setPreDefinedHeaders] = useState(
    headers?.predefinedHeaders?.sort((a, b) =>
      a.is_required && !b.is_required
        ? -1
        : b.is_required && !a.is_required
        ? 1
        : 0
    )
  );
  const [uploadedHeaders, setUploadedHeaders] = useState(
    headers?.uploadedHeaders
  );

  const [currentPair, setCurrentPair] = useState([]);
  const [removingPair, setRemovingPair] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const navigate = useNavigate();

  const onHeaderSelect = (type, id, relation = null) => {
    const data = [...currentPair];
    if (type === "pre") {
      data[0] = id;
    } else {
      data[1] = id;
    }

    if (relation) {
      const dataSource = type === "pre" ? uploadedHeaders : preDefinedHeaders;
      let otherIndex;
      dataSource.forEach((i, index) => {
        if (i.name === relation.split("->")[1]?.trim()) {
          otherIndex = index;
        }
      });
      const newPair = type === "pre" ? [id, otherIndex] : [otherIndex, id];
      setRemovingPair(newPair);
    }
    setCurrentPair(data);
  };

  const bindHeaders = () => {
    // update relation in PREDEFINED_HEADERS
    const preHeadersNew = preDefinedHeaders.map((item, index) => {
      if (currentPair[0] === index) {
        return {
          ...item,
          relation: `${preDefinedHeaders[currentPair[0]].name} -> ${
            uploadedHeaders[currentPair[1]].name
          }`,
        };
      }
      return item;
    });
    setPreDefinedHeaders(preHeadersNew);

    // update relation in UPLOADED_HEADERS
    const uploadedHeadersNew = uploadedHeaders.map((item, index) => {
      if (currentPair[1] === index) {
        return {
          ...item,
          relation: `~ ${preDefinedHeaders[currentPair[0]].name}`,
        };
      }
      return item;
    });
    setUploadedHeaders(uploadedHeadersNew);
    setCurrentPair([]);
  };

  const handleClearingPairs = () => {
    if (removingPair) {
      // removing relation from PREDEFINED_HEADERS
      setPreDefinedHeaders(
        preDefinedHeaders.map((header, i) => {
          if (i === removingPair[0]) {
            const { ["relation"]: removedField, ...rest } = header;
            return rest;
          }
          return header;
        })
      );

      // removing relation from UPLOADED_HEADERS
      setUploadedHeaders(
        uploadedHeaders.map((header, i) => {
          if (i === removingPair[1]) {
            const { ["relation"]: removedField, ...rest } = header;
            return rest;
          }
          return header;
        })
      );

      setRemovingPair([]);
      setCurrentPair([]);
    } else {
      setCurrentPair([]);
    }
  };

  const manageSave = () => {
    if (uploadedHeaders?.length > 0) {
      setShowErrorMessage("");
      setIsLoading(true);
      const filter = uploadedHeaders
        ?.filter((ele) => ele.relation && ele)
        .map((i) => {
          return { [i.relation.replace("~", "").trim()]: i.name };
        });

      let obj = {
        mapped_values: filter,
      };

      attributeMapping(headers?.project_id, obj)
        .then((res) => {
          if (res?.data) {
            navigate("/upload-data");
            setIsLoading(false);
            toast.success(res?.data?.message);
          }
        })
        .catch((e) => {
          console.log(e);
          setShowErrorMessage(e.response.data.message);
          setIsLoading(false);
        });
    }
  };

  const isSaveDisabled = () => {
    const isRelationEmpty = preDefinedHeaders.some(
      (header) => !header.relation
    );
    const isRequiredEmpty = preDefinedHeaders.some(
      (header) => header.is_required && !header.relation
    );
    return isRelationEmpty && isRequiredEmpty;
  };

  return (
    <Box>
      <Typography variant="subtitle2" color={"primary.dark"}>
        Map the uploaded headers with pre-defined headers
      </Typography>

      <Box mt={3}>
        <Box>
          <Stack
            direction="row"
            justifyContent={"space-around"}
            sx={{ backgroundColor: "primary.main", py: 1 }}
          >
            <Typography
              variant="subtitle2"
              textAlign={"center"}
              color={"primary.contrastText"}
            >
              Pre-Defined Headers
            </Typography>
            <Typography
              variant="subtitle2"
              textAlign={"center"}
              color={"primary.contrastText"}
            >
              Uploaded Headers
            </Typography>
          </Stack>
          <Grid
            container
            position={"relative"}
            sx={{
              border: "1px solid #000",
              borderTop: "none",
            }}
          >
            {currentPair.length === 2 && (
              <StyledIcon onClick={bindHeaders}>
                <ArrowForwardIcon />
              </StyledIcon>
            )}

            {(currentPair.length > 0 || removingPair.length === 2) && (
              <StyledIcon sx={{ top: "200px" }} onClick={handleClearingPairs}>
                <CloseIcon />
              </StyledIcon>
            )}
            <Grid item xs={6} p={4} pr={6}>
              <Box sx={{ height: "270px", overflow: "auto" }}>
                {preDefinedHeaders.map((i, index) => {
                  return (
                    <StyledHeader
                      direction="row"
                      isActiveHeader={currentPair && currentPair[0] === index}
                      isBounded={i?.relation}
                      isUnbindingHeader={
                        removingPair && removingPair[0] === index
                      }
                      onClick={() => onHeaderSelect("pre", index, i?.relation)}
                    >
                      <Stack direction={"row"}>
                        <Typography fontSize={14} ml={1}>
                          {i?.name}
                        </Typography>
                        {i.is_required && (
                          <span
                            style={{ color: "#A91D3A", fontWeight: "bold" }}
                          >
                            &nbsp;*
                          </span>
                        )}
                      </Stack>
                    </StyledHeader>
                  );
                })}
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              p={4}
              sx={{
                bgcolor: "#F4F5F5",
                height: "100%",
              }}
            >
              <Box sx={{ height: "270px", overflow: "auto" }}>
                {uploadedHeaders.map((i, index) => {
                  return (
                    <StyledHeader
                      direction="row"
                      isActiveHeader={currentPair && currentPair[1] === index}
                      isBounded={i?.relation}
                      isUnbindingHeader={
                        removingPair && removingPair[1] === index
                      }
                      isDisabled={currentPair.length < 1}
                      onClick={() =>
                        currentPair.length >= 1 &&
                        onHeaderSelect("uploaded", index, i?.relation)
                      }
                    >
                      <Typography fontSize={14} ml={1}>
                        {i?.name}
                      </Typography>
                      <Typography fontSize={14} ml={"auto"} mr={1}>
                        {i?.relation}
                      </Typography>
                    </StyledHeader>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Box>
        {showErrorMessage && (
          <Typography mt={1} variant="body2" color={"error.main"}>
            {showErrorMessage}
          </Typography>
        )}

        {isSaveDisabled && (
          <Typography mt={1} variant="body2" color={"primary.main"}>
            All Mandatory Headers should be mapped with the uploaded headers
          </Typography>
        )}

        <Stack mt={1} direction={"row"} justifyContent={"center"}>
          <LoadingButton
            fullWidth
            type="submit"
            sx={{ borderRadius: "60px", mt: 5, width: "50%" }}
            variant="contained"
            disabled={isSaveDisabled()}
            isLoading={isLoading}
            onClick={manageSave}
          >
            <Typography fontWeight={"600"}>Save</Typography>
          </LoadingButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default MapHeaders;
