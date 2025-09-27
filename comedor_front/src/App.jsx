import {Route, Routes} from "react-router-dom"; 
import "./css/App.css";
import RegisterUser from "./pages/RegisterUser";
import UpdateUser from "./pages/UpdateUser";
import Users from "./pages/Users";
import LayoutGeneral from "./layouts/LayoutGeneral";
import LayoutUsers from "./layouts/LayoutUsers";
import LayoutInsumos from "./layouts/LayoutInsumos";
import Insumos from "./pages/Insumos";
import RegisterInsumo from "./pages/RegisterInsumo";
import UpdateInsumo from "./pages/UpdateInsumo";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LayoutGeneral />}>
          {/* Usuarios */}
          <Route path="/usuario" element={<LayoutUsers />}>
            <Route path="listado" element={<Users />}/>
            <Route path="registrar" element={<RegisterUser/>}/>
            <Route path="editar/:dni" element={<UpdateUser/>}/>
          </Route>
          {/* Insumos */}
          <Route path="/insumos" element={<LayoutInsumos />}>
            <Route path="listado" element={<Insumos />} />
            <Route path="nuevo" element={<RegisterInsumo />} />
            <Route path="editar/:id" element={<UpdateInsumo />} />
          </Route>
        </Route>
      </Routes>
  )
}

export default App
