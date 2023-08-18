import { useEffect, useRef, useState } from "react";
import GenericTable from "../genericTable/GenericTable";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridValidRowModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Potential } from "../../models/Shifts";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DutiesSwapModal from "./dutiesSwapModal/DutiesSwapModal";

const dateFormat = (date: Date) =>
  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

const DutiesTable = () => {
  const usersTableContainer = useRef<HTMLDivElement>(null); // Add the type here
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [rows, setRows] = useState<GridValidRowModel[]>([]);
  const [rowToSwap, setRowToSwap] = useState<GridValidRowModel | null>(null);

  useEffect(() => {
    const getPotentials = async () => {
      const response = await fetch("http://localhost:3000/potential");
      const potentials: Potential[] = await response.json();

      const allShifts: GridValidRowModel[] = [];

      potentials.forEach((potential) => {
        potential.shifts.forEach((shift) => {
          allShifts.push(shift);
        });
      });

      setRows(allShifts);
    };
    getPotentials();
  }, []);

  const handleSwapClick = (id: GridRowId) => () => {
    setOpenModal(true);
    rows.forEach((row) => {
      if (row._id === id) {
        setRowToSwap(row);
      }
    });
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const columns: GridColDef[] = [
    {
      field: "ShiftType",
      headerName: "סוג תורנות",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.ShiftType ? params.row.ShiftType.name : "",
    },
    {
      field: "ExecutorName",
      headerName: "מבצע",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.Executor ? params.row.Executor.name : "",
    },
    {
      field: "Executor",
      headerName: "מספר אישי מבצע",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.Executor ? params.row.Executor.soldierId : "",
      sortable: false,
    },
    {
      field: "SubstituteName",
      headerName: "עתודה",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.Substitute ? params.row.Substitute.name : "",
    },
    {
      field: "Substitute",
      headerName: "מספר אישי עתודה",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.Substitute ? params.row.Substitute.soldierId : "",
      sortable: false,
    },
    {
      field: "startdate",
      headerName: "תאריך התחלה",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.startdate ? dateFormat(new Date(params.row.startdate)) : "",
    },
    {
      field: "enddate",
      headerName: "תאריך סיום",
      width: 855,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.enddate ? dateFormat(new Date(params.row.enddate)) : "",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<SwapHorizIcon />}
            label="החלפת תורנות"
            className="textPrimary"
            onClick={handleSwapClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#557A95",
          height: "100%",
          borderRadius: 2,
          margin: 5,
        }}
      >
        <Typography
          variant="h4"
          style={{
            color: "white",
            fontWeight: "700px",
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          כל התורנויות בפוטנציאל
        </Typography>
        <div
          ref={usersTableContainer}
          style={{
            marginLeft: "50px",
            marginRight: "50px",
            marginTop: "30px",
          }}
          className="duties-table"
        >
          {rows.length ? (
            <GenericTable
              checkboxSelection={true}
              items={rows}
              columns={columns}
            />
          ) : (
            <center style={{ color: "white", fontWeight: "700px" }}>
              <CircularProgress />
            </center>
          )}
        </div>
        <Typography
          variant="h6"
          style={{ color: "white", height: "40px", fontWeight: "700px" }}
        />
      </Box>
      <DutiesSwapModal open={openModal} handleClose={handleModalClose} rowToSwap={rowToSwap} />
    </>
  );
};

export default DutiesTable;
