import { useState, useEffect, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import { 
    FaExclamationTriangle, 
    FaUtensils, 
    FaShoppingCart, 
    FaUsers, 
    FaMoneyBillWave, 
    FaChartLine, 
    FaCalendarAlt, 
    FaClock, 
    FaShieldAlt, 
    FaBoxOpen, 
    FaArrowRight, 
    FaTabletAlt,
    FaInfoCircle,
    FaCheckCircle
} from "react-icons/fa";
import Chart from "react-apexcharts";
import api from "../services/api";
import { getProducciones, getAlertasVencimiento } from "../services/api_endpoints";
import { AuthContext } from "../services/AuthProvider";
import { ROLES } from "../constants/Roles";
import { parsearFechaDate } from "../services/globalFunctions";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [cargando, setCargando] = useState(true);
    const [insumosCriticos, setInsumosCriticos] = useState([]);
    const [insumosAgotados, setInsumosAgotados] = useState([]);
    const [producciones, setProducciones] = useState([]);
    const [alertasVencimiento, setAlertasVencimiento] = useState(null);
    const [tabAlertaActiva, setTabAlertaActiva] = useState("vencidos");

    const esDirectivoOAdmin = useMemo(() => {
        return user?.roles?.some(r => [ROLES.ADMIN, ROLES.DIRECTIVOS].includes(r));
    }, [user]);

    const esCocina = useMemo(() => {
        return user?.roles?.includes(ROLES.COCINA);
    }, [user]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setCargando(false);
            return;
        }

        const cargarDatos = async () => {
            setCargando(true);
            try {
                // 1. Cargar insumos para alertas de stock
                const { data: insumos } = await api.get("/insumos");
                const activos = insumos.filter(i => i.estado === 1);
                const agotados = activos.filter(i => parseFloat(i.stock) <= 0);
                const criticos = activos.filter(i => parseFloat(i.stock) > 0 && parseFloat(i.stock) <= 5);
                setInsumosAgotados(agotados);
                setInsumosCriticos(criticos);

                // 2. Cargar producciones para métricas ejecutivas escolares
                try {
                    const prods = await getProducciones();
                    setProducciones(prods || []);
                } catch (e) {
                    console.log("No se pudo cargar producciones para el usuario actual", e);
                }

                // 3. Cargar alertas bromatológicas de vencimiento y sugerencias FIFO
                try {
                    const alertas = await getAlertasVencimiento();
                    setAlertasVencimiento(alertas);
                    // Seleccionar tab inicial con alertas activas
                    if (alertas?.resumen?.totalVencidos > 0) setTabAlertaActiva("vencidos");
                    else if (alertas?.resumen?.totalCriticos3Dias > 0) setTabAlertaActiva("criticos3");
                    else if (alertas?.resumen?.totalAlerta7Dias > 0) setTabAlertaActiva("alerta7");
                    else setTabAlertaActiva("proximos15");
                } catch (e) {
                    console.log("No se pudo cargar alertas de vencimiento", e);
                }

            } catch (error) {
                console.error("Error al cargar datos del tablero", error);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    // Agrupar producciones únicas (ya que getProducciones devuelve una fila por insumo usado)
    const produccionesUnicas = useMemo(() => {
        const map = new Map();
        for (const p of producciones) {
            if (!map.has(p.id)) {
                map.set(p.id, {
                    id: p.id,
                    fecha: p.fecha,
                    receta_nombre: p.nombre,
                    cantidad_producida: parseFloat(p.cantidad_producida) || 0,
                    costo_primo_total: parseFloat(p.costo_primo_total) || 0,
                    cantidad_comensales: parseFloat(p.cantidad_comensales) || 0,
                    turno: p.turno || "Sin turno",
                    estado: p.estado
                });
            }
        }
        return Array.from(map.values()).filter(p => p.estado === 1);
    }, [producciones]);

    // Métricas del Mes Actual
    const metricas = useMemo(() => {
        const ahora = new Date();
        const anioActual = ahora.getFullYear();
        const mesActual = ahora.getMonth();

        let totalComensalesMes = 0;
        let totalCostoMes = 0;
        let totalPlatosMes = 0;

        let totalComensalesHistorico = 0;
        let totalCostoHistorico = 0;

        // Distribución por turno
        const comensalesPorTurno = {
            mañana: 0,
            tarde: 0,
            noche: 0,
            otro: 0
        };

        // Datos para gráfico temporal (ordenados por fecha)
        const temporalMap = new Map();

        const prodsOrdenadas = [...produccionesUnicas].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        for (const p of prodsOrdenadas) {
            const f = new Date(p.fecha);
            const esEsteMes = f.getFullYear() === anioActual && f.getMonth() === mesActual;

            totalComensalesHistorico += p.cantidad_comensales;
            totalCostoHistorico += p.costo_primo_total;

            if (esEsteMes) {
                totalComensalesMes += p.cantidad_comensales;
                totalCostoMes += p.costo_primo_total;
                totalPlatosMes += p.cantidad_producida;

                const turnoKey = p.turno?.toLowerCase().trim();
                if (turnoKey === "mañana" || turnoKey === "manana") comensalesPorTurno.mañana += p.cantidad_comensales;
                else if (turnoKey === "tarde") comensalesPorTurno.tarde += p.cantidad_comensales;
                else if (turnoKey === "noche") comensalesPorTurno.noche += p.cantidad_comensales;
                else comensalesPorTurno.otro += p.cantidad_comensales;

                // Agrupar por día
                const diaStr = f.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
                if (!temporalMap.has(diaStr)) {
                    temporalMap.set(diaStr, { costo: 0, comensales: 0 });
                }
                const prev = temporalMap.get(diaStr);
                prev.costo += p.costo_primo_total;
                prev.comensales += p.cantidad_comensales;
            }
        }

        // Si no hay producciones este mes pero hay histórico, usamos el histórico para no mostrar ceros vacíos
        const usandoHistorico = totalComensalesMes === 0 && totalComensalesHistorico > 0;
        const comensalesCalculados = usandoHistorico ? totalComensalesHistorico : totalComensalesMes;
        const costoCalculado = usandoHistorico ? totalCostoHistorico : totalCostoMes;

        // KPI Clave del informe: Costo promedio por alumno / ración
        const costoPromedioPorAlumno = comensalesCalculados > 0 
            ? (costoCalculado / comensalesCalculados) 
            : 0;

        return {
            totalComensales: comensalesCalculados,
            totalCosto: costoCalculado,
            totalPlatos: usandoHistorico ? produccionesUnicas.reduce((acc, p) => acc + p.cantidad_producida, 0) : totalPlatosMes,
            costoPromedioPorAlumno,
            usandoHistorico,
            comensalesPorTurno,
            graficoTemporal: {
                dias: Array.from(temporalMap.keys()),
                costos: Array.from(temporalMap.values()).map(v => Math.round(v.costo)),
                comensales: Array.from(temporalMap.values()).map(v => v.comensales)
            }
        };
    }, [produccionesUnicas]);

    // Opciones para Gráfico de Evolución Temporal (ApexCharts)
    const temporalChartOptions = useMemo(() => {
        const dias = metricas.graficoTemporal.dias.length > 0 
            ? metricas.graficoTemporal.dias 
            : ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
        const costos = metricas.graficoTemporal.costos.length > 0 
            ? metricas.graficoTemporal.costos 
            : [0, 0, 0, 0];
        const comensales = metricas.graficoTemporal.comensales.length > 0 
            ? metricas.graficoTemporal.comensales 
            : [0, 0, 0, 0];

        return {
            series: [
                { name: "Costo Primo Total ($)", type: "column", data: costos },
                { name: "Alumnos Alimentados", type: "line", data: comensales }
            ],
            options: {
                chart: {
                    height: 320,
                    type: "line",
                    toolbar: { show: false },
                    zoom: { enabled: false }
                },
                stroke: { width: [0, 3], curve: "smooth" },
                plotOptions: { bar: { columnWidth: "40%", borderRadius: 6 } },
                colors: ["#3b82f6", "#10b981"],
                dataLabels: { enabled: false },
                labels: dias,
                yaxis: [
                    {
                        title: { text: "Costo Total ($)", style: { color: "#3b82f6" } },
                        labels: { formatter: (val) => `$${Math.round(val).toLocaleString("es-AR")}` }
                    },
                    {
                        opposite: true,
                        title: { text: "Alumnos", style: { color: "#10b981" } },
                        labels: { formatter: (val) => Math.round(val) }
                    }
                ],
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: (val, opts) => opts.seriesIndex === 0 ? `$${val.toLocaleString("es-AR")}` : `${val} alumnos`
                    }
                },
                legend: { position: "top", horizontalAlign: "right" },
                grid: { borderColor: "#f1f5f9" }
            }
        };
    }, [metricas]);

    // Opciones para Gráfico Donut de Turnos (ApexCharts)
    const turnoChartOptions = useMemo(() => {
        const { mañana, tarde, noche } = metricas.comensalesPorTurno;
        const total = mañana + tarde + noche;
        const series = total > 0 ? [mañana, tarde, noche] : [1, 1, 1];
        const labels = ["Mañana", "Tarde", "Noche"];

        return {
            series: series,
            options: {
                chart: { type: "donut", height: 320 },
                labels: labels,
                colors: ["#f59e0b", "#06b6d4", "#6366f1"],
                legend: { position: "bottom" },
                dataLabels: { enabled: total > 0 },
                plotOptions: {
                    pie: {
                        donut: {
                            size: "65%",
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: "Total Alumnos",
                                    formatter: () => total > 0 ? total.toLocaleString("es-AR") : "0"
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    y: { formatter: (val) => total > 0 ? `${val} alumnos` : "Sin datos" }
                }
            }
        };
    }, [metricas]);

    if (cargando) {
        return (
            <div className="container-fluid mt-5 text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: "3.5rem", height: "3.5rem" }}>
                    <span className="visually-hidden">Cargando tablero...</span>
                </div>
                <h4 className="mt-3 text-secondary fw-semibold">Cargando tablero del comedor escolar...</h4>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-2 mb-5">
            {/* ENCABEZADO PRINCIPAL */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-3">
                <div>
                    <h2 className="mb-1 fw-bolder text-dark d-flex align-items-center gap-2">
                        <span>Tablero de Gestión Escolar</span>
                        {esDirectivoOAdmin && (
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-6 rounded-pill px-3 py-1">
                                Vista Directiva
                            </span>
                        )}
                    </h2>
                    <p className="text-secondary mb-0 fw-medium">
                        Monitoreo integral: nutrición, presupuesto por ración, alertas bromatológicas y control de stock.
                    </p>
                </div>

                <div className="d-flex gap-2">
                    {esCocina && (
                        <Link to="/produccion/registrar" className="btn btn-warning btn-lg fw-bold d-flex align-items-center gap-2 shadow-sm text-dark">
                            <FaTabletAlt size={20} />
                            <span>Pantalla de Cocina</span>
                        </Link>
                    )}
                    <Link to="/insumos/nueva_compra" className="btn btn-success btn-lg fw-bold d-flex align-items-center gap-2 shadow-sm">
                        <FaShoppingCart size={20} />
                        <span>Nueva Compra</span>
                    </Link>
                </div>
            </div>

            {/* SECCIÓN 1: KPIS EJECUTIVOS PARA DIRECTIVOS Y ADMINISTRACIÓN */}
            <div className="row g-3 mb-4">
                {/* KPI 1: Alumnos Alimentados */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", borderLeft: "5px solid #2563eb" }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="overflow-hidden">
                                <span className="text-primary fw-bold text-uppercase kpi-label d-block text-truncate">
                                    {metricas.usandoHistorico ? "Alumnos (Histórico)" : "Alumnos Alimentados (Mes)"}
                                </span>
                                <div className="kpi-number text-dark my-2">
                                    {metricas.totalComensales.toLocaleString("es-AR")}
                                </div>
                                <small className="text-secondary fw-semibold d-block">
                                    {metricas.totalPlatos} raciones servidas
                                </small>
                            </div>
                            <div className="p-3 bg-primary text-white rounded-4 shadow-sm flex-shrink-0 ms-2">
                                <FaUsers size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI 2: Costo Promedio por Alumno / Ración (CLAVE DE INFORME) */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderLeft: "5px solid #16a34a" }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="overflow-hidden">
                                <span className="text-success fw-bold text-uppercase kpi-label d-block text-truncate">
                                    Costo por Alumno / Plato
                                </span>
                                <div className="kpi-number text-dark my-2">
                                    ${metricas.costoPromedioPorAlumno.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <small className="text-success fw-bold d-block">
                                    Promedio por ración escolar
                                </small>
                            </div>
                            <div className="p-3 bg-success text-white rounded-4 shadow-sm flex-shrink-0 ms-2">
                                <FaMoneyBillWave size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI 3: Presupuesto Consumido en Alimentos */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ background: "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)", borderLeft: "5px solid #ca8a04" }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="overflow-hidden">
                                <span className="text-warning-emphasis fw-bold text-uppercase kpi-label d-block text-truncate">
                                    Inversión en Insumos (Mes)
                                </span>
                                <div className="kpi-number text-dark my-2">
                                    ${metricas.totalCosto.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                                </div>
                                <small className="text-secondary fw-semibold d-block">
                                    Costo primo total devengado
                                </small>
                            </div>
                            <div className="p-3 bg-warning text-dark rounded-4 shadow-sm flex-shrink-0 ms-2">
                                <FaChartLine size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI 4: Alertas Activas Bromatológicas & Stock */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)", borderLeft: "5px solid #e11d48" }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="overflow-hidden">
                                <span className="text-danger fw-bold text-uppercase kpi-label d-block text-truncate">
                                    Alertas Sanitarias / Stock
                                </span>
                                <div className="kpi-number text-danger my-2">
                                    {(alertasVencimiento?.resumen?.totalAlertas || 0) + insumosAgotados.length + insumosCriticos.length}
                                </div>
                                <small className="text-danger fw-bold d-block">
                                    {alertasVencimiento?.resumen?.totalVencidos || 0} vencidos · {insumosAgotados.length} agotados
                                </small>
                            </div>
                            <div className="p-3 bg-danger text-white rounded-4 shadow-sm flex-shrink-0 ms-2">
                                <FaExclamationTriangle size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: GRÁFICOS INTERACTIVOS APEXCHARTS */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                            <div>
                                <h5 className="fw-bold text-dark mb-0">Evolución de Costo Primo y Raciones</h5>
                                <small className="text-muted">Relación entre inversión monetaria y volumen de comensales alimentados</small>
                            </div>
                            <span className="badge bg-light text-secondary border px-3 py-2 fw-semibold">
                                Mes Actual
                            </span>
                        </div>
                        <div className="chart-container" style={{ minHeight: "330px" }}>
                            <Chart 
                                options={temporalChartOptions.options} 
                                series={temporalChartOptions.series} 
                                type="line" 
                                height={320} 
                            />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
                        <div className="mb-3">
                            <h5 className="fw-bold text-dark mb-0">Distribución por Turno Escolar</h5>
                            <small className="text-muted">Proporción de raciones servidas por turno</small>
                        </div>
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "330px" }}>
                            <Chart 
                                options={turnoChartOptions.options} 
                                series={turnoChartOptions.series} 
                                type="donut" 
                                height={320} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 3: CONTROL BROMATOLÓGICO Y GESTIÓN DE VENCIMIENTOS (FIFO) */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden bg-white">
                <div className="card-header bg-dark text-white p-3 p-md-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-danger text-white rounded-3 flex-shrink-0">
                            <FaShieldAlt size={24} />
                        </div>
                        <div>
                            <h5 className="mb-0 fw-bold fs-6 fs-md-5">CONTROL BROMATOLÓGICO Y GESTIÓN DE VENCIMIENTOS (CRITERIO FIFO)</h5>
                            <small className="text-secondary fw-semibold">
                                Priorización de consumo: Primero en vencer / Primero en entrar, Primero en salir
                            </small>
                        </div>
                    </div>

                    {/* Botones / Pestañas de Semáforo Responsives */}
                    <div className="d-flex flex-wrap gap-2" role="group">
                        <button 
                            type="button" 
                            onClick={() => setTabAlertaActiva("vencidos")} 
                            className={`btn btn-sm rounded-pill px-3 py-2 fw-bold ${tabAlertaActiva === "vencidos" ? "btn-danger shadow-sm" : "btn-outline-light"}`}
                        >
                            🔴 Vencidos ({alertasVencimiento?.resumen?.totalVencidos || 0})
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setTabAlertaActiva("criticos3")} 
                            className={`btn btn-sm rounded-pill px-3 py-2 fw-bold ${tabAlertaActiva === "criticos3" ? "btn-warning text-dark shadow-sm" : "btn-outline-light"}`}
                        >
                            🟠 ≤ 3 Días ({alertasVencimiento?.resumen?.totalCriticos3Dias || 0})
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setTabAlertaActiva("alerta7")} 
                            className={`btn btn-sm rounded-pill px-3 py-2 fw-bold ${tabAlertaActiva === "alerta7" ? "btn-info text-dark shadow-sm" : "btn-outline-light"}`}
                        >
                            🟡 ≤ 7 Días ({alertasVencimiento?.resumen?.totalAlerta7Dias || 0})
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setTabAlertaActiva("proximos15")} 
                            className={`btn btn-sm rounded-pill px-3 py-2 fw-bold ${tabAlertaActiva === "proximos15" ? "btn-primary shadow-sm" : "btn-outline-light"}`}
                        >
                            🔵 ≤ 15 Días ({alertasVencimiento?.resumen?.totalProximos15Dias || 0})
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setTabAlertaActiva("fifo")} 
                            className={`btn btn-sm rounded-pill px-3 py-2 fw-bold ${tabAlertaActiva === "fifo" ? "btn-success shadow-sm" : "btn-outline-light"}`}
                        >
                            📋 Sugerencias FIFO
                        </button>
                    </div>
                </div>

                <div className="card-body p-0">
                    {/* Pestaña: Vencidos */}
                    {tabAlertaActiva === "vencidos" && (
                        <div className="p-3">
                            {(!alertasVencimiento?.vencidos || alertasVencimiento.vencidos.length === 0) ? (
                                <div className="text-center py-4 text-success fw-bold d-flex flex-column align-items-center gap-2">
                                    <FaCheckCircle size={40} className="text-success" />
                                    <span>Excelente: No hay insumos vencidos en despensa.</span>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-danger">
                                            <tr>
                                                <th>Insumo</th>
                                                <th>Proveedor</th>
                                                <th>Fecha Vencimiento</th>
                                                <th>Días Vencido</th>
                                                <th>Stock Físico</th>
                                                <th>Acción Requerida</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alertasVencimiento.vencidos.map(item => (
                                                <tr key={item.id} className="table-danger">
                                                    <td className="fw-bold">{item.producto}</td>
                                                    <td>{item.razon_social || "Sin proveedor"}</td>
                                                    <td className="fw-bold text-danger">{parsearFechaDate(item.fecha_vencimiento)}</td>
                                                    <td>
                                                        <span className="badge bg-danger fs-7">
                                                            Venció hace {Math.abs(item.dias_para_vencer)} días
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold">{item.stock} {item.simbolo}</td>
                                                    <td>
                                                        <span className="badge bg-dark text-white px-2 py-1">
                                                            ⚠️ Dar de baja por bromatología
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pestaña: Críticos ≤ 3 Días */}
                    {tabAlertaActiva === "criticos3" && (
                        <div className="p-3">
                            {(!alertasVencimiento?.criticos3Dias || alertasVencimiento.criticos3Dias.length === 0) ? (
                                <div className="text-center py-4 text-success fw-bold">
                                    No hay insumos críticos venciendo en las próximas 72 horas.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-warning">
                                            <tr>
                                                <th>Insumo</th>
                                                <th>Proveedor</th>
                                                <th>Fecha Vencimiento</th>
                                                <th>Plazo Restante</th>
                                                <th>Stock Físico</th>
                                                <th>Criterio de Cocina</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alertasVencimiento.criticos3Dias.map(item => (
                                                <tr key={item.id}>
                                                    <td className="fw-bold">{item.producto}</td>
                                                    <td>{item.razon_social || "Sin proveedor"}</td>
                                                    <td className="fw-bold text-warning-emphasis">{parsearFechaDate(item.fecha_vencimiento)}</td>
                                                    <td>
                                                        <span className="badge bg-warning text-dark fs-7">
                                                            Vence en {item.dias_para_vencer} día(s)
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold">{item.stock} {item.simbolo}</td>
                                                    <td>
                                                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning">
                                                            ⚡ Consumo prioritario HOY
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pestaña: Alerta ≤ 7 Días */}
                    {tabAlertaActiva === "alerta7" && (
                        <div className="p-3">
                            {(!alertasVencimiento?.alerta7Dias || alertasVencimiento.alerta7Dias.length === 0) ? (
                                <div className="text-center py-4 text-secondary">
                                    No hay insumos venciendo en los próximos 7 días.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Insumo</th>
                                                <th>Proveedor</th>
                                                <th>Fecha Vencimiento</th>
                                                <th>Plazo Restante</th>
                                                <th>Stock en Despensa</th>
                                                <th>Recomendación Menú</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alertasVencimiento.alerta7Dias.map(item => (
                                                <tr key={item.id}>
                                                    <td className="fw-bold">{item.producto}</td>
                                                    <td>{item.razon_social || "Sin proveedor"}</td>
                                                    <td>{parsearFechaDate(item.fecha_vencimiento)}</td>
                                                    <td>
                                                        <span className="badge bg-info text-dark fs-7">
                                                            Vence en {item.dias_para_vencer} días
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold">{item.stock} {item.simbolo}</td>
                                                    <td>
                                                        <span className="badge bg-info-subtle text-info-emphasis border border-info">
                                                            📅 Incluir en menú semanal
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pestaña: Próximos ≤ 15 Días */}
                    {tabAlertaActiva === "proximos15" && (
                        <div className="p-3">
                            {(!alertasVencimiento?.proximos15Dias || alertasVencimiento.proximos15Dias.length === 0) ? (
                                <div className="text-center py-4 text-secondary">
                                    No hay insumos venciendo en los próximos 15 días.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Insumo</th>
                                                <th>Proveedor</th>
                                                <th>Fecha Vencimiento</th>
                                                <th>Días Restantes</th>
                                                <th>Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alertasVencimiento.proximos15Dias.map(item => (
                                                <tr key={item.id}>
                                                    <td className="fw-bold">{item.producto}</td>
                                                    <td>{item.razon_social || "Sin proveedor"}</td>
                                                    <td>{parsearFechaDate(item.fecha_vencimiento)}</td>
                                                    <td>
                                                        <span className="badge bg-secondary fs-7">
                                                            {item.dias_para_vencer} días
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold">{item.stock} {item.simbolo}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pestaña: Sugerencias FIFO */}
                    {tabAlertaActiva === "fifo" && (
                        <div className="p-3">
                            <div className="alert alert-primary d-flex align-items-center gap-2 mb-3">
                                <FaInfoCircle />
                                <span>
                                    <strong>Criterio FIFO (First In, First Out):</strong> Orden sugerido para retirar de la despensa escolar. Los insumos con fecha de vencimiento más temprana o fecha de compra más antigua deben consumirse en primer lugar para evitar desperdicio alimentario.
                                </span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped table-hover align-middle mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Orden FIFO</th>
                                            <th>Insumo</th>
                                            <th>Proveedor</th>
                                            <th>Fecha Compra</th>
                                            <th>Vencimiento</th>
                                            <th>Stock Actual</th>
                                            <th>Estado Rotación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alertasVencimiento?.sugerenciasFIFO?.map((item, idx) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <span className="badge bg-primary rounded-circle p-2">#{idx + 1}</span>
                                                </td>
                                                <td className="fw-bold">{item.producto}</td>
                                                <td>{item.razon_social || "Sin proveedor"}</td>
                                                <td>{item.fecha_desde ? item.fecha_desde.substring(0, 10) : "---"}</td>
                                                <td className="fw-bold">
                                                    {item.fecha_vencimiento ? (
                                                        <span className={item.dias_para_vencer <= 3 ? "text-danger" : item.dias_para_vencer <= 7 ? "text-warning" : "text-success"}>
                                                            {parsearFechaDate(item.fecha_vencimiento)} ({item.dias_para_vencer} d)
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted">Sin vencimiento</span>
                                                    )}
                                                </td>
                                                <td className="fw-bold">{item.stock} {item.simbolo}</td>
                                                <td>
                                                    <span className="badge bg-success-subtle text-success border border-success">
                                                        Rotar Lote
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* SECCIÓN 4: CONTROL DE STOCK DE DESPENSA */}
            <div className="row g-4">
                {/* Stock Agotado o Negativo */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-header bg-danger text-white p-3 d-flex justify-content-between align-items-center rounded-top-4">
                            <div className="d-flex align-items-center gap-2">
                                <FaExclamationTriangle />
                                <h6 className="mb-0 fw-bold">Stock Agotado o Negativo ({insumosAgotados.length})</h6>
                            </div>
                            <small className="badge bg-white text-danger fw-bold">Descuento de producción</small>
                        </div>
                        <div className="card-body p-0">
                            {insumosAgotados.length === 0 ? (
                                <div className="p-4 text-center text-success fw-bold">
                                    No hay insumos agotados en la despensa.
                                </div>
                            ) : (
                                <div className="list-group list-group-flush rounded-bottom-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    {insumosAgotados.map(ins => (
                                        <div key={ins.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <div>
                                                <strong className="text-dark d-block">{ins.producto}</strong>
                                                <small className="text-secondary">{ins.marca || "Sin marca"}</small>
                                            </div>
                                            <div className="text-end">
                                                <span className={`badge ${parseFloat(ins.stock) < 0 ? "bg-danger" : "bg-dark"} fs-6 p-2 rounded-3`}>
                                                    {ins.stock} {ins.simbolo || ''}
                                                </span>
                                                <small className="d-block text-danger fw-bold mt-1">
                                                    {parseFloat(ins.stock) < 0 ? "⚠️ Negativo (Falta Factura)" : "Agotado"}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stock Crítico (1 a 5) */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-header bg-warning text-dark p-3 d-flex justify-content-between align-items-center rounded-top-4">
                            <div className="d-flex align-items-center gap-2">
                                <FaBoxOpen />
                                <h6 className="mb-0 fw-bold">Stock Bajo / Crítico (≤ 5) ({insumosCriticos.length})</h6>
                            </div>
                            <small className="badge bg-dark text-white fw-bold">Reponer pronto</small>
                        </div>
                        <div className="card-body p-0">
                            {insumosCriticos.length === 0 ? (
                                <div className="p-4 text-center text-success fw-bold">
                                    Todos los demás insumos cuentan con stock superior a 5 unidades.
                                </div>
                            ) : (
                                <div className="list-group list-group-flush rounded-bottom-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    {insumosCriticos.map(ins => (
                                        <div key={ins.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <div>
                                                <strong className="text-dark d-block">{ins.producto}</strong>
                                                <small className="text-secondary">{ins.marca || "Sin marca"}</small>
                                            </div>
                                            <div className="text-end">
                                                <span className="badge bg-warning text-dark fs-6 p-2 rounded-3 border border-warning-subtle">
                                                    {ins.stock} {ins.simbolo || ''}
                                                </span>
                                                <small className="d-block text-warning-emphasis fw-bold mt-1">Nivel bajo</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;