import { useState, useMemo, useContext } from "react";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { AuthContext } from "../services/AuthProvider";

const ListaProveedores = ({ proveedores, onClickChangeStateProveedor }) => {
    const { user } = useContext(AuthContext);
    const [filtroTexto, setFiltroTexto] = useState("");

    // Buscador en tiempo real
    const proveedoresFiltrados = useMemo(() => {
        if (!filtroTexto) return proveedores;
        const texto = filtroTexto.toLowerCase();
        return proveedores.filter(p => 
            p.razon_social?.toLowerCase().includes(texto) || 
            p.nombre_fantasia?.toLowerCase().includes(texto) || 
            p.cuit?.toLowerCase().includes(texto)
        );
    }, [proveedores, filtroTexto]);

    // Chequeo de lista vacía desde la base de datos
    if (proveedores.length === 0) {
        return (
            <div className="text-center text-danger my-5 fw-semibold fs-5">
                No hay proveedores registrados todavía
            </div>
        );
    }

    // Permisos combinados para Admin(1) y Comprador(4)
    const puedeEditar = user?.roles?.some(r => [1, 4].includes(r));

    return <>
        {/* Buscador responsivo */}
        <div className="my-3 row justify-content-end">
            <div className="col-12 col-md-6 col-lg-4">
                <input 
                    type="text" 
                    className="form-control shadow-sm" 
                    placeholder="Buscar por Razón Social, Fantasía o CUIT..." 
                    value={filtroTexto} 
                    onChange={e => setFiltroTexto(e.target.value)} 
                />
            </div>
        </div>

        <div className="table-responsive shadow-sm rounded">
            <table className="table table-striped table-hover table-sm align-middle mb-0">
            {/* <table className="table table-striped table-hover align-middle mb-0"> */}
                <thead className="table-dark">
                    <tr>
                        <th scope="col" className="text-center">Código</th>
                        <th scope="col" className="text-center">Razón Social</th>
                        <th scope="col" className="text-center">Nombre Fantasía</th>
                        <th scope="col" className="text-center">CUIT</th>
                        <th scope="col" className="text-center">Horarios</th>
                        <th scope="col" className="text-center">Domicilio</th>
                        <th scope="col" className="text-center">Localidad</th>
                        <th scope="col" className="text-center">Email</th>
                        {puedeEditar && <>
                            <th scope="col" className="text-center">Editar</th>
                            <th scope="col" className="text-center">Estado</th>
                        </>}
                    </tr>
                </thead>
                <tbody>
                    {proveedoresFiltrados.length === 0 ? (
                        <tr>
                            <td colSpan={puedeEditar ? "10" : "8"} className="text-center text-danger py-4">
                                No se encontraron coincidencias para tu búsqueda.
                            </td>
                        </tr>
                    ) : (
                        proveedoresFiltrados.map(p =>
                            <tr key={p.id}>
                                <td className="text-center fw-medium">{p.codigo}</td>
                                <td className="text-center">{p.razon_social}</td>
                                <td className="text-center">{p.nombre_fantasia}</td>
                                <td className="text-center text-nowrap">{p.cuit}</td>
                                <td className="text-center small">{p.horarios_atencion}</td>
                                <td className="text-center">{p.domicilio}</td>
                                <td className="text-center">{p.localidad}</td>
                                <td className="text-center text-nowrap">{p.email}</td>
                                {puedeEditar && <>
                                    <td className="text-center">
                                        <Link className="btn btn-warning btn-sm shadow-sm" to={`/proveedores/editar/${p.id}`}>
                                            <FontAwesomeIcon icon={faPencil} />
                                        </Link>
                                    </td>
                                    <td className="text-center">
                                        <button onClick={() => onClickChangeStateProveedor(p.id, p.estado)}
                                            className={`btn btn-sm shadow-sm text-white ${p.estado === 1 ? 'btn-success' : 'btn-danger'}`}>
                                            {p.estado === 1 ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                </>}
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    </>;
}

export default ListaProveedores;