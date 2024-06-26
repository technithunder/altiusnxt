import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { HotTable } from "@handsontable/react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { json2csv } from "json-2-csv";
//import images and vectors
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
//import relative path import
import Layout from "../../components/Layout";
import LoadingButton from "../../components/LoadingButton";
import FullScreenView from "../../components/FullScreenModal";
//api
import { downloadCsv, getAttributesDetails, getSingleFile } from "../../api";

const SKULevel = () => {
  const [columnLabels, setColumnLabels] = useState([]);
  const [spreadSheetData, setSpreadSheetData] = useState([]);
  const [selectedCellValue, setSelectedCellValue] = useState(null);
  const [isLoadUrl, setIsLoadUrl] = useState(false);
  const [urlView, setUrlView] = useState(false);
  const [skuCount, setSkuCount] = useState(null);
  const [skuID, setSkuID] = useState(null);
  const [isLoadingIframe, setIsLoadingIframe] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [attributeDetails, setAttributeDetails] = useState(null);
  const [isLoadingCsv, setIsLoadingCsv] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { id, projectID } = useParams();
  const hotTableComponent = useRef(null);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [iframeValue, setIframeValue] = useState(null);
  const [cellValue, setCellValue] = useState(null);

  useEffect(() => {
    if (id && projectID) {
      fetchSingleFile(1);
    }
  }, [id, projectID]);

  useEffect(() => {
    if (selectedProjectID) {
      fetchAttributes();
    }
  }, [selectedProjectID]);

  useEffect(() => {
    const table =
      hotTableComponent.current?.hotInstance?.view?._wt.wtTable.holder;

    const handleScroll = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      const isVerticalScrollEnd = scrollTop + clientHeight >= scrollHeight - 10;

      if (isVerticalScrollEnd && !loading && page < totalPages) {
        loadMoreData();
      }
    };

    table?.addEventListener("scroll", handleScroll);

    return () => {
      table?.removeEventListener("scroll", handleScroll);
    };
  }, [page, totalPages, loading]);

  const fetchAttributes = () => {
    getAttributesDetails(selectedProjectID)
      .then((res) => {
        if (res?.data) {
          setAttributeDetails(res?.data?.data);
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error(e?.response?.data?.message);
      });
  };

  const fetchSingleFile = async (page) => {
    setLoading(true);
    await getSingleFile(id, page, limit)
      .then((res) => {
        if (res) {
          setSkuCount(res?.data?.data?.dataAttributes);
          setTotalPages(res?.data?.data?.dataItems?.totalPages);

          const fetchedData = res?.data?.data?.dataItems?.results;

          setData((prevData) => [...prevData, ...fetchedData]);

          if (fetchedData && fetchedData?.length > 0) {
            const labels = Object.keys(fetchedData[0].data);
            setColumnLabels(labels);

            const formattedData = fetchedData?.map((item) => {
              const dataArray = labels?.map((key) => item.data[key]);
              return { id: item.id, data: dataArray };
            });

            setSpreadSheetData((prevData) => [
              ...prevData,
              ...formattedData?.map((item) => item.data),
            ]);
            setLoading(false);
          }
        }
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e?.response?.data?.message);
      });
  };

  const loadMoreData = () => {
    if (loading || page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSingleFile(nextPage);
  };

  const manageLoadUrl = () => {
    if (selectedCell.row !== null && selectedCell.col !== null) {
      hotTableComponent.current?.hotInstance.selectCell(
        selectedCell.row,
        selectedCell.col
      );
    }
    setCellValue(selectedCell);
    setIframeValue(selectedCellValue);
    setUrlView(true);
  };

  const handleCellClick = (row, col) => {
    const x = data?.find((ele, index) => index === row)?.sku_id;
    const id = data?.find((ele, index) => index === row)?.id;
    setSelectedProjectID(id);
    setSkuID(x);
    if (
      spreadSheetData?.length > row &&
      col >= 0 &&
      col < spreadSheetData[row]?.length
    ) {
      const clickedValue = spreadSheetData[row][col];
      const isUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(clickedValue);
      if (isUrl) {
        setIsLoadUrl(true);
        setSelectedCellValue(clickedValue);
        setSelectedCell({ row, col });
      } else {
        setIsLoadUrl(false);
        // setSelectedCell(null);
      }
    } else {
      console.error("Invalid coordinates or spreadSheetData is not populated.");
    }
  };

  const exportToCSV = async () => {
    setIsLoadingCsv(true);

    try {
      const formattedData = spreadSheetData.map((obj, index) => ({
        id: data[index].id,
        ...columnLabels.reduce((acc, label, headerIndex) => {
          acc[label] = obj[headerIndex];
          return acc;
        }, {}),
      }));

      // Convert JSON to CSV
      const csv = await json2csv(formattedData);

      const blob = new Blob([csv], { type: "text/csv" });
      const file = new File([blob], "data.csv", { type: "text/csv" });
      const formData = new FormData();
      formData.append("project_id", projectID);
      formData.append("file", file);

      const res = await downloadCsv(id, formData);

      if (res?.data) {
        const responseblob = new Blob([res?.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(responseblob);
        link.download = skuCount?.file_name.replace(".xlsx", "") + ".csv";
        link.click();
        toast.success("CSV downloaded");
        setTimeout(() => URL.revokeObjectURL(link.href), 0);
        setSkuID(null);
        setIsLoadingCsv(false);
      }
    } catch (e) {
      setIsLoadingCsv(false);
      toast.error(e?.response?.data?.message);
    }
  };

  const handleClose = () => {
    setIsLoadUrl(false);
    setSelectedCellValue(null);
    setUrlView(false);
    setIsLoadingIframe(false);
    setSkuID(null);
    setIframeValue(null);
    setSelectedCell({ row: null, col: null });
    setCellValue(null);
  };

  const manageFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const toggleColumnVisibility = (columnIndex) => {
    setHiddenColumns((prevHiddenColumns) =>
      prevHiddenColumns.includes(columnIndex)
        ? prevHiddenColumns.filter((col) => col !== columnIndex)
        : [...prevHiddenColumns, columnIndex]
    );
  };

  console.log(skuCount);

  const hotSettings = useMemo(() => {
    const baseSettings = {
      data: spreadSheetData,
      rowHeaders: true,
      colHeaders: columnLabels,
      height: "100%",
      licenseKey: "non-commercial-and-evaluation",
      columnSorting: true,
      manualColumnFreeze: true,
      manualColumnResize: true,
      manualRowResize: true,
      contextMenu: true,
      filters: true,
      dropdownMenu: true,
      hiddenColumns: {
        columns: hiddenColumns,
        indicators: true,
      },
    };

    if (cellValue?.row && cellValue?.col && urlView) {
      baseSettings.cell = [
        {
          row: cellValue?.row,
          col: cellValue?.col,
          className: "custom-cell",
        },
      ];
    } else {
      baseSettings.cell = [];
    }

    return baseSettings;
  }, [spreadSheetData, columnLabels, hiddenColumns, cellValue]);

  return (
    <Layout>
      <Box height={"90vh"}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack width={"40%"}>
            <Typography fontWeight={"500"} variant="caption" direction="row">
              FileName: {skuCount?.file_name}
            </Typography>
            <Typography
              textTransform={"uppercase"}
              variant="caption"
              fontWeight={"500"}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              sku id: {skuID}
            </Typography>
          </Stack>
          <Stack spacing={4} direction={"row"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Typography variant="caption">
                Filled SKU Count: {skuCount?.filled_sku_count || 0}
              </Typography>
              <Typography variant="caption">
                Filled Attritbute Count:{" "}
                {attributeDetails?.attributes_count_found || 0}
              </Typography>
            </Box>
            <Box display={"flex"} flexDirection={"column"}>
              <Typography variant="caption">
                Blank SKU Count: {skuCount?.blank_sku_count || 0}
              </Typography>
              <Typography variant="caption">
                Blank Attritube Count:{" "}
                {attributeDetails?.attributes_count_not_found || 0}
              </Typography>
            </Box>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={3}>
            {isLoadUrl && (
              <LoadingButton
                fullWidth
                onClick={manageLoadUrl}
                variant="outlined"
              >
                Load URL
              </LoadingButton>
            )}
            <LoadingButton
              onClick={exportToCSV}
              sx={{ width: "300px" }}
              fullWidth
              isLoading={isLoadingCsv}
              variant="outlined"
            >
              Save & Export
            </LoadingButton>
          </Stack>
        </Stack>
        <Box mt={4}>
          <Box mt={2}>
            <Grid container spacing={1}>
              <Grid item md={urlView ? 8 : 12}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: urlView ? "1000px" : "100%",
                    height: "100%",
                    mt: 1,
                  }}
                >
                  <Stack direction="row" spacing={2} mb={2} overflow={"auto"}>
                    {columnLabels.map((label, index) => (
                      <Stack direction="row" alignItems="center" key={index}>
                        <Checkbox
                          checked={!hiddenColumns.includes(index)}
                          onChange={() => toggleColumnVisibility(index)}
                        />
                        <Typography
                          whiteSpace={"nowrap"}
                          width={"max-content"}
                          fontSize={12}
                        >
                          {label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <div
                    style={{
                      width: "100%",
                      height: "75vh",
                    }}
                  >
                    {spreadSheetData?.length > 0 ? (
                      <HotTable
                        afterSelectionFocusSet={{ row: 1, column: 1 }}
                        ref={hotTableComponent}
                        className="custom-table"
                        settings={hotSettings}
                        afterSelection={(
                          r,
                          c,
                          r2,
                          c2,
                          preventScrolling,
                          selectionLayerLevel
                        ) => {
                          handleCellClick(r, c);
                        }}
                      />
                    ) : (
                      <Box display={"flex"} justifyContent={"center"} mt={4}>
                        <CircularProgress
                          size={22}
                          sx={{
                            color: "primary.main",
                          }}
                        />
                      </Box>
                    )}
                  </div>
                </Box>
              </Grid>
              <Grid item md={urlView ? 4 : 0}>
                {urlView && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      minHeight: "500px",
                    }}
                  >
                    <IconButton
                      aria-label="close"
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        backgroundColor: "#fff",
                        right: "0px",
                        zIndex: 1000,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                        color: "#fff",
                      }}
                      onClick={manageFullScreen}
                    >
                      <FullscreenIcon sx={{ color: "#000" }} />
                    </IconButton>
                    <IconButton
                      aria-label="close"
                      style={{
                        position: "absolute",
                        top: "-10px",
                        backgroundColor: "#fff",
                        right: "-10px",
                        zIndex: 1000,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                        color: "#fff",
                      }}
                      onClick={handleClose}
                    >
                      <CloseIcon sx={{ color: "#000" }} />
                    </IconButton>
                    {isLoadingIframe ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <CircularProgress
                          size={26}
                          sx={{ color: "primary.main" }}
                        />
                      </Box>
                    ) : (
                      <iframe
                        src={iframeValue}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                        }}
                        title="External Website"
                        onLoad={() => setIsLoadingIframe(false)}
                      />
                    )}
                  </div>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      {isFullScreen && selectedCellValue && (
        <FullScreenView
          open={isFullScreen}
          selectedCellValue={selectedCellValue}
          onClose={closeFullScreen}
        />
      )}
    </Layout>
  );
};

export default SKULevel;
