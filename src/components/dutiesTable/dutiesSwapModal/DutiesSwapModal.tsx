import { Box, Modal, Typography, Button } from "@mui/material";
import {
  GridColDef,
  GridRowSelectionModel,
  GridValidRowModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useState } from "react";
import GenericTable from "../../genericTable/GenericTable";
import MyDutiesTable from "../../myTables/myDutiesTable/MyDutiesTable";
import axios from "axios";

interface DutiesSwapModalProps {
  open: boolean;
  handleClose: () => void;
  rowToSwap: GridValidRowModel | null;
}

const dateFormat = (date: Date) =>
  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

const DutiesSwapModal = (props: DutiesSwapModalProps) => {
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
      width: 105,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.startdate ? dateFormat(new Date(params.row.startdate)) : "",
    },
    {
      field: "enddate",
      headerName: "תאריך סיום",
      width: 105,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.enddate ? dateFormat(new Date(params.row.enddate)) : "",
    },
  ];

  const [selectedRows, setSelectedRows] = useState<GridValidRowModel | null>(
    null
  );

  const handleSwap = () => {
    
    
    if (props.rowToSwap && selectedRows) {
      console.log(selectedRows[0]);
      console.log(props.rowToSwap);
      axios.post("http://localhost:3000/pending/swap", {
        shift1: selectedRows[0],
        shift2: props.rowToSwap,
        status: "pending",
      });
    }
    props.handleClose();
  };

  return (
    <Modal
      open={props.open}
      sx={{
        position: "absolute" as "absolute",
        margin: "auto",
        marginTop: "2%",
        marginBottom: "2%",
        width: 1100,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component="h4"
          sx={{
            direction: "rtl",
            textAlign: "center",
            color: "white",
          }}
        >
          החלפת תורנות
        </Typography>
        <Box sx={{
            backgroundColor: "#b1a296",
            borderRadius: 2,
            marginTop: 2,
            padding: 2,
          }}>
             <Typography
            variant="h6"
            component="h2"
            sx={{ direction: "rtl", color: "white", marginRight: "20px" }}
          >
            תורנות להחלפה
          </Typography>
        <div
      style={{
        marginLeft: "5px",
        marginRight: "5px",
        marginTop: "5px",
        marginBottom: "5px",
      }}
    >
<GenericTable
          columns={columns}
          items={props.rowToSwap ? [props.rowToSwap] : []}
          pageSize={5}
          footer
        />
      </div>
        </Box>
        
        <Box
          sx={{
            backgroundColor: "#b1a296",
            height: 475,
            borderRadius: 2,
            marginTop: 3,
            padding: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ direction: "rtl", color: "white", marginRight: "20px" }}
          >
            תורנויות שלי
          </Typography>
          <MyDutiesTable selectable={true} onlyExecutor={true} rowSelected={setSelectedRows} />
        </Box>
        <Box sx={{direction: "rtl"}}>
          <Button
            variant="contained"
            sx={{ marginRight: 50, marginTop: 2, width: 100,  color: "white", backgroundColor: "#3E5F8A", borderRadius: 2, fontWeight: "bold"}}
            onClick={handleSwap}
          >
            אישור
          </Button>
          <Button
            variant="outlined"
            
            sx={{ marginRight: 6.25, marginTop: 2, width: 100, color: "white", borderColor: "#3E5F8A", borderRadius: 2, fontWeight: "bold", borderWidth: 2, ":hover": {color: "white", borderWidth: 2} }}
            onClick={props.handleClose}
          >
            ביטול
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DutiesSwapModal;
