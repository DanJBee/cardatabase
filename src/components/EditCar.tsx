import { Car, CarEntry, CarResponse } from "../types/Types";
import { ChangeEvent, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CarDialogContent from "./CarDialogContent";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { updateCar } from "../api/carapi";

type FormProps = {
  cardata: CarResponse;
};

const queryClient = new QueryClient();

function EditCar({ cardata }: FormProps) {
  const [open, setOpen] = useState(false);
  const [car, setCar] = useState<Car>({
    brand: "",
    model: "",
    colour: "",
    registrationNumber: "",
    modelYear: 0,
    price: 0,
  });

  const { mutate } = useMutation({
    mutationFn: updateCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCar({
      ...car,
      [event.target.name]: event.target.value,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setCar({
      brand: cardata.brand,
      model: cardata.model,
      colour: cardata.colour,
      registrationNumber: cardata.registrationNumber,
      modelYear: cardata.modelYear,
      price: cardata.price,
    });

    setOpen(true);
  };

  const handleSave = () => {
    const url = cardata._links.self.href;
    const carEntry: CarEntry = { car, url };
    mutate(carEntry);

    setCar({
      brand: "",
      model: "",
      colour: "",
      registrationNumber: "",
      modelYear: 0,
      price: 0,
    });
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Edit Car">
        <IconButton aria-label="small" size="small" onClick={handleOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Car</DialogTitle>
        <CarDialogContent car={car} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditCar;
