const ListaUsuarios = ({usuarios}) => {
    return <>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">DNI</th>
                    <th scope="col">CUIL</th>
                    <th scope="col">Teléfono</th>
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
                    </tr>
                )}
            </tbody>
        </table>
    </> 
    ;
}

export default ListaUsuarios;