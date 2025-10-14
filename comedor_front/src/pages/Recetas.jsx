import { useEffect, useState } from "react";
import { getRecetas } from "../services/api";
import ListaRecetas from "../components/ListaRecetas";

const Recetas = () => {
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecetas = async () => {
            try {
                const respuesta = await getRecetas();
                setRecetas(respuesta);
            } catch (err) {
                console.log(err);
                setError("Error al obtener recetas");
            } finally {
                setLoading(false);
            }
        };
        loadRecetas();
    }, [])

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Listado de recetas</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<ListaRecetas recetas={recetas}/>)
            }
        </div>
    </>

}

export default Recetas;