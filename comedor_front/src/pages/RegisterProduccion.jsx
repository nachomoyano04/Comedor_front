import { useEffect, useState } from "react";
import FormProduccion from "../components/FormProduccion";
import { getRecetas, newProduccion } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RegisterProduccion = () => {
    const navigate = useNavigate();
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecetas = async () => {
            try {
                const resultado = await getRecetas();
                let recipes = resultado.reduce((acc, el) => {
                    if(!acc[el.id]){
                        acc[el.id] = {value: el.id, label:el.nombre, estado: el.estado, insumos: []}
                    }
                    acc[el.id].insumos.push({label: el.producto, cantidad: el.cantidad, simbolo: el.simbolo, value: el.insumo_id}); 
                    return acc;
                }, {});
                recipes = Object.values(recipes);
                setRecetas(recipes.filter(r => r.estado == 1));
            } catch (err) {
                console.log(err);
                setError("Error al cargar recetas");
            } finally {
                setLoading(false);
            }
        }
        loadRecetas();
    }, []);

    const handleSubmitProduccion = async formData => {
        const res = await Swal.fire({
            title: "Seguro desea registrar la produccion?",
            icon: "warning", 
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        });
        if(res.isConfirmed){
            try {
                const r = await newProduccion(formData);
                Swal.fire({title: r, icon: "success", timer: 2000});
                navigate("/produccion/listado");
            } catch (err) {
                const {error} = err.response.data;
                Swal.fire({title: error, icon: "error"});
            }
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Registrar Producción</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
                {loading ? (<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>) :
                    (<FormProduccion recetas={recetas} onSubmit={handleSubmitProduccion}/>)
                }
            
        </div>
    </>
}

export default RegisterProduccion;