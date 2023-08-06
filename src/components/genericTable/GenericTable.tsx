import { DataGrid, GridColDef, GridValidRowModel, GridValueGetterParams } from '@mui/x-data-grid';
import "./GenericTable.css"

interface GenericTableItems {
    items: GridValidRowModel[]
    columns: GridColDef[]
}

const GenericTable = (props: GenericTableItems) => {
    return (
        <div style={{ width: '100%', backgroundColor: "white", direction : "rtl" }}>
            <DataGrid
                rows={props.items.map(item => ({ ...item, id: item["_id"] }))}
                columns={props.columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10]}
                checkboxSelection
            />
        </div>
    );
}

export default GenericTable
