import { useState, useMemo, useEffect } from "react";
import { parsearFechaDate, parsearHoraDateTime } from "../services/globalFunctions";
import EmptyState from "./EmptyState";
import {
    FaShoppingCart,
    FaPlus,
    FaSearch,
    FaTimes,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaCalendarAlt,
    FaTrash,
    FaChevronLeft,
    FaChevronRight,
    FaFilter
} from "react-icons/fa";

const ListaCompras = ({ insumos = [], compras = [], onClickDeleteCompra }) => {
    // Estados de filtros, búsqueda, orden y paginación
    const [busqueda, setBusqueda] = useState("");
    const [insumoSeleccionado, setInsumoSeleccionado] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "fecha_desde", direction: "desc" });
    const [paginaActual, setPaginaActual] = useState(1);
    const [itemsPorPagina, setItemsPorPagina] = useState(15);

    // Reiniciar a página 1 cuando cambia cualquier filtro
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, insumoSeleccionado, fechaInicio, fechaFin, itemsPorPagina]);

    // Manejador de ordenamiento al hacer clic en cabecera
    const handleSort = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            // Por defecto, fechas y números en descendente al primer clic; texto en ascendente
            const defaultDesc = ["fecha_desde", "fecha_vencimiento", "precio_unitario", "total", "cantidad"].includes(key);
            return { key, direction: defaultDesc ? "desc" : "asc" };
        });
    };

    // 1. Filtrado
    const comprasFiltradas = useMemo(() => {
        return (compras || []).filter(c => {
            // Filtro por texto de búsqueda (insumo, proveedor, fecha)
            if (busqueda.trim()) {
                const q = busqueda.toLowerCase().trim();
                const prod = String(c.producto || "").toLowerCase();
                const prov = String(c.razon_social || "").toLowerCase();
                const fechaCompra = String(c.fecha_desde || "").toLowerCase();
                const fechaVenc = String(c.fecha_vencimiento || "").toLowerCase();

                const coincide = prod.includes(q) ||
                    prov.includes(q) ||
                    fechaCompra.includes(q) ||
                    fechaVenc.includes(q);

                if (!coincide) return false;
            }

            // Filtro por desplegable de Insumo específico
            if (insumoSeleccionado && insumoSeleccionado !== "TODOS") {
                if (String(c.insumo_id) !== String(insumoSeleccionado)) {
                    return false;
                }
            }

            // Filtro Desde (fecha_desde >= fechaInicio)
            if (fechaInicio) {
                const fechaCompraCorta = (c.fecha_desde || "").substring(0, 10);
                if (fechaCompraCorta < fechaInicio) return false;
            }

            // Filtro Hasta (fecha_desde <= fechaFin)
            if (fechaFin) {
                const fechaCompraCorta = (c.fecha_desde || "").substring(0, 10);
                if (fechaCompraCorta > fechaFin) return false;
            }

            return true;
        });
    }, [compras, busqueda, insumoSeleccionado, fechaInicio, fechaFin]);

    // 2. Ordenamiento
    const comprasOrdenadas = useMemo(() => {
        const items = [...comprasFiltradas];
        if (!sortConfig.key) return items;

        return items.sort((a, b) => {
            const dir = sortConfig.direction === "asc" ? 1 : -1;

            if (sortConfig.key === "fecha_desde") {
                const dateA = new Date(a.fecha_desde || 0).getTime();
                const dateB = new Date(b.fecha_desde || 0).getTime();
                return (dateA - dateB) * dir;
            }

            if (sortConfig.key === "fecha_vencimiento") {
                const dateA = a.fecha_vencimiento ? new Date(a.fecha_vencimiento).getTime() : 0;
                const dateB = b.fecha_vencimiento ? new Date(b.fecha_vencimiento).getTime() : 0;
                return (dateA - dateB) * dir;
            }

            if (sortConfig.key === "precio_unitario") {
                const puA = parseFloat(a.precio_unitario) || 0;
                const puB = parseFloat(b.precio_unitario) || 0;
                return (puA - puB) * dir;
            }

            if (sortConfig.key === "cantidad") {
                const cantA = parseFloat(a.cantidad) || 0;
                const cantB = parseFloat(b.cantidad) || 0;
                return (cantA - cantB) * dir;
            }

            if (sortConfig.key === "total") {
                const totA = (parseFloat(a.precio_unitario) || 0) * (parseFloat(a.cantidad) || 0);
                const totB = (parseFloat(b.precio_unitario) || 0) * (parseFloat(b.cantidad) || 0);
                return (totA - totB) * dir;
            }

            if (sortConfig.key === "producto") {
                return String(a.producto || "").localeCompare(String(b.producto || "")) * dir;
            }

            if (sortConfig.key === "razon_social") {
                return String(a.razon_social || "").localeCompare(String(b.razon_social || "")) * dir;
            }

            return 0;
        });
    }, [comprasFiltradas, sortConfig]);

    // 3. Paginación
    const totalItems = comprasOrdenadas.length;
    const totalPaginas = Math.ceil(totalItems / itemsPorPagina) || 1;
    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    const indiceFin = Math.min(indiceInicio + itemsPorPagina, totalItems);
    const comprasPaginadas = comprasOrdenadas.slice(indiceInicio, indiceFin);

    // Cálculo del gasto total acumulado en los resultados filtrados
    const totalGastoFiltrado = useMemo(() => {
        return comprasFiltradas.reduce((acc, c) => {
            const pu = parseFloat(c.precio_unitario) || 0;
            const cant = parseFloat(c.cantidad) || 0;
            return acc + (pu * cant);
        }, 0);
    }, [comprasFiltradas]);

    // Paginación con elipsis
    const getPageNumbers = () => {
        if (totalPaginas <= 7) {
            return Array.from({ length: totalPaginas }, (_, i) => i + 1);
        }
        const delta = 2;
        const range = [];
        for (let i = Math.max(2, paginaActual - delta); i <= Math.min(totalPaginas - 1, paginaActual + delta); i++) {
            range.push(i);
        }
        if (paginaActual - delta > 2) range.unshift("...");
        if (paginaActual + delta < totalPaginas - 1) range.push("...");
        range.unshift(1);
        range.push(totalPaginas);
        return range;
    };

    // Render de icono de orden en cabeceras
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort className="text-secondary opacity-50 ms-1" style={{ fontSize: "0.75rem" }} />;
        }
        return sortConfig.direction === "asc"
            ? <FaSortUp className="text-warning ms-1" style={{ fontSize: "0.85rem" }} />
            : <FaSortDown className="text-warning ms-1" style={{ fontSize: "0.85rem" }} />;
    };

    // Limpiar todos los filtros
    const handleLimpiarFiltros = () => {
        setBusqueda("");
        setInsumoSeleccionado("");
        setFechaInicio("");
        setFechaFin("");
        setSortConfig({ key: "fecha_desde", direction: "desc" });
    };

    const hayFiltrosActivos = busqueda.trim() !== "" || insumoSeleccionado !== "" || fechaInicio !== "" || fechaFin !== "";

    // Formatear montos en pesos argentinos con punto para miles y coma para decimales (sin desfase)
    const formatearMoneda = (monto) => {
        const valor = Number(monto || 0).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return `$\u00A0${valor}`;
    };

    // Helper visual para estado de vencimiento limpio, legible y sin cuadrados toscos
    const renderVencimiento = (fechaVenc) => {
        if (!fechaVenc) return <span className="text-muted fst-italic text-nowrap">---</span>;
        const fechaV = new Date(fechaVenc);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const diffDias = Math.ceil((fechaV.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        const fechaTexto = parsearFechaDate(fechaVenc);

        if (diffDias < 0) {
            return (
                <span 
                    className="badge rounded-pill text-nowrap px-2 py-1"
                    style={{ 
                        backgroundColor: "#fee2e2", 
                        color: "#991b1b", 
                        border: "1px solid #fca5a5",
                        fontWeight: "600",
                        fontSize: "0.82rem"
                    }}
                    title={`Lote vencido hace ${Math.abs(diffDias)} días (${fechaTexto})`}
                >
                    {fechaTexto} <small className="fw-bold ms-1">(Vencido)</small>
                </span>
            );
        } else if (diffDias <= 30) {
            return (
                <span 
                    className="badge rounded-pill text-nowrap px-2 py-1"
                    style={{ 
                        backgroundColor: "#fef3c7", 
                        color: "#92400e", 
                        border: "1px solid #fcd34d",
                        fontWeight: "600",
                        fontSize: "0.82rem"
                    }}
                    title={`Vence en ${diffDias} días (${fechaTexto})`}
                >
                    {fechaTexto} <small className="fw-bold ms-1">(Pronto)</small>
                </span>
            );
        }
        return <span className="text-secondary text-nowrap fw-medium">{fechaTexto}</span>;
    };

    if (!compras || compras.length === 0) {
        return (
            <EmptyState
                icon={FaShoppingCart}
                title="No hay compras registradas todavía"
                description="Registra los ingresos de mercadería para cargar precios de proveedores, actualizar el stock de insumos y controlar vencimientos."
                actionLink="/insumos/nueva_compra"
                actionText="Registrar Nueva Compra"
                actionIcon={FaPlus}
            />
        );
    }

    return (
        <div className="lista-compras">
            {/* Panel Superior de Búsqueda, Filtros por Fecha y Opciones */}
            <div className="bg-white p-3 rounded-3 border mb-3 shadow-sm">
                <div className="row g-2 align-items-center">
                    {/* Buscador de Insumos / Proveedor */}
                    <div className="col-12 col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <FaSearch />
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Buscar por insumo, proveedor..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                            {busqueda && (
                                <button
                                    className="btn btn-outline-secondary border-start-0"
                                    type="button"
                                    onClick={() => setBusqueda("")}
                                    title="Limpiar búsqueda"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Selector de Insumo específico */}
                    <div className="col-12 col-sm-6 col-md-3">
                        <select
                            className="form-select"
                            value={insumoSeleccionado}
                            onChange={e => setInsumoSeleccionado(e.target.value)}
                        >
                            <option value="">Todos los insumos ({insumos.length})</option>
                            {insumos.map(i => (
                                <option key={i.value} value={i.value}>
                                    {i.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtros por Rango de Fechas (Desde - Hasta) responsivos */}
                    <div className="col-6 col-sm-6 col-md-3">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light text-muted" title="Fecha de compra desde">
                                <FaCalendarAlt size={12} className="me-1" /> Desde
                            </span>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={fechaInicio}
                                onChange={e => setFechaInicio(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-6 col-sm-6 col-md-2">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light text-muted" title="Fecha de compra hasta">
                                <FaCalendarAlt size={12} className="me-1" /> Hasta
                            </span>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={fechaFin}
                                onChange={e => setFechaFin(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Sub-barra de Resumen, Totales y Control de Paginación */}
                <div className="d-flex flex-wrap justify-content-between align-items-center pt-2 mt-2 border-top text-muted small gap-2">
                    <div className="d-flex align-items-center gap-2">
                        <span>
                            Mostrando <strong>{totalItems === 0 ? 0 : indiceInicio + 1}</strong> - <strong>{indiceFin}</strong> de <strong>{totalItems}</strong> compras
                            {hayFiltrosActivos && (
                                <span className="fst-italic ms-1">(filtradas de {compras.length})</span>
                            )}
                        </span>
                        {hayFiltrosActivos && (
                            <button
                                type="button"
                                onClick={handleLimpiarFiltros}
                                className="btn btn-sm btn-outline-danger py-0 px-2 d-flex align-items-center gap-1"
                                title="Limpiar todos los filtros"
                            >
                                <FaTimes size={10} />
                                <span>Limpiar filtros</span>
                            </button>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-light text-dark border">
                            Total filtrado: <strong className="text-success">{formatearMoneda(totalGastoFiltrado)}</strong>
                        </span>

                        <div className="d-flex align-items-center gap-1">
                            <small className="text-muted text-nowrap">Por pág:</small>
                            <select
                                className="form-select form-select-sm py-0"
                                style={{ width: "auto" }}
                                value={itemsPorPagina}
                                onChange={e => setItemsPorPagina(Number(e.target.value))}
                                title="Compras por página"
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de Compras con Ordenamiento Interactivo por Cabecera */}
            <div className="table-responsive rounded-3 shadow-sm border bg-white">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th
                                scope="col"
                                className="user-select-none text-nowrap"
                                onClick={() => handleSort("producto")}
                                style={{ cursor: "pointer", minWidth: "150px" }}
                                title="Ordenar por Insumo"
                            >
                                <div className="d-flex align-items-center gap-1">
                                    <span>Insumo</span>
                                    {renderSortIcon("producto")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="user-select-none text-nowrap"
                                onClick={() => handleSort("razon_social")}
                                style={{ cursor: "pointer", minWidth: "140px" }}
                                title="Ordenar por Proveedor"
                            >
                                <div className="d-flex align-items-center gap-1">
                                    <span>Proveedor</span>
                                    {renderSortIcon("razon_social")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="text-end pe-3 user-select-none text-nowrap"
                                onClick={() => handleSort("precio_unitario")}
                                style={{ cursor: "pointer", minWidth: "125px" }}
                                title="Ordenar por Precio Unitario"
                            >
                                <div className="d-flex align-items-center justify-content-end gap-1">
                                    <span>Unitario</span>
                                    {renderSortIcon("precio_unitario")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="text-end pe-3 user-select-none text-nowrap"
                                onClick={() => handleSort("cantidad")}
                                style={{ cursor: "pointer", minWidth: "105px" }}
                                title="Ordenar por Cantidad"
                            >
                                <div className="d-flex align-items-center justify-content-end gap-1">
                                    <span>Cantidad</span>
                                    {renderSortIcon("cantidad")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="text-end pe-3 user-select-none text-nowrap"
                                onClick={() => handleSort("total")}
                                style={{ cursor: "pointer", minWidth: "135px" }}
                                title="Ordenar por Total"
                            >
                                <div className="d-flex align-items-center justify-content-end gap-1">
                                    <span>Total</span>
                                    {renderSortIcon("total")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="text-center user-select-none text-nowrap"
                                onClick={() => handleSort("fecha_desde")}
                                style={{ cursor: "pointer", minWidth: "155px" }}
                                title="Ordenar por Fecha de Compra"
                            >
                                <div className="d-flex align-items-center justify-content-center gap-1">
                                    <span>Fecha de compra</span>
                                    {renderSortIcon("fecha_desde")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="text-center user-select-none text-nowrap"
                                onClick={() => handleSort("fecha_vencimiento")}
                                style={{ cursor: "pointer", minWidth: "145px" }}
                                title="Ordenar por Vencimiento"
                            >
                                <div className="d-flex align-items-center justify-content-center gap-1">
                                    <span>Vencimiento</span>
                                    {renderSortIcon("fecha_vencimiento")}
                                </div>
                            </th>
                            <th scope="col" className="text-center text-nowrap" style={{ width: "70px", minWidth: "70px" }}>
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comprasPaginadas.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-5 text-muted">
                                    <FaSearch size={30} className="mb-2 opacity-25" />
                                    <p className="mb-1 fw-semibold">No se encontraron compras con los filtros seleccionados.</p>
                                    {hayFiltrosActivos && (
                                        <button
                                            type="button"
                                            onClick={handleLimpiarFiltros}
                                            className="btn btn-sm btn-outline-primary mt-2"
                                        >
                                            Restablecer filtros
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            comprasPaginadas.map(c => {
                                const pu = parseFloat(c.precio_unitario) || 0;
                                const cant = parseFloat(c.cantidad) || 0;
                                const total = pu * cant;

                                return (
                                    <tr key={c.id}>
                                        <td className="fw-semibold text-dark text-nowrap">
                                            {c.producto}
                                        </td>
                                        <td className="text-secondary text-nowrap">
                                            {c.razon_social || <span className="text-muted fst-italic">Sin proveedor</span>}
                                        </td>
                                        <td className="text-end pe-3 font-monospace text-nowrap">
                                            {formatearMoneda(pu)}
                                        </td>
                                        <td className="text-end pe-3 text-nowrap">
                                            <strong>{cant}</strong> <small className="text-muted">{c.simbolo || ""}</small>
                                        </td>
                                        <td className="text-end pe-3 fw-bold text-success font-monospace text-nowrap">
                                            {formatearMoneda(total)}
                                        </td>
                                        <td className="text-center text-nowrap text-secondary">
                                            {parsearHoraDateTime(c.fecha_desde)}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {renderVencimiento(c.fecha_vencimiento)}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger p-1 px-2"
                                                onClick={() => onClickDeleteCompra(c.id)}
                                                title="Eliminar registro de compra"
                                            >
                                                <FaTrash size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginador Inferior */}
            {totalPaginas > 1 && (
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3 p-2 bg-white rounded-3 border shadow-sm">
                    <small className="text-muted">
                        Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong>
                    </small>

                    <nav aria-label="Navegación de compras">
                        <ul className="pagination pagination-sm mb-0">
                            {/* Anterior */}
                            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                                <button
                                    type="button"
                                    className="page-link"
                                    onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                                    aria-label="Anterior"
                                >
                                    <FaChevronLeft size={10} />
                                </button>
                            </li>

                            {/* Números de página */}
                            {getPageNumbers().map((num, idx) => {
                                if (num === "...") {
                                    return (
                                        <li key={`ellipsis-${idx}`} className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    );
                                }
                                return (
                                    <li key={`page-${num}`} className={`page-item ${paginaActual === num ? "active" : ""}`}>
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() => setPaginaActual(num)}
                                        >
                                            {num}
                                        </button>
                                    </li>
                                );
                            })}

                            {/* Siguiente */}
                            <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                                <button
                                    type="button"
                                    className="page-link"
                                    onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                                    aria-label="Siguiente"
                                >
                                    <FaChevronRight size={10} />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default ListaCompras;