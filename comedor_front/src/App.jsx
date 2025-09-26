import {Route, Routes} from "react-router-dom"; 
import Home from "./pages/Home";
import "./css/App.css";
import NavBar from "./components/NavBar";
import RegisterUser from "./pages/RegisterUser";
import UpdateUser from "./pages/UpdateUser";
import Users from "./pages/Users";

function App() {
  return (
    <>
      <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />}>Home</Route>
            
            //Usuarios
            <Route path="/usuario/registro" element={<RegisterUser/>}>Registrar</Route>
            <Route path="/usuario/editar/:dni" element={<UpdateUser/>}>Editar</Route>
            <Route path="/usuario" element={<Users/>}>Usuarios</Route>
          </Routes>
        </main>
    </>
  )
}

export default App
