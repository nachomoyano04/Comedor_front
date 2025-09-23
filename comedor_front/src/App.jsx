import {Route, Routes} from "react-router-dom"; 
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import RegisterUser from "./pages/RegisterUser";

function App() {
  return (
    <>
      <NavBar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />}>Home</Route>
            <Route path="/usuario" element={<RegisterUser/>}>Usuario</Route>
          </Routes>
        </main>
    </>
  )
}

export default App
