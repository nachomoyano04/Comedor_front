import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaBox, FaTruck, FaChevronDown, FaChevronRight} from "react-icons/fa";

const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div
        className="d-flex flex-column bg-dark text-white p-3 vh-100"
        style={{ width: isOpen ? "260px" : "70px", transition: "0.3s" }}
        >
        {/* Toggle sidebar */}
        <button
            className="btn btn-sm btn-outline-light mb-3 w-100"
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? "<<" : ">>"}
        </button>

        {/* Logo */}
        {isOpen && <h4 className="text-center mb-4">MiApp</h4>}

        {/* Menús */}
        <div>
            {/* Usuarios */}
            <button
            className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1"
            onClick={() => toggleMenu("usuarios")}
            >
            <div className="d-flex align-items-center">
                <FaUser className="me-2" />
                {isOpen && <span className="text-truncate">Usuarios</span>}
            </div>
            {isOpen && (openMenu === "usuarios" ? <FaChevronDown /> : <FaChevronRight />)}
            </button>
            {openMenu === "usuarios" && isOpen && (
            <ul className="list-unstyled ms-3">
                <li>
                <NavLink to="/usuario/listado" className="nav-link text-white ps-4">
                    Lista
                </NavLink>
                </li>
                <li>
                <NavLink to="/usuario/registrar" className="nav-link text-white ps-4">
                    Registrar
                </NavLink>
                </li>
            </ul>
            )}

            {/* Insumos */}
            <button
            className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1"
            onClick={() => toggleMenu("insumos")}
            >
            <div className="d-flex align-items-center">
                <FaBox className="me-2" />
                {isOpen && <span className="text-truncate">Insumos</span>}
            </div>
            {isOpen && (openMenu === "insumos" ? <FaChevronDown /> : <FaChevronRight />)}
            </button>
            {openMenu === "insumos" && isOpen && (
            <ul className="list-unstyled ms-3">
                <li>
                <NavLink to="/insumos/listado" className="nav-link text-white ps-4">
                    Lista
                </NavLink>
                </li>
                <li>
                <NavLink to="/insumos/nuevo" className="nav-link text-white ps-4">
                    Registrar
                </NavLink>
                </li>
            </ul>
            )}

            {/* Proveedores */}
            <button
            className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1"
            onClick={() => toggleMenu("proveedores")}
            >
            <div className="d-flex align-items-center">
                <FaTruck className="me-2" />
                {isOpen && <span className="text-truncate">Proveedores</span>}
            </div>
            {isOpen && (openMenu === "proveedores" ? <FaChevronDown /> : <FaChevronRight />)}
            </button>
            {openMenu === "proveedores" && isOpen && (
            <ul className="list-unstyled ms-3">
                <li>
                <NavLink to="/proveedores/listado" className="nav-link text-white ps-4">
                    Lista
                </NavLink>
                </li>
                <li>
                <NavLink to="/proveedores/nuevo" className="nav-link text-white ps-4">
                    Registrar
                </NavLink>
                </li>
            </ul>
            )}
        </div>
        </div>
    );
};


export default Sidebar;
