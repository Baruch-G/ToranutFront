import { Typography, Box, CircularProgress } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import GenericTable from "../genericTable/GenericTable";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridValidRowModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Swaps } from "../../models/Shifts";
import axios from "axios";

const dateFormat = (date: Date) =>
  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

const SwapsTable = () => {
  const [rows, setRows] = useState<GridValidRowModel[]>([]);

  const handleAcceptClick = (id: GridRowId) => () => {

    const shift1Id = rows.find((row) => row._id === id)?.shiftId1;
    const shift2Id = rows.find((row) => row._id === id)?.shiftId2;

    const acceptSwap = async () => {
      axios
        .put(`http://localhost:3000/update/swap/status/${id}`, {
          status: "approved",
        })
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
        axios.put(`http://localhost:3000/swap/shifts/${shift1Id}/${shift2Id}`)
        .then(
            (response) => {
                console.log(response);
            }
        );
    };
    acceptSwap();
  };

  const handleDeclineClick = (id: GridRowId) => () => {
    const declineSwap = async () => {
      axios
        .put(`http://localhost:3000/update/swap/status/${id}`, {
          status: "declined",
        })
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    declineSwap();
  };

  useEffect(() => {
    const getPotentials = async () => {
      const response = await fetch("http://localhost:3000/pending/swaps");
      const pendingSwaps: Swaps[] = await response.json();

      const allPendingSwaps: GridValidRowModel[] = [];

      pendingSwaps.forEach((pendingSwap) => {
        allPendingSwaps.push({
          _id: pendingSwap._id,
          shiftId1: pendingSwap.shift1._id,
          shiftType1: pendingSwap.shift1.ShiftType.name,
          executor1: pendingSwap.shift1.Executor.name,
          executorId1: pendingSwap.shift1.Executor.soldierId,
          startdate1: dateFormat(new Date(pendingSwap.shift1.startdate)),
          enddate1: dateFormat(new Date(pendingSwap.shift1.enddate)),
          shiftId2: pendingSwap.shift2._id,
          shiftType2: pendingSwap.shift2.ShiftType.name,
          executor2: pendingSwap.shift2.Executor.name,
          executorId2: pendingSwap.shift2.Executor.soldierId,
          startdate2: dateFormat(new Date(pendingSwap.shift2.startdate)),
          enddate2: dateFormat(new Date(pendingSwap.shift2.enddate)),
        });
      });

      setRows(allPendingSwaps);
    };
    getPotentials();
  }, [handleAcceptClick, handleDeclineClick]);

  const columns: GridColDef[] = [
    {
      field: "shiftType1",
      headerName: "סוג תורנות",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.shiftType1 ? params.row.shiftType1 : "",
    },
    {
      field: "executor1",
      headerName: "מבצע",
      width: 100,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.executor1 ? params.row.executor1 : "",
    },
    {
      field: "executorId1",
      headerName: "מספר אישי",
      width: 100,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.executorId1 ? params.row.executorId1 : "",
    },
    {
      field: "startdate1",
      headerName: "תאריך התחלה",
      width: 100,
    },
    {
      field: "enddate1",
      headerName: "תאריך סיום",
      width: 100,
    },
    {
      field: "swapIcon",
      headerName: "",
      width: 60,
      renderCell: () => (
        <Box>
          <SwapHorizIcon />
        </Box>
      ),
    },
    {
      field: "shiftType2",
      headerName: "סוג תורנות",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.shiftType2 ? params.row.shiftType2 : "",
    },
    {
      field: "executor2",
      headerName: "מבצע",
      width: 100,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.executor2 ? params.row.executor2 : "",
    },
    {
      field: "executorId2",
      headerName: "מספר אישי",
      width: 100,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.executorId2 ? params.row.executorId2 : "",
    },
    {
      field: "startdate2",
      headerName: "תאריך התחלה",
      width: 100,
    },
    {
      field: "enddate2",
      headerName: "תאריך סיום",
      width: 100,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 80,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Check />}
            label="החלפת תורנות"
            className="textPrimary"
            onClick={handleAcceptClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Close />}
            label="מחיקה"
            className="textPrimary"
            onClick={handleDeclineClick(id)}
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
          backgroundColor: "#918f92",
          height: "100%",
          borderRadius: 2,
          marginRight: 2,
        }}
      >
        <Typography
          sx={{ direction: "rtl", margin: 2, color: "white" }}
          variant="h4"
        >
          בקשות החלפות
        </Typography>
        <div
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            marginTop: "20px",
          }}
        >
          {rows.length ? (
            <GenericTable
              checkboxSelection={true}
              items={rows}
              columns={columns}
              pageSize={3}
            />
          ) : (
            <center style={{ color: "white", fontWeight: "700px" }}>
              <CircularProgress />
            </center>
          )}
        </div>
      </Box>
    </>
  );
};

export default SwapsTable;
