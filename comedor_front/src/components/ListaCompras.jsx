const ListaCompras = ({compras}) => {
    return <>
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">Insumo</th>
                        <th scope="col">Proveedor</th>
                        <th scope="col">Precio unitario</th>
                        <th scope="col">Fecha de compra</th>
                        <th scope="col" className="text-center">Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {compras.map(c =>
                        <tr key={c.id}>
                            <td>{c.insumo}</td>
                            <td>{c.producto}</td>
                            <td>{c.marca}</td>
                            <td>{unidades_de_medida.find(udm => udm.id == i.id_unidad_de_medida)?.nombre || "- - -"}</td>
                            <td className="text-center">
                                <Link className="btn btn-warning" to={`/insumos/editar/${i.id}`}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </Link>
                            </td>
                            <td className="text-center">
                                <button onClick={() => onClickChangeStateInsumo(i.id, i.estado)} className={`btn btn-sm ${i.estado === 1 ? 'btn-success' : 'btn-danger'}`}>
                                    {i.estado === 1?"Activo":"Inactivo"}</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </> 

}

export default ListaCompras;