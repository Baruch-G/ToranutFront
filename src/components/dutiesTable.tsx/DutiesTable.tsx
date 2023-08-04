import { useEffect, useRef, useState } from "react"
import GenericTable from "../genericTable/GenericTable"
import Potential from "../../../Potential.json"

const defaultColumns = [
    {
        key: 'ShiftType.name',
        label: 'סוג תורנות',
        width: 240,
        resizable: true,
        sortable: true,
    },
    {
        key: 'PointMultiplier',
        label: 'מקדם תורנות',
        width: 240,
        resizable: true,
        sortable: true,
    },
    {
        key: 'startdate',
        label: 'תאריך התחלה',
        width: 250,
        resizable: true,
        sortable: true,
    },
    {
        key: 'enddate',
        label: 'תאריך סיום',
        width: 250,
        resizable: true,
        sortable: true,
    }
]

const shifts = Potential.shifts

const DutiesTable = () => {
    const [tableConwidth, setTableConWidth] = useState(0)
    const usersTableContainer = useRef<HTMLDivElement>(null) // Add the type here

    useEffect(() => {
        if (usersTableContainer.current) {
            setTableConWidth(usersTableContainer.current.offsetWidth);
        }
    }, []);

    return (
        <div ref={usersTableContainer} style={{
            marginLeft: '50px',
            marginRight: '50px',
            marginTop: '50px',
        }} className="duties-table">
            <GenericTable divWidth={tableConwidth} rows={shifts} defaultColumns={defaultColumns} />
        </div>
    )
}

export default DutiesTable
