import React from "react";
import { MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";

const TablePagination = ({
  rowsPerPage,
  handleChangeRowsPerPage,
  handleChangePage,
  page,
  totalResults,
}) => {
  return (
    <Stack
      mt={2}
      alignItems={"center"}
      direction={"row"}
      justifyContent={"space-between"}
      px={1}
      sx={{
        border: "1px solid #D9D9D9",
        borderRadius: "10px",
        height: "60px",
      }}
    >
      <Typography variant="caption">Total Files: {totalResults}</Typography>
      <Stack direction="row" alignItems="center" spacing={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="caption">Show</Typography>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            size="small"
            sx={{ height: "30px", fontSize: "16px" }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
          </Select>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="caption">Per Page</Typography>
          <Pagination
            count={Math.ceil(totalResults / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => handleChangePage(event, value - 1)}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "16px",
              },
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TablePagination;
