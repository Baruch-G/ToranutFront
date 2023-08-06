import { useEffect, useRef, useState } from "react"
import GenericTable from "../genericTable/GenericTable"
import { GridColDef, GridValidRowModel, GridValueGetterParams } from "@mui/x-data-grid";
import { Potential } from "../../models/Shifts";

const dateFormat = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

const columns: GridColDef[] = [
    {
        field: 'ShiftType', headerName: 'סוג תורנות', width: 130, valueGetter: (params: GridValueGetterParams) =>
            params.row.ShiftType ? params.row.ShiftType.name : '',
    },
    {
        field: 'Executor', headerName: 'מבצע', width: 130, valueGetter: (params: GridValueGetterParams) =>
            params.row.Executor ? params.row.Executor.name : '',
    },
    {
        field: 'Substitute', headerName: 'עתודה', width: 130, valueGetter: (params: GridValueGetterParams) =>
            params.row.Substitute ? params.row.Substitute.name : '',
    },
    {
        field: 'startdate', headerName: 'תאריך התחלה', width: 130, valueGetter: (params: GridValueGetterParams) =>
            params.row.startdate ? dateFormat(new Date(params.row.startdate)) : '',
    },
    {
        field: 'enddate', headerName: 'תאריך סיום', width: 130, valueGetter: (params: GridValueGetterParams) =>
            params.row.enddate ? dateFormat(new Date(params.row.enddate)) : ''
    },
];

const DutiesTable = () => {
    const usersTableContainer = useRef<HTMLDivElement>(null) // Add the type here

    const [rows, setRows] = useState<Potential[]>([])


    useEffect(() => {
        const getPotentials = async () => {
            const response = await fetch("http://localhost:3000/potential");
            const potentials: Potential[] = await response.json();
            setRows(potentials)
        }
        getPotentials()
    }, [])

    return (
        <div ref={usersTableContainer} style={{
            marginLeft: '50px',
            marginRight: '50px',
            marginTop: '50px',
        }} className="duties-table">
            {
                rows.length ? <GenericTable items={rows[0].shifts} columns={columns} /> : <center style={{ color: "white", fontWeight: "700px" }}>Loading...</center>
            }
        </div>
    )
}

export default DutiesTable
