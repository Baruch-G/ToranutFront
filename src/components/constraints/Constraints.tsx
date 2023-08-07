import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
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
        { id, name: rows[0].name, soldierId: rows[0].soldierId, isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    const getPotentials = async () => {
      const response = await fetch("http://localhost:3000/constraints/8701535");
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
    getPotentials();
  }, []);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

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
    rows.forEach((row) => 
    {
        if(row.id === id)
        {
            axios.delete("http://localhost:3000/constraints/" + row.soldierId + "/" + row._id)
            .then((response) => {
                console.log("DB update successful:", response.data);
                // Do something with the response if needed
              })
              .catch((error) => {
                console.error("Error updating DB:", error);
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
          "http://localhost:3000/constraints/" + newRow.soldierId,
          {
            constraint: newRow.constraint,
            startdate: newRow.startdate,
            enddate: newRow.enddate,
          }
        )
        .then((response) => {
          console.log("DB update successful:", response.data);
          // Do something with the response if needed
        })
        .catch((error) => {
          console.error("Error updating DB:", error);
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
          console.log("DB update successful:", response.data);
          // Do something with the response if needed
        })
        .catch((error) => {
          console.error("Error updating DB:", error);
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
    { field: "constraint", headerName: "אילוץ", width: 250, editable: true },
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
        height: 700,
        direction: "rtl",
        backgroundColor: "white",
        marginLeft: "50px",
        marginRight: "50px",
        marginTop: "50px",
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
      />
    </Box>
  );
};

export default ConstraintsTable;
