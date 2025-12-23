import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBox, FaTruck, FaChevronDown, FaChevronRight, FaDollarSign, FaFlask, FaHamburger, FaArrowAltCircleDown, FaArrowRight } from "react-icons/fa";
import { AuthContext } from "../services/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faKey } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";

const Sidebar = ({ onToggle }) => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const [isOpen, setIsOpen] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [])

    const handleToggle = () => {
        setIsOpen(!isOpen);
        onToggle(!isOpen);
    }

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const handleBtnCerrarSesion = async () => {
        const res = await Swal.fire({ title: "Seguro desea cerrar sesión?", showCancelButton: true, confirmButtonText: "Sí" });
        if (!res.isConfirmed) {
            return;
        }
        try {
            localStorage.removeItem("token");
            await axios.post("http://localhost:6970/usuario/auth/logout", null, { withCredentials: true }); //Borramos el refresh_token del httpOnly
            setUser(null);
            navigate("/login");
            await Swal.fire({ title: "Sesión cerrada", timer: 1200 });
        } catch (err) {
            console.log(err);
            await Swal.fire({ icon: "error", title: "Error al cerrar sesión" });
        }
    }

    return (
        <div className="d-flex flex-column bg-dark text-white p-3 min-vh-100" style={{ width: isOpen ? "260px" : "70px", transition: "0.3s", position: "fixed", top: 0, left: 0, height: "100vh", overflowY: "auto", overflowX: "hidden", zIndex: 1000 }}>
            {/* Toggle sidebar */}
            <button className="btn btn-sm btn-outline-light mb-3 w-100" onClick={handleToggle}>
                {isOpen ? "<<" : ">>"}
            </button>

            {/* Logo */}
            {isOpen && <h4 className="text-center mb-4">Comedor</h4>}

            {user && (
                <div className={`d-flex align-items-center p-2 rounded mb-4 shadow-sm ${isOpen ? "bg-secondary" : "bg-transparent"}`} style={{ transition: "0.3s", border: isOpen ? "1px solid rgba(255,255,255,0.15)" : "none", }}>
                    <div className="bg-light text-dark rounded-circle d-flex justify-content-center align-items-center" style={{ width: isOpen ? "40px" : "20px", height: isOpen ? "40px" : "20px", fontSize: isOpen ? "1.1rem" : "1rem", fontWeight: "bold", transition: "0.3s", }}>
                        {user.nombre?.charAt(0).toUpperCase()}
                    </div>
                    {isOpen && (
                        <div className="ms-3" style={{ overflow: "hidden" }}>
                            <div className="fw-semibold text-white text-truncate">{user.nombre}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Menús */}
            <div>
                {/* Usuarios */}
                {user?.roles.includes(1) && //SOLO ADMINS
                    <div>
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
                                    <NavLink to="/usuario/listado" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                        Lista
                                    </NavLink>
                                </li>
                                <li className="mb-1">
                                    <NavLink to="/usuario/registrar" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                        Registrar
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                }

                {/* Insumos */}
                <div>
                    <button className="btn w-100 text-start text-white d-flex align-items-center justify-content-between mb-1" onClick={() => toggleMenu("insumos")}>
                        <div className="d-flex align-items-center">
                            <FaBox className="me-2" />
                            {isOpen && <span className="text-truncate">Insumos</span>}
                        </div>
                        {isOpen && (openMenu === "insumos" ? <FaChevronDown /> : <FaChevronRight />)}
                    </button>
                    {openMenu === "insumos" && isOpen && (
                        <ul className="list-unstyled ms-3">
                            {user?.roles.some(r => [1, 2].includes(r)) &&
                                <li className="mb-1">
                                    <NavLink to="/insumos/nuevo" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                        Registrar
                                    </NavLink>
                                </li>
                            }
                            <NavLink to="/insumos/listado" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                Listado
                            </NavLink>
                            {user?.roles.some(r => [1, 4].includes(r)) && //SOLO ADMIN Y COMPRADOR
                                <>
                                    <li className="mb-1">
                                        <NavLink to="/insumos/nueva_compra" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                            Comprar
                                        </NavLink>
                                    </li>
                                    <li className="mb-1">
                                        <NavLink to="/insumos/compras" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                            Compras
                                        </NavLink>
                                    </li>
                                    <li className="mb-1">
                                        <NavLink to="/insumos/calculadora_compras" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                            Calculadora
                                        </NavLink>
                                    </li>
                                </>
                            }
                        </ul>)}
                </div>
                {/* Recetas */}
                {user?.roles.some(r => [1, 2].includes(r)) && // SOLO ADMIN Y COCINA
                    <div>
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
                                    <NavLink to="/recetas/listado" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                        Listado
                                    </NavLink>
                                </li>
                                <li className="mb-1">
                                    <NavLink to="/recetas/nueva" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                        Nueva
                                    </NavLink>
                                </li>
                            </ul>)}
                    </div>}

                {/* Proveedores */}
                {user?.roles.includes(1) && //SOLO ADMIN
                    <div>
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
                                    <NavLink to="/proveedores/listado" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                        Lista
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/proveedores/registrar" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                        Registrar
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>}
                {/* Producción */}
                {user?.roles.some(r => [1, 2].includes(r)) // SOLO ADMIN Y COCINA
                    && <div>
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
                                    <NavLink to="/produccion/listado" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                        Lista
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/produccion/registrar" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                        Registrar
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>}
                {/* Precios */}
                {user?.roles.includes(1) && <div>
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
                                <NavLink to="/precios/listado" className={({ isActive }) => `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-light text-dark fw-semibold" : "text-white"}`}>
                                    Listado
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </div>}
            </div>
            {user && (<>
                <NavLink to={"/usuario/pass"} className={`d-flex text-decoration-none align-items-center rounded mb-3 my-3 px-3 py-2  ${isOpen ? "bg-primary-subtle" : "bg-primary-subtle justify-content-center"}`} style={{ transition: "0.3s", cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", }}>
                    <div className="rounded-circle d-flex justify-content-center align-items-center" style={{ width: "20px", height: "20px", minWidth: "20px", fontSize: "1rem", fontWeight: "bold", }}>
                        <FontAwesomeIcon icon={faKey} className="text-primary" />
                    </div>
                    {isOpen && (
                        <span className="ms-3 fw-semibold text-truncate" style={{ color: "#0d6efd" }}>
                            Contraseña
                        </span>
                    )}
                </NavLink>
                <button className={`d-flex align-items-center rounded mt-auto px-3 py-2 w-100 ${isOpen ? "bg-danger-subtle" : "bg-danger-subtle justify-content-center"}`} style={{ transition: "0.3s", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", }} onClick={handleBtnCerrarSesion}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-danger" />
                    {isOpen && (
                        <span className="ms-3 fw-semibold text-danger text-truncate">
                            Cerrar sesión
                        </span>
                    )}
                </button>
            </>
            )}
        </div>
    );
};


export default Sidebar;