import { useEffect, useState } from "react";
import { getInsumos, getProveedores, newCompra } from "../services/api_endpoints";
import FormCompra from "../components/FormCompra";
import notify from "../utils/notify";
import { useNavigate, useOutletContext } from "react-router-dom";

const RegisterCompra = () => {
    const navigate = useNavigate();
    const {insumos} = useOutletContext();
    const {unidades_de_medida} = useOutletContext();
    const [ins, setIns] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInsumosYProveedores = async () => {
            try {
                const provs = await getProveedores();
                const proves = provs.filter(p => p.estado == 1).map(p => {
                    return {name: "proveedor_id", value: p.id, label: p.razon_social}
                });
                const i = insumos.filter(i => i.estado == 1).map(i => {
                    return {name: "insumo_id", value: i.id, label: i.producto, id_udm: i.id_unidad_de_medida}
                }); 
                setProveedores(proves);
                setIns(i);
            } catch (err) {
                console.log(error);
                setError("Error al cargar insumos y proveedores");
            } finally {
                setLoading(false);
            }
        };
        loadInsumosYProveedores();
    }, [])

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async formData => {
        const confirmado = await notify.confirm({
            title: "¿Registrar compra?",
            text: "Se registrará el precio y se actualizará el stock del insumo.",
            confirmButtonText: "Sí, registrar"
        });
        if (!confirmado) return;

        setSubmitting(true);
        try {
            const {insumo_nombre, proveedor_razon_social, precio_total, ...compra} = formData;
            if (!compra.fecha_vencimiento) {
                delete compra.fecha_vencimiento;
            }
            const resultado = await newCompra(compra);
            notify.success(typeof resultado === "string" ? resultado : "¡Compra registrada con éxito!");
            navigate("/insumos/compras");
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data || err.message || "Error al registrar compra";
            notify.error(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setSubmitting(false);
        }
    }

    return <>
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Compra de insumo</h5>
            </div>
            <div className="card-body">
                {error && <span className="bs-danger">{error}</span>}
                {loading ? (<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>) :
                    (<FormCompra insumos={ins} udm={unidades_de_medida} proveedores={proveedores} onSubmit={handleSubmit} submitting={submitting}/>)
                }
            </div>
    </>
}

export default RegisterCompra;