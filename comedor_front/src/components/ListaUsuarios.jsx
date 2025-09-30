import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons"

const ListaUsuarios = ({usuarios, onClickChangeStateUsuario}) => {
    return <>
        <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">DNI</th>
                    <th scope="col">CUIL</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col" className="text-center">Editar</th>
                    <th scope="col" className="text-center">Estado</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.map(u => 
                    <tr key={u.id}>
                        <td>{u.nombre}</td>
                        <td>{u.apellido}</td>
                        <td>{u.dni}</td>
                        <td>{u.cuil}</td>
                        <td>{u.telefono}</td>
                        <td className="text-center">
                            <Link className="btn btn-warning" to={`/usuario/editar/${u.dni}`}>
                                <FontAwesomeIcon icon={faPencil} />
                            </Link>
                        </td>
                        <td className="text-center">
                            <button onClick={() => onClickChangeStateUsuario(u.id, u.estado)}
                                className={`btn btn-sm ${u.estado === 1 ? 'btn-success' : 'btn-danger'}`}>
                                {u.estado === 1 ? "Activo" : "Inactivo"}
                            </button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </> 
    ;
}

export default ListaUsuarios;