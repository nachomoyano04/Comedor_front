import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const ListaProveedores = ({proveedores, onClickChangeStateProveedor}) => {
    return <>
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">Codigo</th>
                        <th scope="col">Razón Social</th>
                        <th scope="col">Nombre Fantasía</th>
                        <th scope="col">CUIT</th>
                        <th scope="col">Horarios</th>
                        <th scope="col">Domicilio</th>
                        <th scope="col">Localidad</th>
                        <th scope="col">Email</th>
                        <th scope="col" className="text-center">Editar</th>
                        <th scope="col" className="text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map(p => 
                        <tr key={p.id}>
                            <td>{p.codigo}</td>
                            <td>{p.razon_social}</td>
                            <td>{p.nombre_fantasia}</td>
                            <td>{p.cuit}</td>
                            <td>{p.horarios_atencion}</td>
                            <td>{p.domicilio}</td>
                            <td>{p.localidad}</td>
                            <td>{p.email}</td>
                            <td className="text-center">
                                <Link className="btn btn-warning" to={`/proveedores/editar/${p.id}`}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </Link>
                            </td>
                            <td className="text-center">
                                <button onClick={() => onClickChangeStateProveedor(p.id, p.estado)}
                                    className={`btn btn-sm ${p.estado === 1 ? 'btn-success' : 'btn-danger'}`}>
                                    {p.estado === 1 ? "Activo" : "Inactivo"}
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
}

export default ListaProveedores;