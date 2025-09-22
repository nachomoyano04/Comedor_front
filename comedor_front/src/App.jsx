import {Route, Routes} from "react-router-dom"; 
import Home from "./pages/Home";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />}>Home</Route>
          </Routes>
        </main>
    </>
  )
}

export default App
