import { useEffect, useState } from "react";
import { getInsumos, getProveedores, newCompra } from "../services/api_endpoints";
import FormCompra from "../components/FormCompra";
import Swal from "sweetalert2";
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

    const handleSubmit = async formData => {
        const res = await Swal.fire({
            icon: "warning",
            title: "Seguro desea registrar esta compra?",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        });
        if(res.isConfirmed){
            try {
                const {insumo_nombre, proveedor_razon_social, precio_total, ...compra} = formData;
                const resultado = await newCompra(compra); //Debo registrar la compra y modificar el stock del insumo
                await Swal.fire({ icon: "success", title: resultado });
                navigate("/insumos/compras");
            } catch (err) {
                await Swal.fire({icon: "error", title: err.response.data.error});                
            }
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
                    (<FormCompra insumos={ins} udm={unidades_de_medida} proveedores={proveedores} onSubmit={handleSubmit}/>)
                }
            </div>
    </>
}

export default RegisterCompra;