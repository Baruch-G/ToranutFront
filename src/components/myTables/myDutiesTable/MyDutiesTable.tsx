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





interface MyDutiesTableProps {
  rowSelected?: (row: GridValidRowModel) => void;
  selectable?: boolean;
  onlyExecutor?: boolean;
}

const MyDutiesTable = (props: MyDutiesTableProps) => {
  const usersTableContainer = useRef<HTMLDivElement>(null); // Add the type here

  const [rows, setRows] = useState<Shift[]>([]);


  const columns: GridColDef[] = props.onlyExecutor ? [
    {
      field: "ShiftType",
      headerName: "סוג תורנות",
      width: 100,
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
      width: 110,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.Executor ? params.row.Executor.soldierId : "",
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
  ] : 
  [
    {
      field: "ShiftType",
      headerName: "סוג תורנות",
      width: 100,
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
      width: 110,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.Executor ? params.row.Executor.soldierId : "",
      sortable: false,
    },
    {
      field: "FirstSubstituteName",
      headerName: "עתודה ראשונה",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.FirstSubstitute ? params.row.FirstSubstitute.name : "",
    },
    {
      field: "FirstSubstituteId",
      headerName: 'מ"א עתודה ראשונה',
      width: 110,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.FirstSubstitute ? params.row.FirstSubstitute.soldierId : "",
      sortable: false,
    },
    {
      field: "SecondSubstituteName",
      headerName: "עתודה שניה",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.SecondSubstitute ? params.row.SecondSubstitute.name : "",
    },
    {
      field: "SecondSubstituteId",
      headerName: 'מ"א עתודה שניה',
      width: 110,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.SecondSubstitute ? params.row.SecondSubstitute.soldierId : "",
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

  useEffect(() => {
    const getPotentials = async () => {
      const response = props.onlyExecutor
        ? await fetch(
            `http://localhost:3000/potential/shifts/population/${localStorage.getItem(
              "SoldierPopulation"
            )}/executor/${localStorage.getItem("SoldierID")}`
          )
        : await fetch(
            `http://localhost:3000/potential/shifts/${localStorage.getItem(
              "SoldierID"
            )}`
          );
      const shifts: Shift[] = await response.json();
      setRows(shifts);
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
