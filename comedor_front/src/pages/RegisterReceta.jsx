import { useEffect, useState } from "react";
import FormReceta from "../components/FormReceta";
import { getInsumos, newReceta } from "../services/api";
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom";

const RegisterReceta = () => {
    const navigate = useNavigate();
    const [insumos, setInsumos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInsumos = async () => {
            try {
                const respuesta = await getInsumos();
                const ins = respuesta.filter(i => i.estado == 1).map(i => {return {value: i.id, label: i.producto}});
                setInsumos(ins);
            } catch (err) {
                console.log(err);
                setError("Error al cargar los insumos");
            } finally {
                setLoading(false);
            }
        }
        loadInsumos();
    }, []);

    const handleSubmitReceta = async formData => {
        const res = await Swal.fire({
            icon: "warning",
            title: "Seguro desea registrar la receta?",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí"
        });
        if(res.isConfirmed){
            try {
                const resultado = await newReceta(formData);
                await Swal.fire({ icon: "success", title: resultado});
                navigate("/receta/listado")
            } catch (err) {
                Swal.fire({icon:"error", title: err.response.data});
            }
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Nueva receta</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<FormReceta ins={insumos} onSubmit={handleSubmitReceta}/>)
            }
        </div>
    </>
}

export default RegisterReceta;