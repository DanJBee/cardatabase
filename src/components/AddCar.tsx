import { ChangeEvent, useState } from "react";
import { Car } from "../types/Types";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { addCar } from "../api/carapi";
import CarDialogContent from "./CarDialogContent.tsx";

const queryClient = new QueryClient();

function AddCar() {
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
    mutationFn: addCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] }).then(() => {});
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCar({ ...car, [event.target.name]: event.target.value });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    mutate(car);
    setCar({
      brand: "",
      model: "",
      colour: "",
      registrationNumber: "",
      modelYear: 0,
      price: 0,
    });
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen}>New Car</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Car</DialogTitle>
        <CarDialogContent car={car} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddCar;
