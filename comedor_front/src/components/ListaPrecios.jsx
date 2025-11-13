import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { parsearHoraDateTime } from "../services/globalFunctions";

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
                    {precios.length == 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-danger">
                                No hay precios todavía
                            </td>
                        </tr>
                    ) :
                    (precios.map(p =>
                        <tr key={p.id}>
                            <td className="text-center">{p.codigo}</td>
                            <td className="text-center">{p.producto}</td>
                            <td className="text-center">{p.unidad_de_medida}</td>
                            <td className="text-center">${p.precio_unitario}</td>
                            <td className="text-center">{parsearHoraDateTime(p.fecha_desde)}</td>
                            <td className="text-center">{p.razon_social}</td>
                            <td className="text-center">
                                <Link className="btn btn-warning" to={`/precios/listado/${p.id}`}>
                                    <FontAwesomeIcon icon={faBars} />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </> 
}

export default ListaPrecios;