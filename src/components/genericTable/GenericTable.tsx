import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridRowSelectionModel,
  GridValidRowModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import "./GenericTable.css";
import { useState } from "react";

interface GenericTableItems {
  items: GridValidRowModel[];
  columns: GridColDef[];
  checkboxSelection?: boolean;
  pageSize?: number;
  footer?: boolean;
  rowSelected?: (row: GridValidRowModel) => void;
  height?: number;
}

const GenericTable = (props: GenericTableItems) => {
  const onRowsSelectionHandler = (ids: GridRowSelectionModel) => {

    if (props.rowSelected) 
        props.rowSelected(ids.map((id) => props.items.find((item) => item["_id"] === id) as GridValidRowModel));
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        direction: "rtl",
        borderRadius: 7,
      }}
    >
      <DataGrid
        rows={props.items.map((item) => ({ ...item, id: item["_id"] }))}
        columns={props.columns}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: props.pageSize ? props.pageSize : 10,
            },
          },
        }}
        pageSizeOptions={[props.pageSize ? props.pageSize : 10]}
        hideFooter={props.footer ? true : false}
        onRowSelectionModelChange={(ids) =>
          props.checkboxSelection ? onRowsSelectionHandler(ids) : null
        }
        sx={{height: props.height ? props.height : "auto"}}
      />
    </div>
  );
};

export default GenericTable;
