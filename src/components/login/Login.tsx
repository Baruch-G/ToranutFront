import React, { useState, FormEvent, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

interface LoginProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Login = (props: LoginProps) => {
  const navigate = useNavigate();
  const [values, setValues] = useState<{
    errVisible: boolean;
    userName: string;
  }>({
    errVisible: false,
    userName: "",
  });

  useEffect(() => {
    if (props.isLoggedIn) {
      localStorage.removeItem("SoldierID");
      localStorage.removeItem("SoldierName");
      localStorage.removeItem("SoldierPopulation");
      props.setIsLoggedIn(false);
    }
  }, [props.isLoggedIn]);

  const logIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    userExist(parseInt(values.userName));
  };

  const handleChange =
    (prop: keyof typeof values) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClose = () => {
    setValues({ ...values, errVisible: false });
  };

  const userExist = async (SoldierID: number) => {
    await fetch(`http://localhost:3000/potential/shifts/check/${SoldierID}`)
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        const dataResponse = data === "true";

        if (dataResponse) {
          localStorage.setItem("SoldierID", SoldierID.toString());
          props.setIsLoggedIn(true);
          navigate(`/home-page`);
        } else {
          setValues({ ...values, errVisible: true });
        }
      });
    await fetch(`http://localhost:3000/potential/shifts/name/${SoldierID}`)
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        localStorage.setItem("SoldierName", data);
      });
    await fetch(`http://localhost:3000/population/${SoldierID}`)
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        localStorage.setItem("SoldierPopulation", data);
      });
  };

  return (
    <center>
      <Card style={cardStyle} sx={{ minWidth: 100 }}>
        <form style={gridStyle} onSubmit={logIn}>
          <CardContent>
            <h3>הזן מספר אישי</h3>
            <FormControl
              sx={{
                m: 1,
                width: "50ch",
                direction: "rtl",
                MozAppearance: "textfield",
              }}
              variant="filled"
            >
              <FilledInput
                id="filled-adornment"
                type="number"
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      display: "none",
                    },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
                value={values.userName}
                onChange={handleChange("userName")}
                endAdornment={
                  <InputAdornment position="end">
                    <AccountCircle />
                  </InputAdornment>
                }
              />
            </FormControl>
          </CardContent>
          <Snackbar
            sx={{ direction: "rtl" }}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            open={values.errVisible}
            autoHideDuration={2500}
            onClose={handleClose}
          >
            <Alert
              style={{
                direction: "rtl",
              }}
              icon={<></>}
              variant="filled"
              severity="error"
            >
              המספר האישי הזה לא תקין או לא קיבל תורנות
            </Alert>
          </Snackbar>
          <Button
            style={{ width: 300, backgroundColor: "#292929" }}
            type="submit"
            size="large"
            variant="contained"
            disabled={false}
          >
            התחבר
          </Button>

          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "1fr 0.5fr 1fr",
            }}
          ></div>
        </form>
      </Card>
    </center>
  );
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  justifyItems: "center",
  direction: "rtl",
};

const cardStyle: React.CSSProperties = {
  margin: 200,
  width: 600,
  padding: 10,
  direction: "rtl",
};

export default Login;
