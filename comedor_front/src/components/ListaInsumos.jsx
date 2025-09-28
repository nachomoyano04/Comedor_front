import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons"

const ListaInsumos = ({insumos, unidades_de_medida, onClickChangeStateInsumo}) => {
    return <>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Codigo</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Unidad de medida</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Estado</th>
                </tr>
            </thead>
            <tbody>
                {insumos.map(i =>
                    <tr key={i.id}>
                        <td>{i.codigo}</td>
                        <td>{i.producto}</td>
                        <td>{i.marca}</td>
                        <td>{unidades_de_medida.find(udm => udm.id == i.id_unidad_de_medida)?.nombre || "- - -"}</td>
                        <td>
                            <Link className="btn btn-warning" to={`/insumos/editar/${i.id}`}>
                                <FontAwesomeIcon icon={faPencil} />
                            </Link>
                        </td>
                        <td>
                            <button onClick={() => onClickChangeStateInsumo(i.id, i.estado)}>{i.estado === 1?"Activo":"Inactivo"}</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </> 
}
export default ListaInsumos;