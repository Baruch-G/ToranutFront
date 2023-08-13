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
import { Constraints } from "../../models/Shifts";
import axios from "axios";

interface AlertProps {
  open: boolean;
  severity: "success" | "error" | "info" | "warning";
  message: string;
}

const ConstraintsTable = () => {
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
        ...oldRows,
        {
          id,
          name: localStorage.getItem("SoldierName"),
          soldierId: localStorage.getItem("SoldierID"),
          isNew: true,
        },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));
    };

    return (
      <GridToolbarContainer >
        <Button sx={{marginRight:205, direction: "ltr"}} color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          הוסף אילוץ
        </Button>
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    fetch(
      "http://localhost:3000/constraints/check/" +
        localStorage.getItem("SoldierID")
    )
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        const dataResponse = data === "true";

        if (dataResponse) {
          getPotentials();
        } else {
          axios.post(
            "http://localhost:3000/constraints/" +
              localStorage.getItem("SoldierID"),
            {
              name: localStorage.getItem("SoldierName"),
              soldierId: localStorage.getItem("SoldierID"),
              constraintList: [],
            }
          );
        }
      });
    const getPotentials = async () => {
      const response = await fetch(
        "http://localhost:3000/constraints/" + localStorage.getItem("SoldierID")
      );
      const potentials: Constraints[] = await response.json();

      setRows(
        potentials[0].constraintList.map((item) => ({
          ...item,
          id: item["_id"],
          startdate: new Date(item["startdate"]),
          enddate: new Date(item["enddate"]),
          name: potentials[0]["name"],
          soldierId: potentials[0]["soldierId"],
        }))
      );
    };
  }, []);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [open, setOpen] = useState<AlertProps>({ open: false, severity: "success", message: "" });

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
            "http://localhost:3000/constraints/" + row.soldierId + "/" + row._id
          )
          .then((response) => {
            setOpen({ open: true, severity: "success", message: "Constraint deleted successfully"});
          })
          .catch((error) => {
            setOpen({ open: true, severity: "error", message: "Error updating DB"});
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
        .post("http://localhost:3000/constraints/constraint/" + newRow.soldierId, {
          constraint: newRow.constraint,
          startdate: newRow.startdate,
          enddate: newRow.enddate,
        })
        .then((response) => {
          setOpen({ open: true, severity: "success", message: "Constraint added successfully"});
        })
        .catch((error) => {
          setOpen({ open: true, severity: "error", message: "Error updating DB"});
        });
    } else {
      axios
        .put(
          "http://localhost:3000/constraints/" +
            newRow.soldierId +
            "/" +
            newRow._id,
          {
            constraint: newRow.constraint,
            startdate: newRow.startdate,
            enddate: newRow.enddate,
          }
        )
        .then((response) => {
          setOpen({ open: true, severity: "success", message: "Constraint updated successfully"});
        })
        .catch((error) => {
          setOpen({ open: true, severity: "error", message: "Error updating DB"});
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
    { field: "name", headerName: "שם", width: 180, editable: false },
    {
      field: "soldierId",
      headerName: "מספר אישי",
      type: "id",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "startdate",
      headerName: "תאריך התחלה אילוץ",
      type: "date",
      width: 180,
      editable: true,
    },
    {
      field: "enddate",
      headerName: "תאריך סיום אילוץ",
      type: "date",
      width: 180,
      editable: true,
    },
    { field: "constraint", headerName: "אילוץ", width: 1000, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
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
    <Box
    sx={{
      backgroundColor: "#b1a296",
      height: "100%",
      borderRadius: 2,
      marginTop: 4,
      marginLeft: 5,
      marginRight: 5,
      marginBottom: 3,
    }}
  >
    <Typography variant="h4"
        style={{
          color: "white",
          fontWeight: "700px",
          textAlign: "center",
          marginTop: "20px",
        }}>
      אילוצים
    </Typography>
    <Box
      sx={{
        height: 700,
        direction: "rtl",
        backgroundColor: "white",
        borderRadius: "5px",
        marginLeft: "40px",
        marginRight: "40px", 
        marginTop: "20px",
      }}
    >
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
        {<Alert variant="filled" severity={open.severity}>{open.message}</Alert>}
      </Snackbar>
    </Box>
    <Typography variant="h6" style={{ color: "white", height: "40px", marginBottom:2, fontWeight: "700px" }} />
    </Box>
  );
};

export default ConstraintsTable;
