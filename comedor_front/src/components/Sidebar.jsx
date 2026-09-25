import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
    FaUser, 
    FaBox, 
    FaTruck, 
    FaChevronDown, 
    FaChevronRight, 
    FaDollarSign, 
    FaFlask, 
    FaHamburger, 
    FaChartPie, 
    FaUtensils, 
    FaTimes, 
    FaKey, 
    FaSignOutAlt,
    FaAngleLeft,
    FaAngleRight
} from "react-icons/fa";
import { AuthContext } from "../services/AuthProvider";
import Swal from "sweetalert2";
import axios from "axios";

const Sidebar = ({ isMobile, mobileOpen, onCloseMobile, collapsed, onToggleCollapse }) => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const handleLinkClick = () => {
        if (isMobile && onCloseMobile) {
            onCloseMobile();
        }
    };

    const handleBtnCerrarSesion = async () => {
        const res = await Swal.fire({ 
            title: "¿Cerrar sesión?", 
            text: "¿Estás seguro de que deseas salir del sistema?",
            icon: "question",
            showCancelButton: true, 
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar"
        });
        if (!res.isConfirmed) return;

        try {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            await axios.post(`${import.meta.env.VITE_API_URL}/usuario/auth/logout`, null, { withCredentials: true });
            setUser(null);
            navigate("/login");
            await Swal.fire({ title: "Sesión cerrada", icon: "success", timer: 1200 });
        } catch (err) {
            console.log(err);
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            setUser(null);
            navigate("/login");
        }
    };

    // Obtenemos rol legible
    const getRolTexto = () => {
        if (user?.roles?.includes(1)) return "Administrador";
        if (user?.roles?.includes(3)) return "Directivos";
        if (user?.roles?.includes(2)) return "Cocina";
        if (user?.roles?.includes(4)) return "Comprador";
        return "Usuario";
    };

    const isCollapsedDesktop = !isMobile && collapsed;

    return (
        <aside className={`app-sidebar ${isMobile ? (mobileOpen ? "mobile-open" : "") : (collapsed ? "collapsed" : "")}`}>
            {/* Header del Sidebar */}
            <div className="sidebar-brand justify-content-between">
                <NavLink to="/" onClick={handleLinkClick} className="d-flex align-items-center gap-2 text-decoration-none text-white overflow-hidden">
                    <div className="brand-icon-box">
                        <FaUtensils />
                    </div>
                    {!isCollapsedDesktop && (
                        <div className="d-flex flex-column text-truncate">
                            <span className="brand-title">Comedor</span>
                            <small className="text-secondary" style={{ fontSize: "0.7rem", marginTop: "-3px" }}>Gestión Escolar</small>
                        </div>
                    )}
                </NavLink>

                {isMobile ? (
                    <button 
                        type="button" 
                        onClick={onCloseMobile} 
                        className="btn btn-sm btn-link text-white p-1"
                        aria-label="Cerrar menú"
                    >
                        <FaTimes size={20} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="btn btn-sm btn-dark text-secondary border-0 p-1 d-none d-lg-flex align-items-center justify-content-center"
                        title={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
                        style={{ width: "28px", height: "28px", borderRadius: "6px" }}
                    >
                        {collapsed ? <FaAngleRight size={14} /> : <FaAngleLeft size={14} />}
                    </button>
                )}
            </div>

            {/* Perfil de Usuario */}
            {user && (
                <div className={`p-3 border-bottom border-secondary border-opacity-25 ${isCollapsedDesktop ? "text-center" : ""}`}>
                    <NavLink to="/usuario/perfil" onClick={handleLinkClick} className="text-decoration-none d-flex align-items-center gap-3">
                        <div 
                            className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold shadow-sm flex-shrink-0"
                            style={{ width: "38px", height: "38px", fontSize: "1.05rem" }}
                        >
                            {user.nombre?.charAt(0).toUpperCase()}
                        </div>
                        {!isCollapsedDesktop && (
                            <div className="overflow-hidden">
                                <div className="fw-semibold text-white text-truncate" style={{ fontSize: "0.9rem" }}>
                                    {user.nombre}
                                </div>
                                <span className="badge bg-secondary bg-opacity-50 text-light py-0 px-2 fw-medium" style={{ fontSize: "0.7rem" }}>
                                    {getRolTexto()}
                                </span>
                            </div>
                        )}
                    </NavLink>
                </div>
            )}

            {/* Lista de Navegación */}
            <div className="p-2 flex-grow-1 overflow-y-auto">
                {/* 1. Panel Principal */}
                <NavLink 
                    to="/" 
                    end 
                    onClick={handleLinkClick}
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
                    title="Panel Principal"
                >
                    <span className="nav-icon"><FaChartPie /></span>
                    {!isCollapsedDesktop && <span className="ms-3 text-truncate">Panel Principal</span>}
                </NavLink>

                {/* 2. Insumos */}
                <div>
                    <button 
                        type="button"
                        onClick={() => toggleMenu("insumos")}
                        className="sidebar-nav-item w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center"
                        title="Insumos"
                    >
                        <div className="d-flex align-items-center">
                            <span className="nav-icon"><FaBox /></span>
                            {!isCollapsedDesktop && <span className="ms-3 text-truncate">Insumos</span>}
                        </div>
                        {!isCollapsedDesktop && (openMenu === "insumos" ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
                    </button>
                    {openMenu === "insumos" && !isCollapsedDesktop && (
                        <ul className="submenu-list">
                            <li>
                                <NavLink to="/insumos/listado" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                    Listado de Insumos
                                </NavLink>
                            </li>
                            {user?.roles?.some(r => [1, 2].includes(r)) && (
                                <li>
                                    <NavLink to="/insumos/nuevo" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                        Registrar Insumo
                                    </NavLink>
                                </li>
                            )}
                            {user?.roles?.some(r => [1, 2, 4].includes(r)) && (
                                <>
                                    <li>
                                        <NavLink to="/insumos/nueva_compra" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                            Cargar Compra
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/insumos/compras" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                            Historial de Compras
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/insumos/calculadora_compras" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                            Calculadora
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    )}
                </div>

                {/* 3. Recetas */}
                {user?.roles?.some(r => [1, 2, 3].includes(r)) && (
                    <div>
                        <button 
                            type="button"
                            onClick={() => toggleMenu("recetas")}
                            className="sidebar-nav-item w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center"
                            title="Recetas"
                        >
                            <div className="d-flex align-items-center">
                                <span className="nav-icon"><FaFlask /></span>
                                {!isCollapsedDesktop && <span className="ms-3 text-truncate">Recetas</span>}
                            </div>
                            {!isCollapsedDesktop && (openMenu === "recetas" ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
                        </button>
                        {openMenu === "recetas" && !isCollapsedDesktop && (
                            <ul className="submenu-list">
                                <li>
                                    <NavLink to="/recetas/listado" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                        Fichas Técnicas
                                    </NavLink>
                                </li>
                                {user?.roles?.some(r => [1, 2].includes(r)) && (
                                    <li>
                                        <NavLink to="/recetas/nueva" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                            Nueva Receta
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                )}

                {/* 4. Producción */}
                {user?.roles?.some(r => [1, 2, 3].includes(r)) && (
                    <div>
                        <button 
                            type="button"
                            onClick={() => toggleMenu("produccion")}
                            className="sidebar-nav-item w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center"
                            title="Producción"
                        >
                            <div className="d-flex align-items-center">
                                <span className="nav-icon"><FaHamburger /></span>
                                {!isCollapsedDesktop && <span className="ms-3 text-truncate">Producción</span>}
                            </div>
                            {!isCollapsedDesktop && (openMenu === "produccion" ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
                        </button>
                        {openMenu === "produccion" && !isCollapsedDesktop && (
                            <ul className="submenu-list">
                                <li>
                                    <NavLink to="/produccion/listado" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                        Historial de Producción
                                    </NavLink>
                                </li>
                                {user?.roles?.some(r => [1, 2].includes(r)) && (
                                    <li>
                                        <NavLink to="/produccion/registrar" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                            Pantalla de Cocina
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                )}

                {/* 5. Precios */}
                <div>
                    <button 
                        type="button"
                        onClick={() => toggleMenu("precios")}
                        className="sidebar-nav-item w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center"
                        title="Precios"
                    >
                        <div className="d-flex align-items-center">
                            <span className="nav-icon"><FaDollarSign /></span>
                            {!isCollapsedDesktop && <span className="ms-3 text-truncate">Precios</span>}
                        </div>
                        {!isCollapsedDesktop && (openMenu === "precios" ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
                    </button>
                    {openMenu === "precios" && !isCollapsedDesktop && (
                        <ul className="submenu-list">
                            <li>
                                <NavLink to="/precios/listado" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                    Listado de Precios
                                </NavLink>
                            </li>
                            {user?.roles?.some(r => [1, 2, 4].includes(r)) && (
                                <li>
                                    <NavLink to="/insumos/nueva_compra" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                        Cargar Precio
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                {/* 6. Proveedores */}
                {user?.roles?.some(r => [1, 4].includes(r)) && (
                    <div>
                        <button 
                            type="button"
                            onClick={() => toggleMenu("proveedores")}
                            className="sidebar-nav-item w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center"
                            title="Proveedores"
                        >
                            <div className="d-flex align-items-center">
                                <span className="nav-icon"><FaTruck /></span>
                                {!isCollapsedDesktop && <span className="ms-3 text-truncate">Proveedores</span>}
                            </div>
                            {!isCollapsedDesktop && (openMenu === "proveedores" ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
                        </button>
                        {openMenu === "proveedores" && !isCollapsedDesktop && (
                            <ul className="submenu-list">
                                <li>
                                    <NavLink to="/proveedores/listado" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                        Lista de Proveedores
                                    </NavLink>
                                </li>
                                {user?.roles?.includes(1) && (
                                    <li>
                                        <NavLink to="/proveedores/registrar" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                            Registrar Proveedor
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                )}

                {/* 7. Usuarios (Solo Admin) */}
                {user?.roles?.includes(1) && (
                    <div>
                        <button 
                            type="button"
                            onClick={() => toggleMenu("usuarios")}
                            className="sidebar-nav-item w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center"
                            title="Usuarios"
                        >
                            <div className="d-flex align-items-center">
                                <span className="nav-icon"><FaUser /></span>
                                {!isCollapsedDesktop && <span className="ms-3 text-truncate">Usuarios</span>}
                            </div>
                            {!isCollapsedDesktop && (openMenu === "usuarios" ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
                        </button>
                        {openMenu === "usuarios" && !isCollapsedDesktop && (
                            <ul className="submenu-list">
                                <li>
                                    <NavLink to="/usuario/listado" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                        Lista de Usuarios
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/usuario/registrar" onClick={handleLinkClick} className={({ isActive }) => `submenu-link ${isActive ? "active" : ""}`}>
                                        Registrar Usuario
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Footer de opciones de cuenta */}
            {user && (
                <div className="p-2 border-top border-secondary border-opacity-25 mt-auto">
                    <NavLink 
                        to="/usuario/pass" 
                        onClick={handleLinkClick}
                        className="sidebar-nav-item text-secondary py-2"
                        title="Cambiar Contraseña"
                    >
                        <span className="nav-icon"><FaKey /></span>
                        {!isCollapsedDesktop && <span className="ms-3 text-truncate">Contraseña</span>}
                    </NavLink>
                    <button 
                        type="button"
                        onClick={handleBtnCerrarSesion}
                        className="sidebar-nav-item w-100 border-0 bg-transparent text-danger py-2"
                        title="Cerrar Sesión"
                    >
                        <span className="nav-icon"><FaSignOutAlt /></span>
                        {!isCollapsedDesktop && <span className="ms-3 text-truncate">Cerrar Sesión</span>}
                    </button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;