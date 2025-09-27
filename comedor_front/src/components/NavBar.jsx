import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <NavLink to={"/insumos"} className={"navbar-brand"}>Comedor</NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Inicio</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Usuario
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <NavLink to={"/usuario/listado"} className="dropdown-item">Lista</NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/usuario/registrar"} className="dropdown-item">Registrar</NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Insumos
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <NavLink to={"/insumos/listado"} className="dropdown-item">Listado</NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/insumos/nuevo"} className="dropdown-item">Nuevo</NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Proveedor
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="/usuario">Registrar</a></li>
                                <li><a className="dropdown-item" href="#">Buscar</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Produccion
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="/usuario">Registrar</a></li>
                                <li><a className="dropdown-item" href="#">Buscar</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Receta
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="/usuario">Registrar</a></li>
                                <li><a className="dropdown-item" href="#">Buscar</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;