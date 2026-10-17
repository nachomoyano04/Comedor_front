import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../services/AuthProvider";
import { useContext, useState, useMemo, useEffect } from "react";
import EmptyState from "./EmptyState";
import {
    FaBoxes,
    FaPlus,
    FaSearch,
    FaTimes,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaFilter,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";

const ListaInsumos = ({ insumos = [], unidades_de_medida = [], onClickChangeStateInsumo }) => {
    const { user } = useContext(AuthContext);

    // Estados de búsqueda, filtros, ordenamiento y paginación
    const [busqueda, setBusqueda] = useState("");
    const [filtroStock, setFiltroStock] = useState("todos"); // 'todos', 'con_stock', 'bajo_stock', 'sin_stock'
    const [filtroEstado, setFiltroEstado] = useState("todos"); // 'todos', 'activos', 'inactivos'
    const [sortConfig, setSortConfig] = useState({ key: "producto", direction: "asc" });
    const [paginaActual, setPaginaActual] = useState(1);
    const [itemsPorPagina, setItemsPorPagina] = useState(15);

    // Helper para nombre y símbolo de unidad de medida
    const getUdm = (idUdm) => {
        return (unidades_de_medida || []).find(u => String(u.id) === String(idUdm));
    };

    // Si cambian los filtros o la búsqueda, volver a la página 1
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, filtroStock, filtroEstado, itemsPorPagina]);

    // Ordenamiento por columna
    const handleSort = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            // Para stock o código conviene desc al primer click si se quiere ver mayor stock primero
            return { key, direction: key === "stock" ? "desc" : "asc" };
        });
    };

    // 1. Filtrado
    const insumosFiltrados = useMemo(() => {
        return insumos.filter(i => {
            // Filtro por texto de búsqueda
            if (busqueda.trim()) {
                const q = busqueda.toLowerCase().trim();
                const codigo = String(i.codigo || "").toLowerCase();
                const producto = String(i.producto || "").toLowerCase();
                const marca = String(i.marca || "").toLowerCase();
                const udm = getUdm(i.id_unidad_de_medida);
                const udmNombre = String(udm?.nombre || "").toLowerCase();
                const udmSimbolo = String(udm?.simbolo || "").toLowerCase();

                const coincideTexto = codigo.includes(q) ||
                    producto.includes(q) ||
                    marca.includes(q) ||
                    udmNombre.includes(q) ||
                    udmSimbolo.includes(q);

                if (!coincideTexto) return false;
            }

            // Filtro por Stock
            const stockVal = parseFloat(i.stock) || 0;
            if (filtroStock === "con_stock" && stockVal <= 0) return false;
            if (filtroStock === "sin_stock" && stockVal > 0) return false;
            if (filtroStock === "bajo_stock" && (stockVal <= 0 || stockVal > 5)) return false;

            // Filtro por Estado
            if (filtroEstado === "activos" && i.estado !== 1) return false;
            if (filtroEstado === "inactivos" && i.estado === 1) return false;

            return true;
        });
    }, [insumos, busqueda, filtroStock, filtroEstado, unidades_de_medida]);

    // 2. Ordenamiento
    const insumosOrdenados = useMemo(() => {
        const items = [...insumosFiltrados];
        if (!sortConfig.key) return items;

        return items.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            if (sortConfig.key === "stock") {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
                return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
            }

            if (sortConfig.key === "codigo") {
                const aNum = parseFloat(aVal);
                const bNum = parseFloat(bVal);
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
                }
                return sortConfig.direction === "asc"
                    ? String(aVal || "").localeCompare(String(bVal || ""))
                    : String(bVal || "").localeCompare(String(aVal || ""));
            }

            if (sortConfig.key === "udm") {
                const aUdm = getUdm(a.id_unidad_de_medida)?.nombre || "";
                const bUdm = getUdm(b.id_unidad_de_medida)?.nombre || "";
                return sortConfig.direction === "asc"
                    ? aUdm.localeCompare(bUdm)
                    : bUdm.localeCompare(aUdm);
            }

            if (sortConfig.key === "estado") {
                return sortConfig.direction === "asc" ? a.estado - b.estado : b.estado - a.estado;
            }

            const strA = String(aVal || "").toLowerCase();
            const strB = String(bVal || "").toLowerCase();
            return sortConfig.direction === "asc"
                ? strA.localeCompare(strB)
                : strB.localeCompare(strA);
        });
    }, [insumosFiltrados, sortConfig, unidades_de_medida]);

    // 3. Paginación
    const totalItems = insumosOrdenados.length;
    const totalPaginas = Math.ceil(totalItems / itemsPorPagina) || 1;
    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    const indiceFin = Math.min(indiceInicio + itemsPorPagina, totalItems);
    const insumosPaginados = insumosOrdenados.slice(indiceInicio, indiceFin);

    // Números de páginas a mostrar con elipsis inteligente
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

    // Renderizado del icono de ordenamiento en las cabeceras
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort className="text-secondary opacity-50 ms-1" style={{ fontSize: "0.75rem" }} />;
        }
        return sortConfig.direction === "asc"
            ? <FaSortUp className="text-primary ms-1" style={{ fontSize: "0.85rem" }} />
            : <FaSortDown className="text-primary ms-1" style={{ fontSize: "0.85rem" }} />;
    };

    // Reset general de filtros
    const handleLimpiarFiltros = () => {
        setBusqueda("");
        setFiltroStock("todos");
        setFiltroEstado("todos");
        setSortConfig({ key: "producto", direction: "asc" });
    };

    const hayFiltrosActivos = busqueda.trim() !== "" || filtroStock !== "todos" || filtroEstado !== "todos";

    if (!insumos || insumos.length === 0) {
        return (
            <EmptyState
                icon={FaBoxes}
                title="No hay insumos registrados todavía"
                description="Carga los alimentos y materias primas (leche, harina, arroz, carnes, verduras) para gestionar el inventario del comedor."
                actionLink="/insumos/nuevo"
                actionText="Agregar Nuevo Insumo"
                actionIcon={FaPlus}
                canCreate={user?.roles?.some(r => [1, 2].includes(r))}
            />
        );
    }

    return (
        <div className="lista-insumos">
            {/* Barra de Filtros, Búsqueda y Opciones */}
            <div className="bg-white p-3 rounded-3 border mb-3 shadow-sm">
                <div className="row g-2 align-items-center">
                    {/* Buscador */}
                    <div className="col-12 col-md-5">
                        <div className="input-group">
                            <span className="input-group-text bg-light text-muted border-end-0">
                                <FaSearch />
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Buscar por código, producto, marca..."
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

                    {/* Filtro rápido por Stock */}
                    <div className="col-6 col-md-3">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light text-muted" title="Filtrar por Stock">
                                <FaFilter size={11} className="me-1" /> Stock
                            </span>
                            <select
                                className="form-select form-select-sm"
                                value={filtroStock}
                                onChange={e => setFiltroStock(e.target.value)}
                            >
                                <option value="todos">Todos los stocks</option>
                                <option value="con_stock">Con stock (&gt; 0)</option>
                                <option value="bajo_stock">Stock bajo (&le; 5)</option>
                                <option value="sin_stock">Sin stock (0 o negativo)</option>
                            </select>
                        </div>
                    </div>

                    {/* Filtro por Estado */}
                    <div className="col-6 col-md-2">
                        <select
                            className="form-select form-select-sm"
                            value={filtroEstado}
                            onChange={e => setFiltroEstado(e.target.value)}
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activos">Solo activos</option>
                            <option value="inactivos">Solo inactivos</option>
                        </select>
                    </div>

                    {/* Cantidad por página y botón limpiar */}
                    <div className="col-12 col-md-2 d-flex justify-content-md-end align-items-center gap-2">
                        {hayFiltrosActivos && (
                            <button
                                type="button"
                                onClick={handleLimpiarFiltros}
                                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                title="Restablecer filtros"
                            >
                                <FaTimes size={11} />
                                <span className="small">Limpiar</span>
                            </button>
                        )}
                        <select
                            className="form-select form-select-sm"
                            style={{ width: "auto" }}
                            value={itemsPorPagina}
                            onChange={e => setItemsPorPagina(Number(e.target.value))}
                            title="Insumos por página"
                        >
                            <option value={10}>10 / pág</option>
                            <option value={15}>15 / pág</option>
                            <option value={25}>25 / pág</option>
                            <option value={50}>50 / pág</option>
                            <option value={100}>100 / pág</option>
                        </select>
                    </div>
                </div>

                {/* Sub-barra de resumen de resultados */}
                <div className="d-flex flex-wrap justify-content-between align-items-center pt-2 mt-2 border-top text-muted small">
                    <div>
                        Mostrando <strong>{totalItems === 0 ? 0 : indiceInicio + 1}</strong> - <strong>{indiceFin}</strong> de <strong>{totalItems}</strong> insumos
                        {hayFiltrosActivos && <span className="fst-italic ms-1">(filtrados de un total de {insumos.length})</span>}
                    </div>
                    <div>
                        <span className="badge bg-light text-dark border">
                            Orden: <strong className="text-primary text-capitalize">{sortConfig.key}</strong> ({sortConfig.direction === "asc" ? "Ascendente" : "Descendente"})
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabla de Insumos con ordenamiento por click en cabecera */}
            <div className="table-responsive rounded-3 shadow-sm border bg-white">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th
                                scope="col"
                                className="text-center user-select-none"
                                onClick={() => handleSort("codigo")}
                                style={{ cursor: "pointer", width: "110px" }}
                                title="Ordenar por Código"
                            >
                                <div className="d-flex align-items-center justify-content-center gap-1">
                                    <span>Código</span>
                                    {renderSortIcon("codigo")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="user-select-none"
                                onClick={() => handleSort("producto")}
                                style={{ cursor: "pointer" }}
                                title="Ordenar por Nombre de Producto"
                            >
                                <div className="d-flex align-items-center gap-1">
                                    <span>Producto</span>
                                    {renderSortIcon("producto")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="user-select-none"
                                onClick={() => handleSort("marca")}
                                style={{ cursor: "pointer" }}
                                title="Ordenar por Marca"
                            >
                                <div className="d-flex align-items-center gap-1">
                                    <span>Marca</span>
                                    {renderSortIcon("marca")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="text-center user-select-none"
                                onClick={() => handleSort("udm")}
                                style={{ cursor: "pointer", width: "140px" }}
                                title="Ordenar por Unidad de Medida"
                            >
                                <div className="d-flex align-items-center justify-content-center gap-1">
                                    <span>Unidad</span>
                                    {renderSortIcon("udm")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="text-end pe-4 user-select-none"
                                onClick={() => handleSort("stock")}
                                style={{ cursor: "pointer", width: "140px" }}
                                title="Ordenar por Cantidad en Stock"
                            >
                                <div className="d-flex align-items-center justify-content-end gap-1">
                                    <span>Stock</span>
                                    {renderSortIcon("stock")}
                                </div>
                            </th>
                            {/* Solo pueden editar o dar de baja/alta rol: ADMIN Y COCINA */}
                            {user?.roles?.some(r => [1, 2].includes(r)) && (
                                <>
                                    <th scope="col" className="text-center" style={{ width: "80px" }}>Editar</th>
                                    <th
                                        scope="col"
                                        className="text-center user-select-none"
                                        onClick={() => handleSort("estado")}
                                        style={{ cursor: "pointer", width: "110px" }}
                                        title="Ordenar por Estado"
                                    >
                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                            <span>Estado</span>
                                            {renderSortIcon("estado")}
                                        </div>
                                    </th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {insumosPaginados.length === 0 ? (
                            <tr>
                                <td colSpan={user?.roles?.some(r => [1, 2].includes(r)) ? 7 : 5} className="text-center py-5">
                                    <div className="text-muted">
                                        <FaSearch size={32} className="mb-2 opacity-25" />
                                        <p className="mb-1 fw-semibold">No se encontraron insumos que coincidan con la búsqueda.</p>
                                        {hayFiltrosActivos && (
                                            <button
                                                type="button"
                                                onClick={handleLimpiarFiltros}
                                                className="btn btn-sm btn-outline-primary mt-2"
                                            >
                                                Restablecer filtros
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            insumosPaginados.map(i => {
                                const udm = getUdm(i.id_unidad_de_medida);
                                const stockNum = parseFloat(i.stock) || 0;

                                return (
                                    <tr key={i.id}>
                                        <td className="text-center fw-semibold text-secondary font-monospace">
                                            {i.codigo || "-"}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {i.producto}
                                        </td>
                                        <td className="text-secondary">
                                            {i.marca || <span className="text-muted fst-italic">-</span>}
                                        </td>
                                        <td className="text-center">
                                            <span className="badge bg-light text-dark border">
                                                {udm?.nombre || "- - -"}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4 text-nowrap">
                                            {stockNum > 5 ? (
                                                <span className="fw-bold text-success">
                                                    {stockNum} <small className="text-muted fw-normal">{udm?.simbolo || ""}</small>
                                                </span>
                                            ) : stockNum > 0 ? (
                                                <span className="badge bg-warning bg-opacity-25 text-dark border border-warning px-2 py-1">
                                                    {stockNum} <small className="fw-normal">{udm?.simbolo || ""}</small> (Bajo)
                                                </span>
                                            ) : (
                                                <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-2 py-1">
                                                    {stockNum} <small className="fw-normal">{udm?.simbolo || ""}</small> (Sin stock)
                                                </span>
                                            )}
                                        </td>
                                        {user?.roles?.some(r => [1, 2].includes(r)) && (
                                            <>
                                                <td className="text-center">
                                                    <Link
                                                        className="btn btn-sm btn-outline-warning text-dark"
                                                        to={`/insumos/editar/${i.id}`}
                                                        title="Editar insumo"
                                                    >
                                                        <FontAwesomeIcon icon={faPencil} />
                                                    </Link>
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        onClick={() => onClickChangeStateInsumo(i.id, i.estado)}
                                                        className={`btn btn-sm px-2 ${i.estado === 1 ? 'btn-outline-success' : 'btn-outline-danger'}`}
                                                        title={i.estado === 1 ? "Dar de baja" : "Dar de alta"}
                                                    >
                                                        {i.estado === 1 ? "Activo" : "Inactivo"}
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginador */}
            {totalPaginas > 1 && (
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3 p-2 bg-white rounded-3 border shadow-sm">
                    <small className="text-muted">
                        Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong>
                    </small>

                    <nav aria-label="Navegación de insumos">
                        <ul className="pagination pagination-sm mb-0">
                            {/* Botón Anterior */}
                            <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
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
                                    <li key={`page-${num}`} className={`page-item ${paginaActual === num ? 'active' : ''}`}>
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

                            {/* Botón Siguiente */}
                            <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
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

export default ListaInsumos;