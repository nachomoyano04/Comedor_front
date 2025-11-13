import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { parsearHoraDateTime } from "../services/globalFunctions";

const ListaCompras = ({ insumos, compras, onClickDeleteCompra, onChangeInsumo }) => {
    return <>
        <div className="my-2 d-flex justify-content-end">
            <div className="w-50">
                <Select options={insumos} onChange={e => onChangeInsumo(e)} />
            </div>
        </div>
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th scope="col" className="text-center">Insumo</th>
                        <th scope="col" className="text-center">Proveedor</th>
                        <th scope="col" className="text-center">Unitario</th>
                        <th scope="col" className="text-center">Total</th>
                        <th scope="col" className="text-center">Fecha de compra</th>
                        <th scope="col" className="text-center">Cantidad</th>
                        <th scope="col" className="text-center">Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {compras.length == 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-danger">
                                No hay compras todavía
                            </td>
                        </tr>
                    ) :
                    (compras.map(c =>
                        <tr key={c.id}>
                            <td className="text-center">{c.producto}</td>
                            <td className="text-center">{c.razon_social}</td>
                            <td className="text-center">${(parseFloat(c.precio_unitario)).toFixed(2)}</td>
                            <td className="text-center">${((parseFloat(c.precio_unitario) * parseFloat(c.cantidad)).toFixed(2))}</td>
                            <td className="text-center">{parsearHoraDateTime(c.fecha_desde)}</td>
                            <td className="text-center">{c.cantidad}</td>
                            <td className="text-center">
                                <button className="btn" onClick={() => onClickDeleteCompra(c.id)}>
                                    <FontAwesomeIcon icon={faTrash} style={{ color: "#f40101" }} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>

}

export default ListaCompras;