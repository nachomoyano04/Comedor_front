import { useState, useMemo } from "react";
import { faTrash, faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { parsearFechaDate, parsearHoraDateTime } from "../services/globalFunctions";

const ListaCompras = ({ insumos, compras, onClickDeleteCompra }) => {
    const [filtroInsumo, setFiltroInsumo] = useState(null);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [ordenPrecio, setOrdenPrecio] = useState(null); 

    const comprasFiltradas = useMemo(() => {
        let resultado = [...compras];

        // Filtro por Insumo
        if (filtroInsumo && filtroInsumo.value !== "TODOS") {
            resultado = resultado.filter(c => c.producto === filtroInsumo.label);
        }

        // Filtro Desde (mayor o igual)
        if (fechaInicio) {
            resultado = resultado.filter(c => c.fecha_desde.substring(0, 10) >= fechaInicio);
        }

        // Filtro Hasta (menor o igual)
        if (fechaFin) {
            resultado = resultado.filter(c => c.fecha_desde.substring(0, 10) <= fechaFin);
        }

        // Ordenamiento por Precio Unitario
        if (ordenPrecio === "asc") {
            resultado.sort((a, b) => parseFloat(a.precio_unitario) - parseFloat(b.precio_unitario));
        } else if (ordenPrecio === "desc") {
            resultado.sort((a, b) => parseFloat(b.precio_unitario) - parseFloat(a.precio_unitario));
        }

        return resultado;
    }, [compras, filtroInsumo, fechaInicio, fechaFin, ordenPrecio]);

    const toggleOrdenPrecio = () => {
        if (!ordenPrecio) setOrdenPrecio("asc");
        else if (ordenPrecio === "asc") setOrdenPrecio("desc");
        else setOrdenPrecio(null);
    };

    const opcionesInsumos = [{ value: "TODOS", label: "Ver historial completo" }, ...insumos];

    return <>
        <div className="my-3 row gap-3 justify-content-end align-items-center">
            <div className="col-md-6 d-flex gap-2 align-items-center">
                <span className="fw-semibold text-secondary">Desde</span>
                <input 
                    type="date" 
                    className="form-control" 
                    value={fechaInicio} 
                    onChange={e => setFechaInicio(e.target.value)} 
                />
                <span className="fw-semibold text-secondary ms-2">Hasta</span>
                <input 
                    type="date" 
                    className="form-control" 
                    value={fechaFin} 
                    onChange={e => setFechaFin(e.target.value)} 
                />
            </div>
            <div className="col-md-5">
                <Select 
                    options={opcionesInsumos} 
                    onChange={setFiltroInsumo} 
                    placeholder="Filtrar por insumo..."
                />
            </div>
        </div>
        
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th scope="col" className="text-center">Insumo</th>
                        <th scope="col" className="text-center">Proveedor</th>
                        <th scope="col" className="text-center" style={{cursor: "pointer"}} onClick={toggleOrdenPrecio}>
                            Unitario <FontAwesomeIcon icon={ordenPrecio === 'asc' ? faSortUp : ordenPrecio === 'desc' ? faSortDown : faSort} />
                        </th>
                        <th scope="col" className="text-center">Total</th>
                        <th scope="col" className="text-center">Fecha de compra</th>
                        <th scope="col" className="text-center">Cantidad</th>
                        <th scope="col" className="text-center">Vencimiento</th>
                        <th scope="col" className="text-center">Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {comprasFiltradas.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center text-danger">No se encontraron compras</td>
                        </tr>
                    ) : (
                        comprasFiltradas.map(c => (
                            <tr key={c.id}>
                                <td className="text-center">{c.producto}</td>
                                <td className="text-center">{c.razon_social}</td>
                                <td className="text-center">${parseFloat(c.precio_unitario).toFixed(2)}</td>
                                <td className="text-center">${(parseFloat(c.precio_unitario) * parseFloat(c.cantidad)).toFixed(2)}</td>
                                <td className="text-center">{parsearHoraDateTime(c.fecha_desde)}</td>
                                <td className="text-center">{c.cantidad}</td>
                                <td className="text-center">{c.fecha_vencimiento ? parsearFechaDate(c.fecha_vencimiento) : "---"}</td>
                                <td className="text-center">
                                    <button className="btn" onClick={() => onClickDeleteCompra(c.id)}>
                                        <FontAwesomeIcon icon={faTrash} style={{ color: "#f40101" }} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </>;
};

export default ListaCompras;