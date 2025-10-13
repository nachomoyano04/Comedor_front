const ListaPreciosInsumo = ({historial}) => {
    return <>
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th scope="col" className="text-center">Proveedor</th>
                        <th scope="col" className="text-center">Precio unitario</th>
                        <th scope="col" className="text-center">Fecha desde</th>
                        <th scope="col" className="text-center">Fecha hasta</th>
                    </tr>
                </thead>
                <tbody>
                    {historial.length == 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-danger">
                                No hay precios todavía
                            </td>
                        </tr>
                    ) : 
                    (historial.map(h =>
                        <tr key={h.id}>
                            <td className="text-center">{h.razon_social}</td>
                            <td className="text-center">${h.precio_unitario}</td>
                            <td className="text-center">{new Date(h.fecha_desde).toLocaleString()}</td>
                            <td className="text-center">{h.fecha_hasta?new Date(h.fecha_hasta).toLocaleString():"actualidad"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </> 
}

export default ListaPreciosInsumo;