import { useEffect, useState } from "react";
import FormReceta from "../components/FormReceta";
import { getInsumos } from "../services/api";

const RegisterReceta = () => {
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

    const handleSubmitReceta = formData => {
        console.log(formData);
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