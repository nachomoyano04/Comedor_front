import { useEffect, useState } from "react";
import { getInsumos, getProveedores } from "../services/api";
import FormCompra from "../components/FormCompra";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RegisterCompra = () => {
    const navigate = useNavigate();
    const [insumos, setInsumos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInsumosYProveedores = async () => {
            try {
                const ins = await getInsumos();
                const provs = await getProveedores();
                const insu = ins.filter(i => i.estado == 1).map(i => {
                    return {name: "insumo_id", value: i.id, label: i.producto}
                }); 
                const proves = provs.filter(p => p.estado == 1).map(p => {
                    return {name: "proveedor_id", value: p.id, label: p.razon_social}
                });
                setInsumos(insu);
                setProveedores(proves);
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
            // const resultado = await newCompra(); //Debo registrar la compa y modificar el stock del insumo
            console.log(formData);
            await Swal.fire({
                icon: "success",
                text: "Compra realizada con exito"       
            });
            navigate("/insumos/compras");
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
                    (<FormCompra insumos={insumos} proveedores={proveedores} onSubmit={handleSubmit}/>)
                }
            </div>
    </>
}

export default RegisterCompra;