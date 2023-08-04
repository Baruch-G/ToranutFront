import React, { useState, useEffect } from 'react';
import { Table, ButtonToolbar, Button } from 'rsuite';
import { SortType } from 'rsuite/esm/Table';
import "./GenericTable.css"

// Define the type for the column object
interface TableColumn {
    key: string;
    label: string;
    width?: number;
    [key: string]: any;
}

// Define the type for the row object
interface TableRow {
    [key: string]: any;
}

// Define the type for the GenericTable props
interface GenericTableProps {
    defaultColumns: TableColumn[];
    divWidth: number;
    rows: TableRow[];
}

const GenericTable: React.FC<GenericTableProps> = (props) => {
    const [sortColumn, setSortColumn] = useState<string>();
    const [sortType, setSortType] = useState<SortType>("asc");
    const [showAll, setShowAll] = useState<boolean>(false);
    const [minimumDisplayCol, setMinimumDisplayCol] = useState<number>(6);

    const [rows, setRows] = useState<TableRow[]>(props.rows)

    const defaultColumns: TableColumn[] = props.defaultColumns;

    
    
    defaultColumns.forEach((element) => {
        element.width = props.divWidth / defaultColumns.length;
    });
    
    console.log(defaultColumns);
    
    const handleSortColumn = (dataKey: string, sortType?: SortType) => {
        setSortColumn(dataKey);        
        setSortType(sortType!);

        if (dataKey && sortType) {
            const newRows = rows.sort((a, b) => {
                let x = a[dataKey];
                let y = b[dataKey];

                if (typeof x === 'string') {
                    x = x.charCodeAt(0);
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt(0);
                }

                if (sortType === 'asc') {
                    return x - y;
                } else {
                    return y - x;
                }
            });
            setRows(newRows)
        }

    };

    return (
        <div style={{ direction: 'rtl' }}>
            <div
                style={{
                    backgroundColor: 'white',
                }}
            >
                <Table
                    data={rows}
                    sortColumn={sortColumn}
                    sortType={sortType}
                    autoHeight
                    style={{
                        backgroundColor: '#f5f5f5',
                    }}
                    onSortColumn={handleSortColumn}
                    onRowClick={(row) => { }}
                >
                    {defaultColumns
                        ? defaultColumns.slice().reverse().map((column) => {
                            const { key, label, ...rest } = column;
                            return (
                                <Table.Column {...rest} key={key}>
                                    <Table.HeaderCell>{label}</Table.HeaderCell>
                                    <Table.Cell dataKey={key} />
                                </Table.Column>
                            );
                        })
                        : null}
                </Table>
            </div>

            {props.rows.length > minimumDisplayCol && (
                <ButtonToolbar onClick={() => setShowAll(!showAll)} style={{ marginTop: 10 }}>
                    <Button>{showAll ? 'הצג פחות' : 'הצג הכול'}</Button>
                </ButtonToolbar>
            )}
        </div>
    );
};

export default GenericTable;