import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const ListaProveedores = ({proveedores, onClickChangeStateProveedor}) => {
    return <>
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th scope="col" className="text-center">Codigo</th>
                        <th scope="col" className="text-center">Razón Social</th>
                        <th scope="col" className="text-center">Nombre Fantasía</th>
                        <th scope="col" className="text-center">CUIT</th>
                        <th scope="col" className="text-center">Horarios</th>
                        <th scope="col" className="text-center">Domicilio</th>
                        <th scope="col" className="text-center">Localidad</th>
                        <th scope="col" className="text-center">Email</th>
                        <th scope="col" className="text-center">Editar</th>
                        <th scope="col" className="text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map(p => 
                        <tr key={p.id}>
                            <td className="text-center">{p.codigo}</td>
                            <td className="text-center">{p.razon_social}</td>
                            <td className="text-center">{p.nombre_fantasia}</td>
                            <td className="text-center">{p.cuit}</td>
                            <td className="text-center">{p.horarios_atencion}</td>
                            <td className="text-center">{p.domicilio}</td>
                            <td className="text-center">{p.localidad}</td>
                            <td className="text-center">{p.email}</td>
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