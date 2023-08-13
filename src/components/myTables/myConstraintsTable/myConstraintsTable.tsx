import { useEffect, useRef, useState } from "react"
import GenericTable from "../../genericTable/GenericTable"
import { GridColDef, GridValidRowModel, GridValueGetterParams } from "@mui/x-data-grid";
import { Constraints } from "../../../models/Shifts";
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from "@mui/material";

const dateFormat = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

const columns: GridColDef[] = [
    { field: "name", headerName: "שם", width: 180 },
    {
      field: "soldierId",
      headerName: "מספר אישי",
      type: "id",
      width: 100,
      align: "left",
      headerAlign: "left"
    },
    {
      field: "startdate",
      headerName: "תאריך התחלה אילוץ",
      type: "date",
      width: 180
    },
    {
      field: "enddate",
      headerName: "תאריך סיום אילוץ",
      type: "date",
      width: 180
    },
    { field: "constraint", headerName: "אילוץ", width: 250}
];

const MyConstraintsTable = () => {
    const usersTableContainer = useRef<HTMLDivElement>(null) // Add the type here

    const [rows, setRows] = useState<GridValidRowModel[]>([])

    useEffect(() => {
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
        getPotentials()
    }, [])

    return (
        <Box sx={{  }}>
        <div ref={usersTableContainer} style={{
            marginLeft: '20px',
            marginRight: '20px',
            marginTop: '20px',
        }} className="duties-table">
            {
                rows.length ? <GenericTable pageSize={5} items={rows} columns={columns} /> : <center style={{ color: "white", fontWeight: "700px" }}><CircularProgress /></center>
            }
        </div>
        </Box>
    )
}

export default MyConstraintsTable
