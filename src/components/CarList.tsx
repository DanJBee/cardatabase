import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { deleteCar, getCars } from "../api/carapi";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { useState } from "react";
import { Button, IconButton, Snackbar, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCar from "./EditCar.tsx";
import AddCar from "./AddCar.tsx";

const queryClient = new QueryClient();

type CarListProps = {
  logOut?: () => void;
};

function CarList({ logOut }: CarListProps) {
  const { data, error, isSuccess } = useQuery({
    queryKey: ["cars"],
    queryFn: getCars,
  });

  const columns: GridColDef[] = [
    { field: "brand", headerName: "Brand", width: 200 },
    { field: "model", headerName: "Model", width: 200 },
    { field: "colour", headerName: "Colour", width: 200 },
    {
      field: "registrationNumber",
      headerName: "Registration Number",
      width: 200,
    },
    { field: "modelYear", headerName: "Model Year", width: 200 },
    { field: "price", headerName: "Price", width: 200 },
    {
      field: "edit",
      headerName: "",
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => {
        return <EditCar cardata={params.row} />;
      },
    },
    {
      field: "delete",
      headerName: "",
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => {
            if (
              window.confirm(
                `Are you sure you want to delete ${params.row.brand} ${params.row.model}?`,
              )
            ) {
              mutate(params.row._links.car.href);
            }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      // Car deleted
      setOpen(true);
      queryClient.invalidateQueries({ queryKey: ["cars"] }).then(() => {});
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  if (!isSuccess) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>An error occurred when fetching cars!</p>;
  } else {
    return (
      <>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <AddCar />
          <Button onClick={logOut}>Log out</Button>
        </Stack>
        <DataGrid
          rows={data}
          columns={columns}
          pagination={true}
          disableRowSelectionOnClick={true}
          getRowId={(row) => row._links.self.href}
          slots={{ toolbar: GridToolbar }}
        />
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          message="Car has been successfully deleted!"
        />
      </>
    );
  }
}

export default CarList;
