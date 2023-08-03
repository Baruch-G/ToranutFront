import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DutiesTable from './components/DutiesTable';
import NavBar from './components/navbar/NavBar';

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/duties-table" element={<DutiesTable />}>
            <Route index element={<div>עמוד בית</div>} />
            <Route path="*" element={<div>העמוד לא נמצא</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
