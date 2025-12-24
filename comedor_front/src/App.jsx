import { Route, Routes } from "react-router-dom";
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
import Login from "./pages/Login";
import CompraCalculator from "./pages/CompraCalculator";
import ChangePass from "./pages/ChangePass";
import { Forbidden } from "./pages/Forbidden";
import { RequireRole } from "./components/RequireRole";
import { ROLES } from "./constants/Roles";
import { PerfilUser } from "./pages/PerfilUser";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={<LayoutGeneral />}>
        {/* Usuarios */}
        <Route path="forbidden" element={<Forbidden />} />
        <Route path="usuario" element={<LayoutUsers />}>
          <Route path="listado" element={<RequireRole allowedRoles={[ROLES.ADMIN]}><Users /></RequireRole>} />
          <Route path="registrar" element={<RequireRole allowedRoles={[ROLES.ADMIN]}><RegisterUser /></RequireRole>} />
          <Route path="editar/:dni" element={<RequireRole allowedRoles={[ROLES.ADMIN]}><UpdateUser /></RequireRole>} />
          <Route path="pass" element={<ChangePass />} />
          <Route path="perfil" element={<PerfilUser />} />
        </Route>
        {/* Insumos */}
        <Route path="insumos" element={<LayoutInsumos />}>
          <Route path="listado" element={<Insumos />} />
          <Route path="nuevo" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COCINA]}><RegisterInsumo /></RequireRole>} />
          <Route path="editar/:id" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COCINA]}><UpdateInsumo /></RequireRole>} />
          <Route path="nueva_compra" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COMPRADOR]}><RegisterCompra /></RequireRole>} />
          <Route path="compras" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COMPRADOR]}><Compras /></RequireRole>} />
          <Route path="calculadora_compras" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COMPRADOR]}><CompraCalculator /></RequireRole>} />
        </Route>
        {/* Recetas */}
        <Route path="recetas" element={<LayoutRecetas />}>
          <Route path="listado" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COCINA]}><Recetas /></RequireRole>} />
          <Route path="nueva" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COCINA]}><RegisterReceta /></RequireRole>} />
          <Route path="editar/:id" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COCINA]}><UpdateReceta /></RequireRole>} />
        </Route>
        {/* Proveedores */}
        <Route path="proveedores" element={<LayoutProveedores />}>
          <Route path="listado" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COMPRADOR]}><Proveedores /></RequireRole>} />
          <Route path="registrar" element={<RequireRole allowedRoles={[ROLES.ADMIN]}><RegisterProve /></RequireRole>} />
          <Route path="editar/:id" element={<RequireRole allowedRoles={[ROLES.ADMIN]}><UpdateProve /></RequireRole>} />
        </Route>
        {/* Producciones */}
        <Route path="produccion" element={<RequireRole allowedRoles={[ROLES.ADMIN, ROLES.COCINA]}><LayoutProducciones /></RequireRole>}>
          <Route path="listado" element={<Producciones />} />
          <Route path="registrar" element={<RegisterProduccion />} />
          <Route path="editar/:id" element={<UpdateProduccion />} />
        </Route>
        {/* Precios */}
        <Route path="precios" element={<LayoutPrecios />}>
          <Route path="listado" element={<Precios />} />
          <Route path="listado/:id" element={<Precios />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
