import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const ListaPrecios = ({precios}) => {
    return <>
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th scope="col" className="text-center">Codigo</th>
                        <th scope="col" className="text-center">Producto</th>
                        <th scope="col" className="text-center">Unidad de medida</th>
                        <th scope="col" className="text-center">Precio unitario</th>
                        <th scope="col" className="text-center">Fecha de actualización</th>
                        <th scope="col" className="text-center">Proveedor/es</th>
                        <th scope="col" className="text-center">Historial</th>
                    </tr>
                </thead>
                <tbody>
                    {precios.map(p =>
                        <tr key={p.id}>
                            <td className="text-center">{p.codigo}</td>
                            <td className="text-center">{p.producto}</td>
                            <td className="text-center">{p.unidad_de_medida}</td>
                            <td className="text-center">{p.fecha_desde}</td>
                            <td className="text-center">{p.razon_social}</td>
                            <td className="text-center">
                                {/* <Link className="btn btn-warning" to={`/insumos/editar/${p.id}`}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </Link> */}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </> 
}

export default ListaPrecios;