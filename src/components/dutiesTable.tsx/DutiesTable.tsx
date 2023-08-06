import { useEffect, useRef, useState } from "react"
import GenericTable from "../genericTable/GenericTable"
import Potential from "../../../Potential.json"
import { GridColDef, GridValidRowModel, GridValueGetterParams } from "@mui/x-data-grid";

const rows: GridValidRowModel[] = [
    {
        ShiftType: {
            name: "שער ירושלים",
            pointValue: 12,
            population: "veteran"
        },
        Executor: {
            name: "John",
            soldierId: 1,
            population: "veteran"
        },
        Substitute: {
            name: "Tim",
            soldierId: 2,
            population: "veteran"
        },
        PointMultiplier: 1,
        startdate: "2023-08-03T20:00:43.006Z",
        enddate: "2023-08-05T12:00:43.006Z",
        id: "737402.8020046807"
    },
    {
        ShiftType: {
            name: "מטוס",
            pointValue: 12,
            population: "veteran"
        },
        Executor: {
            name: "John",
            soldierId: 1,
            population: "veteran"
        },
        Substitute: {
            name: "Tim",
            soldierId: 2,
            population: "veteran"
        },
        PointMultiplier: 1.5,
        startdate: "2023-08-05T20:00:43.006Z",
        enddate: "2023-08-07T12:00:44.006Z",
        id: "255528.66696236288"
    },
    {
        ShiftType: {
            name: "קצין תורן",
            pointValue: 12,
            population: "veteran"
        },
        Executor: {
            name: "John",
            soldierId: 1,
            population: "veteran"
        },
        Substitute: {
            name: "Tim",
            soldierId: 2,
            population: "veteran"
        },
        PointMultiplier: 1,
        startdate: "2023-08-07T20:00:43.006Z",
        enddate: "2023-08-09T12:00:43.006Z",
        id: "120272.26546782322"
    },
    {
        ShiftType: {
            name: "נגד תורן",
            pointValue: 12,
            population: "veteran"
        },
        Executor: {
            name: "John",
            soldierId: 1,
            population: "veteran"
        },
        Substitute: {
            name: "Tim",
            soldierId: 2,
            population: "veteran"
        },
        PointMultiplier: 2,
        startdate: "2023-08-09T20:00:43.006Z",
        enddate: "2023-08-11T12:00:43.006Z",
        id: "78770.31506017662"
    },
    {
        ShiftType: {
            name: "נגד תורן",
            pointValue: 12,
            population: "veteran"
        },
        Executor: {
            name: "John",
            soldierId: 1,
            population: "veteran"
        },
        Substitute: {
            name: "Tim",
            soldierId: 2,
            population: "veteran"
        },
        PointMultiplier: 1,
        startdate: "2023-08-11T20:00:43.006Z",
        enddate: "2023-08-13T12:00:43.006Z",
        id: "898377.6490721735"
    }
]

const dateFormat = (date: Date) => `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`

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
            params.row.enddate ? dateFormat(new Date(params.row.enddate)) : '',
    },
];

const DutiesTable = () => {
    const usersTableContainer = useRef<HTMLDivElement>(null) // Add the type here

    const foo = async () => {
        const response = await fetch("http://localhost:3000/potential");
        const Potentials = await response.json();
        console.log(Potentials);
    }
    foo()

    return (
        <div ref={usersTableContainer} style={{
            marginLeft: '50px',
            marginRight: '50px',
            marginTop: '50px',
        }} className="duties-table">
            <GenericTable items={rows} columns={columns} />
        </div>
    )
}

export default DutiesTable
