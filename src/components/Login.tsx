import { ChangeEvent, useState } from "react";
import axios from "axios";
import CarList from "./CarList.tsx";
import { Button, Snackbar, Stack, TextField } from "@mui/material";

type User = {
  username: string;
  password: string;
};

function Login() {
  const [user, setUser] = useState<User>({
    username: "",
    password: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = () => {
    axios
      .post(import.meta.env.VITE_API_URL + "/login", user, {
        headers: { "Content-Type": "application/json" },
      })
      .then((result) => {
        const jwtToken = result.headers.authorization;

        if (jwtToken != null) {
          sessionStorage.setItem("jwt", jwtToken);
          setIsAuthenticated(true);
        }
      })
      .catch(() => setOpen(true));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.setItem("jwt", "");
  };

  if (isAuthenticated) {
    return <CarList logOut={handleLogout} />;
  } else {
    return (
      <>
        <Stack spacing={2} alignItems="center" mt={2}>
          <TextField name="username" label="Username" onChange={handleChange} />
          <TextField name="password" label="Password" onChange={handleChange} />
          <Button variant="outlined" color="primary" onClick={handleLogin}>
            Login
          </Button>
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            message="Incorrect username or password!"
          ></Snackbar>
        </Stack>
      </>
    );
  }
}

export default Login;
