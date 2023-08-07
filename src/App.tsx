import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DutiesTable from './components/dutiesTable/DutiesTable';
import NavBar from './components/navbar/NavBar';
import EditPage from './components/editPage/EditPage';
import Login from './components/login/Login';
import ConstraintsTable from './components/constraints/Constraints';

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route index element={<div>עמוד בית</div>} /> 
          <Route path="/duties-table" element={<DutiesTable />}/>
          <Route path="/constraints" element={<ConstraintsTable />}/>
          <Route path="/edit" element={<EditPage />}/>
          <Route path="/login" element={<Login onLogin={() => {}}/>}/>
          <Route path="*" element={<div>העמוד לא נמצא</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
