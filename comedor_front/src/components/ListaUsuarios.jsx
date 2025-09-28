import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons"

const ListaUsuarios = ({usuarios, onClickChangeStateUsuario}) => {
    return <>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">DNI</th>
                    <th scope="col">CUIL</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col">Estado</th>
                    <th scope="col"></th>
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
                        <td>
                            <Link className="btn btn-warning" to={`/usuario/editar/${u.dni}`}>
                                <FontAwesomeIcon icon={faPencil} />
                            </Link>
                        </td>
                        <td>
                            <button onClick={() => onClickChangeStateUsuario(u.id, u.estado)}>{u.estado === 1?"Activo":"Inactivo"}</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </> 
    ;
}

export default ListaUsuarios;