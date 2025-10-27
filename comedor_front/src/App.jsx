import {Route, Routes} from "react-router-dom"; 
import "./css/App.css";
import RegisterUser from "./pages/RegisterUser";
import UpdateUser from "./pages/UpdateUser";
import Users from "./pages/Users";
import LayoutGeneral from "./layouts/LayoutGeneral";
import LayoutUsers from "./layouts/LayoutUsers";
import LayoutInsumos from "./layouts/LayoutInsumos";
import Insumos from "./pages/Insumos";
import Compras from "./pages/Compras";
import RegisterInsumo from "./pages/RegisterInsumo";
import UpdateInsumo from "./pages/UpdateInsumo";
import LayoutProveedores from "./layouts/LayoutProveedores";
import Proveedores from "./pages/Proveedores";
import RegisterProve from "./pages/RegisterProve";
import UpdateProve from "./pages/UpdateProve";
import RegisterCompra from "./pages/RegisterCompra";
import LayoutPrecios from "./layouts/LayoutPrecios";
import Precios from "./pages/Precios";
import LayoutRecetas from "./layouts/LayoutRecetas";
import RegisterReceta from "./pages/RegisterReceta";
import Recetas from "./pages/Recetas";
import UpdateReceta from "./pages/UpdateReceta";
import LayoutProducciones from "./layouts/LayoutProduccion";
import Producciones from "./pages/Producciones";
import RegisterProduccion from "./pages/RegisterProduccion";
import UpdateProduccion from "./pages/UpdateProduccion";

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
            <Route path="nueva_compra" element={<RegisterCompra />} />
            <Route path="compras" element={<Compras />} />
          </Route>
          {/* Recetas */}
          <Route path="/recetas" element={<LayoutRecetas />}>
            <Route path="listado" element={<Recetas />} />
            <Route path="nueva" element={<RegisterReceta />} />
            <Route path="editar/:id" element={<UpdateReceta />} />
          </Route>
          {/* Proveedores */}
          <Route path="/proveedores" element={<LayoutProveedores />}>
            <Route path="listado" element={<Proveedores />} />
            <Route path="registrar" element={<RegisterProve />} />
            <Route path="editar/:id" element={<UpdateProve />} />
          </Route>
          {/* Producciones */}
          <Route path="/produccion" element={<LayoutProducciones />}>
            <Route path="listado" element={<Producciones />} />
            <Route path="registrar" element={<RegisterProduccion />} />
            <Route path="editar/:id" element={<UpdateProduccion />} />
          </Route>
          {/* Precios */}
          <Route path="/precios" element={<LayoutPrecios />}>
            <Route path="listado" element={<Precios />} />
            <Route path="listado/:id" element={<Precios />} />
          </Route>
        </Route>
      </Routes>
  )
}

export default App
