import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Snackbar, Alert, Typography } from "@mui/material";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { Constraints, Shift } from "../../models/Shifts";
import axios from "axios";

interface AlertProps {
  open: boolean;
  severity: "success" | "error" | "info" | "warning";
  message: string;
}

const EditShifts = () => {
  const [rows, setRows] = useState<GridValidRowModel[]>([]);

  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
  }

  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = Math.floor(Math.random() * 100);
      setRows((oldRows) => [
        {
            id,
            shiftName: "",
            shiftPointValue: 0,
            shiftPopulation: localStorage.getItem("SoldierPopulation"),
            executorName: "",
            executorId: 0,
            firstSubstituteName: "",
            firstSubstituteId: 0,
            secondSubstituteName: "",       
            secondSubstituteId: 0,
            pointMultiplier: 0,
            startdate: new Date(),
            enddate: new Date(),
            isNew: true,
        },
        ...oldRows,
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button
          sx={{ direction: "ltr" }}
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClick}
        >
          הוסף אילוץ
        </Button>
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    const getShifts = async () => {
      const response = await fetch(
        `http://localhost:3000/potential/shifts/population/${localStorage.getItem("SoldierPopulation")}`);
      const shifts: Shift[] = await response.json();
      
      const allConstraints: GridValidRowModel[] = [];

      shifts.forEach((shift) => {       
        const shiftRow = {
            id: shift["_id"],
            shiftName: shift.ShiftType.name,
            shiftPointValue: shift.ShiftType.pointValue,
            shiftPopulation: shift.ShiftType.population,
            executorName: shift.Executor.name,
            executorId: shift.Executor.soldierId,
            firstSubstituteName: shift.FirstSubstitute.name !== undefined ? shift.FirstSubstitute.name : "",
            firstSubstituteId: shift.FirstSubstitute.soldierId !== undefined ? shift.FirstSubstitute.soldierId : 0,
            secondSubstituteName: shift.SecondSubstitute.name ? shift.SecondSubstitute.name : "",       // Need to add second substitute
            secondSubstituteId: shift.SecondSubstitute.soldierId ? shift.SecondSubstitute.soldierId : 0 ,    // Need to add second substitute
            pointMultiplier: shift.PointMultiplier,
            startdate: new Date(shift.startdate),
            enddate: new Date(shift.enddate),
        }
        allConstraints.push(shiftRow);
        });
        setRows(allConstraints);
    };
    getShifts(); 
  }, []);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [open, setOpen] = useState<AlertProps>({
    open: false,
    severity: "success",
    message: "",
  });

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    rows.forEach((row) => {      
      if (row.id === id) {
        axios
          .delete(
            `http://localhost:3000/potential/shifts/${row.id}`
          )
          .then((response) => {
            setOpen({
              open: true,
              severity: "success",
              message: "Shift deleted successfully",
            });
          })
          .catch((error) => {
            setOpen({
              open: true,
              severity: "error",
              message: "Error updating DB",
            });
          });
      }
    });
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    if (newRow.isNew) {
      axios
        .post(
          `http://localhost:3000/potential/shifts/${localStorage.getItem("SoldierPopulation")}`,
          {
            ShiftType: { name: newRow.shiftName, pointValue: newRow.shiftPointValue, population: newRow.shiftPopulation},
            Executor: { name: newRow.executorName, soldierId: newRow.executorId, population: newRow.shiftPopulation },
            FirstSubstitute: { name: newRow.firstSubstituteName, soldierId: newRow.firstSubstituteId, population: newRow.shiftPopulation },
            SecondSubstitute: { name: newRow.secondSubstituteName, soldierId: newRow.secondSubstituteId, population: newRow.shiftPopulation },
            PointMultiplier: newRow.pointMultiplier,
            startdate: new Date(newRow.startdate),
            enddate: new Date(newRow.enddate),
          }
        )
        .then((response) => {
          setOpen({
            open: true,
            severity: "success",
            message: "Constraint added successfully",
          });
        })
        .catch((error) => {
          setOpen({
            open: true,
            severity: "error",
            message: "Error updating DB",
          });
        });
    } else {
      axios
        .put(
          `http://localhost:3000/potential/shifts/${newRow.id}`,
          {
            ShiftType: { name: newRow.shiftName, pointValue: newRow.shiftPointValue, population: newRow.shiftPopulation},
            Executor: { name: newRow.executorName, soldierId: newRow.executorId, population: newRow.shiftPopulation },
            FirstSubstitute: { name: newRow.firstSubstituteName, soldierId: newRow.firstSubstituteId, population: newRow.shiftPopulation },
            SecondSubstitute: { name: newRow.secondSubstituteName, soldierId: newRow.secondSubstituteId, population: newRow.shiftPopulation },
            PointMultiplier: newRow.pointMultiplier,
            startdate: new Date(newRow.startdate),
            enddate: new Date(newRow.enddate),
          }
        )
        .then((response) => {
          setOpen({
            open: true,
            severity: "success",
            message: "Constraint updated successfully",
          });
        })
        .catch((error) => {
          setOpen({
            open: true,
            severity: "error",
            message: "Error updating DB",
          });
        });
    }
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: "shiftName", headerName: "שם שמירה", width: 130, editable: true },
    {
        field: "shiftPointValue",
        headerName: "ניקוד לשמירה",
        width: 40,
        editable: true,
    },
    {
        field: "shiftPopulation",
        headerName: "אוכלוסיה",
        width: 100,
        editable: true,
    },
    {
      field: "executorName",
      headerName: "שם מבצע",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
        field: "executorId",
        headerName: "מספר אישי מבצע",
        type: "id",
        width: 120,
        align: "left",
        headerAlign: "left",
        editable: true,
    },
    {
        field: "firstSubstituteName",
        headerName: "שם עתודה ראשון",
        width: 150,
        align: "left",
        headerAlign: "left",
        editable: true,
    },
    {
        field: "firstSubstituteId",
        headerName: "מספר אישי עתודה ראשון",
        type: "id",
        width: 120,
        align: "left",
        headerAlign: "left",
        editable: true,
    },
    {
        field: "secondSubstituteName",
        headerName: "שם עתודה שני",
        width: 150,
        align: "left",
        headerAlign: "left",
        editable: true,
    },
    {
        field: "secondSubstituteId",
        headerName: "מספר אישי עתודה שני",
        type: "id",
        width: 120,
        align: "left",
        headerAlign: "left",
        editable: true,
    },
    {
        field: "pointMultiplier",
        headerName: "מכפיל ניקוד",
        width: 100,
        align: "left",
        headerAlign: "left",
        editable: true,
    },
    {
      field: "startdate",
      headerName: "תאריך התחלה אילוץ",
      type: "date",
      width: 150,
      editable: true,
    },
    {
      field: "enddate",
      headerName: "תאריך סיום אילוץ",
      type: "date",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowThreshold={5}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10]}
        />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          open={open.open}
          autoHideDuration={3000}
        >
          {
            <Alert variant="filled" severity={open.severity}>
              {open.message}
            </Alert>
          }
        </Snackbar>
    </Box>
  );
};

export default EditShifts;
