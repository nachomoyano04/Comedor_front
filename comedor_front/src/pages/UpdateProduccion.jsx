import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getProduccionById, updateProduccion } from "../services/api";
import FormProduccion from "../components/FormProduccion";
import Swal from "sweetalert2"

const UpdateProduccion = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {recetas} = useOutletContext();
    const [produccion, setProduccion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProdu = async () => {
            try {
                let resultado = await getProduccionById(id);
                resultado = resultado.reduce((acc, e) => {
                    if(acc.length == 0){
                        acc = {id: e.id, cantidad_comensales: e.cantidad_comensales, cantidad_producida: e.cantidad_producida, costo_primo_total: e.costo_primo_total, descripcion: e.descripcion, estado: e.estado, fecha: e.fecha, nombre: e.nombre, receta_id: e.receta_id, turno: e.turno, insumos: []};
                    }
                    acc.insumos.push({value: e.insumo_id, cantidad: e.cantidad_usada, label: e.producto, simbolo: e.simbolo})
                    return acc;
                }, [])
                setProduccion(resultado);
            } catch (err) {
                console.log(err);
                setError("Error al obtener producción");
            } finally{
                setLoading(false);
            }
        }
        loadProdu();
    }, []);

    const handleSubmitProduccion = async formData => {
        try {
            console.log(formData);
            const res = await updateProduccion(id, formData);
            await Swal.fire({icon: "success", title: res, timer: 2000});
            navigate("/produccion/listado");
        } catch (err) {
            Swal.fire({ icon: "error", title: err.response.data.error, timer: 2000 })
        }
    }

    return <>
        <div className="card-header bg-warning">
            <h5 className="mb-0">Editar Producción</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
                {loading ? (<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>) :
                    (<FormProduccion recetas={recetas} produccion={produccion} onSubmit={handleSubmitProduccion}/>)
                }
        </div>
    </>
}

export default UpdateProduccion;