import { Link } from "react-router-dom";

const ListaUsuarios = ({usuarios, onClickChangeState}) => {
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
                            <Link to={`/usuario/editar/${u.dni}`}>
                                {u.nombre} {u.apellido}
                                {/* <FontAwesomeIcon icon={byPrefixAndName.fas['pencil']} /> */}
                            </Link>
                        </td>
                        <td>
                            <button onClick={() => onClickChangeState(u.id, u.estado)}>{u.estado === 1?"Activo":"Inactivo"}</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </> 
    ;
}

export default ListaUsuarios;