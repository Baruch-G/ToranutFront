import { useEffect, useRef, useState } from "react";
import GenericTable from "../../genericTable/GenericTable";
import {
  GridColDef,
  GridRowSelectionModel,
  GridValidRowModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Shift } from "../../../models/Shifts";
import CircularProgress from "@mui/material/CircularProgress";

const dateFormat = (date: Date) =>
  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

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

interface MyDutiesTableProps {
  rowSelected?: (row: GridValidRowModel) => void;
  selectable?: boolean;
  onlyExecutor?: boolean;
}

const MyDutiesTable = (props: MyDutiesTableProps) => {
  const usersTableContainer = useRef<HTMLDivElement>(null); // Add the type here

  const [rows, setRows] = useState<Shift[]>([]);

  useEffect(() => {
    const getPotentials = async () => {
      const response = await fetch(
        props.onlyExecutor
          ? "http://localhost:3000/potential/shifts/executor/" +
              localStorage.getItem("SoldierID")
          : "http://localhost:3000/potential/shifts/" +
              localStorage.getItem("SoldierID")
      );
      const potentials: Shift[] = await response.json();
      setRows(potentials);
    };
    getPotentials();
  }, []);

  return (
    <div
      ref={usersTableContainer}
      style={{
        marginLeft: "20px",
        marginRight: "20px",
        marginTop: "20px",
        marginBottom: "20px",
      }}
      className="duties-table"
    >
      {rows.length ? (
        <GenericTable
          pageSize={5}
          items={rows}
          columns={columns}
          checkboxSelection={props.selectable}
          rowSelected={props.rowSelected}
          height={371}
        />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default MyDutiesTable;
