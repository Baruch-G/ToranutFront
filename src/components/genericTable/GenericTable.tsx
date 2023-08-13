import { DataGrid, GridColDef, GridValidRowModel, GridValueGetterParams } from '@mui/x-data-grid';
import "./GenericTable.css"

interface GenericTableItems {
    items: GridValidRowModel[]
    columns: GridColDef[]
    checkboxSelection?: boolean
    pageSize?: number
}

const GenericTable = (props: GenericTableItems) => {
    return (
        <div style={{ width: '100%', backgroundColor: "white", direction : "rtl", borderRadius: 7 }}>
            <DataGrid
                rows={props.items.map(item => ({ ...item, id: item["_id"] }))}
                columns={props.columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: props.pageSize ? props.pageSize : 10 },
                    },
                }}
                pageSizeOptions={[props.pageSize ? props.pageSize : 10]}
                checkboxSelection={props.checkboxSelection}
            />
        </div>
    );
}

export default GenericTable
