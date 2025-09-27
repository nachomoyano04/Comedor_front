const ListaInsumos = ({insumos}) => {
    return <>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Codigo</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Unidad de medida</th>
                    <th scope="col">Estado</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {insumos.map(i =>
                    <tr key={i.id}>
                        <td>{i.codigo}</td>
                        <td>{i.producto}</td>
                        <td>{i.marca}</td>
                        <td>{i.id_unidad_de_medida}</td>
                        {/* <td>
                            <Link to={`/usuario/editar/${u.dni}`}>
                                {u.nombre} {u.apellido}
                            </Link>
                        </td> */}
                        <td>
                            <button>{i.estado === 1?"Activo":"Inactivo"}</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </> 
    ;
}
export default ListaInsumos;