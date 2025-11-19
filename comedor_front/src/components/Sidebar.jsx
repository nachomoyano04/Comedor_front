import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaBox, FaTruck, FaChevronDown, FaChevronRight, FaDollarSign, FaFlask, FaHamburger} from "react-icons/fa";

const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div className="d-flex flex-column bg-dark text-white p-3 min-vh-100" style={{ width: isOpen ? "260px" : "70px", transition: "0.3s" }}>
            {/* Toggle sidebar */}
            <button className="btn btn-sm btn-outline-light mb-3 w-100" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "<<" : ">>"}
            </button>

            {/* Logo */}
            {isOpen && <h4 className="text-center mb-4">Comedor</h4>}

            {/* Menús */}
            <div>
                {/* Usuarios */}
                <button className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1" onClick={() => toggleMenu("usuarios")}>
                    <div className="d-flex align-items-center">
                        <FaUser className="me-2" />
                        {isOpen && <span className="text-truncate">Usuarios</span>}
                    </div>
                    {isOpen && (openMenu === "usuarios" ? <FaChevronDown /> : <FaChevronRight />)}
                </button>
                {openMenu === "usuarios" && isOpen && (
                    <ul className="list-unstyled ms-3">
                        <li className="mb-1">
                            <NavLink to="/usuario/listado" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${
                                isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                Lista
                            </NavLink>
                        </li>
                        <li className="mb-1">
                            <NavLink to="/usuario/registrar" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${
                                isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                Registrar
                            </NavLink>
                        </li>
                    </ul>
                )}

                {/* Insumos */}
                <button className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1" onClick={() => toggleMenu("insumos")}>
                    <div className="d-flex align-items-center">
                        <FaBox className="me-2" />
                        {isOpen && <span className="text-truncate">Insumos</span>}
                    </div>
                    {isOpen && (openMenu === "insumos" ? <FaChevronDown /> : <FaChevronRight />)}
                </button>
                {openMenu === "insumos" && isOpen && (
                <ul className="list-unstyled ms-3">
                    <li className="mb-1">
                        <NavLink to="/insumos/nuevo" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${
                            isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                            Registrar
                        </NavLink>
                    </li>
                    <li className="mb-1">
                        <NavLink to="/insumos/listado" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${
                            isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                            Listado
                        </NavLink>
                    </li>
                    <li className="mb-1">
                        <NavLink to="/insumos/nueva_compra" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${
                            isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                            Comprar
                        </NavLink>
                    </li>
                    <li className="mb-1">
                        <NavLink to="/insumos/compras" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${
                            isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                            Compras
                        </NavLink>
                    </li>
                </ul>)}
                {/* Recetas */}
                <button className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1" onClick={() => toggleMenu("recetas")}>
                    <div className="d-flex align-items-center">
                        <FaFlask className="me-2" />
                        {isOpen && <span className="text-truncate">Recetas</span>}
                    </div>
                    {isOpen && (openMenu === "recetas" ? <FaChevronDown /> : <FaChevronRight />)}
                </button>
                {openMenu === "recetas" && isOpen && (
                <ul className="list-unstyled ms-3">
                    <li className="mb-1">
                        <NavLink to="/recetas/listado" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${
                            isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                            Listado
                        </NavLink>
                    </li>
                    <li className="mb-1">
                        <NavLink to="/recetas/nueva" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${
                            isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                            Nueva
                        </NavLink>
                    </li>
                </ul>)}

                {/* Proveedores */}
                <button
                className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1" onClick={() => toggleMenu("proveedores")}>
                <div className="d-flex align-items-center">
                    <FaTruck className="me-2" />
                    {isOpen && <span className="text-truncate">Proveedores</span>}
                </div>
                {isOpen && (openMenu === "proveedores" ? <FaChevronDown /> : <FaChevronRight />)}
                </button>
                {openMenu === "proveedores" && isOpen && (
                    <ul className="list-unstyled ms-3">
                        <li>
                        <NavLink to="/proveedores/listado" className={({isActive}) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive? "bg-light text-dark fw-semibold": "text-white"}`}>
                            Lista
                        </NavLink>
                        </li>
                        <li>
                        <NavLink to="/proveedores/registrar" className={({isActive}) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive? "bg-light text-dark fw-semibold": "text-white"}`}>
                            Registrar
                        </NavLink>
                        </li>
                    </ul>
                )}
                {/* Producción */}
                <button className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1" onClick={() => toggleMenu("produccion")}>
                    <div className="d-flex align-items-center">
                        <FaHamburger className="me-2" />
                        {isOpen && <span className="text-truncate">Producción</span>}
                    </div>
                    {isOpen && (openMenu === "produccion" ? <FaChevronDown /> : <FaChevronRight />)}
                </button>
                {openMenu === "produccion" && isOpen && (
                    <ul className="list-unstyled ms-3">
                        <li>
                        <NavLink to="/produccion/listado" className={({isActive}) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive? "bg-light text-dark fw-semibold": "text-white"}`}>
                            Lista
                        </NavLink>
                        </li>
                        <li>
                        <NavLink to="/produccion/registrar" className={({isActive}) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive? "bg-light text-dark fw-semibold": "text-white"}`}>
                            Registrar
                        </NavLink>
                        </li>
                    </ul>
                )}
                {/* Precios */}
                <button className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1" onClick={() => toggleMenu("precios")} >
                    <div className="d-flex align-items-center">
                        <FaDollarSign className="me-2" />
                        {isOpen && <span className="text-truncate">Precios</span>}
                    </div>
                    {isOpen && (openMenu === "precios" ? <FaChevronDown /> : <FaChevronRight />)}
                </button>
                {openMenu === "precios" && isOpen && (
                    <ul className="list-unstyled ms-3">
                        <li>
                        <NavLink to="/precios/listado" className={({isActive}) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive? "bg-light text-dark fw-semibold": "text-white"}`}>
                            Listado
                        </NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};


export default Sidebar;