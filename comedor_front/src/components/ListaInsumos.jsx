import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons"

const ListaInsumos = ({insumos, unidades_de_medida, onClickChangeStateInsumo}) => {
    return <>
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">Codigo</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Marca</th>
                        <th scope="col">Unidad de medida</th>
                        <th scope="col" className="text-center">Editar</th>
                        <th scope="col" className="text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {insumos.map(i =>
                        <tr key={i.id}>
                            <td>{i.codigo}</td>
                            <td>{i.producto}</td>
                            <td>{i.marca}</td>
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
export default ListaInsumos;