import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DutiesTable from "./components/dutiesTable/DutiesTable";
import NavBar from "./components/navbar/NavBar";
import EditPage from "./components/editPage/EditPage";
import Login from "./components/login/Login";
import ConstraintsTable from "./components/constraints/Constraints";
import { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomePage from "./components/homePage/HomePage";


function App() {
  const [loggedIn, setloggedIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loggedIn)
      handleOpen();
    if (localStorage.getItem("SoldierID")) {
      setloggedIn(true);
    }
  }, [loggedIn]);

  const handleOpen = () => {
    setLoginSuccess(true);
  };

  const handleClose = () => {
    setLoginSuccess(false);
  };

  return (
    <div>
      <BrowserRouter>
        <NavBar isLoggedIn={loggedIn} />
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/duties-table" element={<DutiesTable />} />
          <Route path="/constraints" element={<ConstraintsTable />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="*" element={<div>העמוד לא נמצא</div>} />
          <Route
            path="/login"
            element={<Login isLoggedIn={loggedIn} setIsLoggedIn={setloggedIn} />}
          />
        </Routes>
      </BrowserRouter>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={loginSuccess}
        autoHideDuration={1500}
        onClose={handleClose}
      >
        {
          <Alert
            variant="filled"
            severity="success"
            icon={<CheckCircleOutlineIcon sx={{ color: "white" }} />}
          >
            התחברת בהצלחה
          </Alert>
        }
      </Snackbar>
    </div>
  );
}

export default App;
