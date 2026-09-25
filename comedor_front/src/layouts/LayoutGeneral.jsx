import { Outlet, Navigate, useLocation, NavLink } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect, useContext } from "react";
import { FaBars, FaUtensils, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../services/AuthProvider";

const LayoutGeneral = () => {
    const { user, setUser } = useContext(AuthContext);
    const location = useLocation();
    const token = localStorage.getItem("token");

    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Detección de resize de pantalla
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 992;
            setIsMobile(mobile);
            if (!mobile) {
                setMobileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Cerrar drawer móvil al cambiar de ruta
    useEffect(() => {
        if (isMobile) {
            setMobileOpen(false);
        }
    }, [location.pathname, isMobile]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Título dinámico para la barra superior
    const getTituloSeccion = () => {
        const path = location.pathname;
        if (path === "/") return "Tablero Principal";
        if (path.startsWith("/insumos")) return "Gestión de Insumos";
        if (path.startsWith("/recetas")) return "Fichas Técnicas de Recetas";
        if (path.startsWith("/produccion/registrar")) return "Pantalla de Cocina";
        if (path.startsWith("/produccion")) return "Registro de Producción";
        if (path.startsWith("/precios")) return "Precios y Costos";
        if (path.startsWith("/proveedores")) return "Gestión de Proveedores";
        if (path.startsWith("/usuario")) return "Administración de Usuarios";
        return "Comedor Escolar";
    };

    return (
        <div className="app-container">
            {/* Backdrop overlay para drawer móvil */}
            {isMobile && mobileOpen && (
                <div 
                    className="sidebar-backdrop" 
                    onClick={() => setMobileOpen(false)}
                    aria-label="Cerrar menú"
                />
            )}

            {/* Barra lateral */}
            <Sidebar 
                isMobile={isMobile}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
            />

            {/* Contenedor Principal */}
            <div className={`app-content-wrapper ${collapsed ? "sidebar-collapsed" : ""}`}>
                {/* Topbar Header */}
                <header className="app-topbar">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            type="button"
                            className="btn btn-light text-dark p-2 rounded-3 border d-flex align-items-center justify-content-center shadow-xs"
                            onClick={() => {
                                if (isMobile) {
                                    setMobileOpen(!mobileOpen);
                                } else {
                                    setCollapsed(!collapsed);
                                }
                            }}
                            title="Alternar barra lateral"
                            aria-label="Alternar navegación"
                            style={{ width: "40px", height: "40px" }}
                        >
                            <FaBars size={18} />
                        </button>

                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold fs-5 text-dark tracking-tight d-none d-sm-inline">
                                {getTituloSeccion()}
                            </span>
                            <span className="fw-bold fs-6 text-dark tracking-tight d-inline d-sm-none">
                                {getTituloSeccion()}
                            </span>
                        </div>
                    </div>

                    {/* Lado derecho del topbar */}
                    <div className="d-flex align-items-center gap-2">
                        {user && (
                            <NavLink to="/usuario/perfil" className="text-decoration-none d-flex align-items-center gap-2 p-1 px-2 rounded-pill bg-light border text-dark">
                                <div 
                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                    style={{ width: "28px", height: "28px", fontSize: "0.85rem" }}
                                >
                                    {user.nombre?.charAt(0).toUpperCase()}
                                </div>
                                <span className="fw-semibold text-truncate d-none d-md-inline" style={{ maxWidth: "120px", fontSize: "0.875rem" }}>
                                    {user.nombre}
                                </span>
                            </NavLink>
                        )}
                    </div>
                </header>

                {/* Contenido de la Página */}
                <main className="app-page-body">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LayoutGeneral;