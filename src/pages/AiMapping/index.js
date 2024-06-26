import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
//relative path import
import Layout from "../../components/Layout";
import AIModal from "../../components/AIModal";
import TablePagination from "../../components/TablePagination";
import InputField from "../../components/InputField";
//import vectors and images
import SearchIcon from "@mui/icons-material/Search";

//api import
import {
  getAllFiles,
  getProjectNameDetails,
  reRunAI,
  runAI,
  searchFile,
} from "../../api";

const AiMapping = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const initialPage = parseInt(query.get("page")) || 0;
  const initialRowsPerPage = parseInt(query.get("limit")) || 10;

  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [openAIModal, setOpenAIModal] = useState(false);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [projectNameDetails, setProjectNameDetails] = useState(null);
  const [batchID, setBatchID] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isAiCompleted, setIsAICompleted] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  useEffect(() => {
    fetchAllProjects();
  }, [page, rowsPerPage, debouncedSearchValue]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const newPage = parseInt(query.get("page")) || 0;
    const newLimit = parseInt(query.get("limit")) || 10;
    setPage(newPage);
    setRowsPerPage(newLimit);
  }, [location.search]);

  const fetchAllProjects = () => {
    setIsLoading(true);
    getAllFiles(page + 1, rowsPerPage)
      .then((res) => {
        if (res) {
          setIsLoading(false);
          setData(res?.data?.data);
          setTotalResults(res?.data?.pagination?.totalResults);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      setIsLoading(true);
      searchFile(debouncedSearchValue)
        .then((res) => {
          if (res) {
            setIsLoading(false);
            setData(res?.data?.data);
            setTotalResults(res?.data?.pagination?.totalResults);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    }
  }, [debouncedSearchValue]);

  const handleChangePage = (event, newPage) => {
    navigate(`?page=${newPage}&limit=${rowsPerPage}`);
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    navigate(`?page=0&limit=${newLimit}`);
  };

  const manageAI = (params) => {
    setIsAICompleted(params?.row?.is_ai_processing_completed);
    setBatchID(params?.row?.batch_id);
    setOpenAIModal(true);
    setProjectNameDetails(null);
  };

  const aiModalClose = () => {
    setOpenAIModal(false);
    setIsLoadingAI(false);
    setBatchID(null);
    setIsAICompleted(null);
    setProjectName(null);
  };

  const onChangeSearch = (e) => {
    let { value } = e.target;
    setSearchValue(value.trim());
  };

  const manageFile = (params) => {
    navigate(`/sku-level/${params?.row?.batch_id}/${params?.row?.project_id}`);
  };

  const manageName = (params) => {
    setProjectName(params?.row?.id);
    getProjectNameDetails(params?.row?.batch_id)
      .then((res) => {
        if (res?.data) {
          setProjectNameDetails({
            ...res?.data?.data,
            fileName: params?.row?.file_name,
          });
        }
      })
      .catch((e) => console.log(e));
  };

  const manageAIrun = () => {
    setIsLoadingAI(true);
    let obj = {
      batch_id: batchID,
    };
    if (batchID) {
      if (isAiCompleted) {
        reRunAI(obj)
          .then((res) => {
            if (res) {
              aiModalClose();
              fetchAllProjects();
              toast.success(res?.data?.message);
            }
          })
          .catch((e) => {
            console.log(e);
            aiModalClose();
            toast.error(e?.response?.data?.message);
          });
      } else {
        runAI(obj)
          .then((res) => {
            if (res) {
              aiModalClose();
              fetchAllProjects();
              toast.success(res?.data?.message);
            }
          })
          .catch((e) => {
            aiModalClose();
            toast.error(e?.response?.data?.message);
          });
      }
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Sn",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="body1" fontWeight={"600"} color={"primary.dark"}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => {
        const visibleSortedRows = params?.api
          .getSortedRowIds()
          .filter((rowId) => params?.api?.getRow(rowId) !== null);
        const rowIndex = visibleSortedRows?.indexOf(params.id) + 1;
        return rowIndex;
      },
    },
    {
      field: "project_name",
      headerName: "Project",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="body1" fontWeight={"600"} color={"primary.dark"}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Tooltip arrow title={params?.row?.project_name}>
          <Typography
            sx={{
              cursor: "pointer",
              color:
                params?.row?.id === projectName
                  ? "primary.main"
                  : "primary.dark",
              textDecorationLine:
                params?.row?.id === projectName ? "underline" : "none",
            }}
            onClick={() => manageName(params)}
            variant="caption"
          >
            {params?.row?.project_name}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "file_name",
      headerName: "File Name",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="body1" fontWeight={"600"} color={"primary.dark"}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Tooltip arrow title={params?.row?.file_name}>
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => manageFile(params)}
            variant="caption"
          >
            {params?.row?.file_name}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created On",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="body1" fontWeight={"600"} color={"primary.dark"}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => {
        const formattedDate = moment(params?.row?.createdAt).format(
          "DD MMM, YYYY - hh.mm A"
        );
        return <Typography variant="caption">{formattedDate}</Typography>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="body1" fontWeight={"600"} color={"primary.dark"}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => {
        const { is_in_ai_process, is_ai_processing_completed } = params.row;
        let status = "";
        let color = "";

        if (!is_in_ai_process && !is_ai_processing_completed) {
          status = "Pending";
          color = "#A98E2B";
        } else if (is_in_ai_process && !is_ai_processing_completed) {
          status = "In-Progress";
          color = "#A98E2B";
        } else if (is_ai_processing_completed) {
          status = "Completed";
          color = "#25943E";
        }

        return (
          <Typography variant="caption" sx={{ color: color }}>
            {status}
          </Typography>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="body1" fontWeight={"600"} color={"primary.dark"}>
          {params.colDef.headerName}
        </Typography>
      ),
      renderCell: (params) => (
        <Box>
          {params?.row?.is_in_ai_process &&
          !params?.row?.is_ai_processing_completed ? (
            <Typography
              variant="caption"
              sx={{ color: "secondary.main", cursor: "not-allowed" }}
            >
              Run AI
            </Typography>
          ) : (
            <Typography
              sx={{ cursor: "pointer" }}
              variant="caption"
              onClick={() => manageAI(params)}
            >
              {params?.row?.is_ai_processing_completed ? "Re-Run AI" : "Run AI"}
            </Typography>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <InputField
          placeholder="Search file"
          variant="outlined"
          fullWidth
          onChange={onChangeSearch}
          value={searchValue}
          startAdornment={<SearchIcon />}
        />
        {projectNameDetails && (
          <Box
            border={"1px solid #000"}
            px={2}
            py={1}
            display={"flex"}
            flexDirection={"column"}
            borderRadius={2}
          >
            <Typography
              mt={-3}
              px={1}
              sx={{ backgroundColor: "#fff", width: "max-content" }}
              variant="caption"
            >
              {projectNameDetails?.fileName}
            </Typography>
            <Stack direction={"row"} spacing={4}>
              <Typography variant="body2">
                No. of Tax: {projectNameDetails?.taxonomy_count}
              </Typography>
              <Typography variant="body2">
                No.of Mfr: {projectNameDetails?.mfr_count}
              </Typography>
              <Typography variant="body2">
                No. of SKU's: {projectNameDetails?.sku_count}
              </Typography>
            </Stack>
          </Box>
        )}
      </Stack>
      <Box my={4}>
        {isLoading ? (
          <CircularProgress
            sx={{
              display: "flex",
              color: "primary.main",
              margin: "0 auto",
              fontSize: "18px",
            }}
          />
        ) : (
          <Box>
            {data.length ? (
              <Box>
                <DataGrid
                  autoHeight
                  rows={data}
                  columns={columns}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  hideFooter
                  sx={{
                    "& .MuiDataGrid-cell": {
                      borderBottom: "none !important",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      borderBottom: "none !important",
                    },
                  }}
                />
                <TablePagination
                  rows={data}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  totalResults={totalResults}
                  handleChangePage={handleChangePage}
                />
              </Box>
            ) : (
              <Box>
                <Typography textAlign={"center"} variant="h5">
                  No Data Found
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {openAIModal && (
        <AIModal
          handleRun={manageAIrun}
          open={openAIModal}
          onClose={aiModalClose}
          isLoading={isLoadingAI}
          isReRun={isAiCompleted}
        />
      )}
    </Layout>
  );
};

export default AiMapping;
