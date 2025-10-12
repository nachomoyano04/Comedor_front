import { useEffect, useState } from "react";
import { getPrecios } from "../services/api";
import ListaPrecios from "../components/ListaPrecios";

const Precios = () => {
    const [precios, setPrecios] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadPrecios = async () => {
            try {
                const prices = await getPrecios();
                console.log(prices);
                setPrecios(prices);
            } catch (err) {
                console.log(err);
                setError("Error al obtener precios");
            } finally{
                setLoading(false);
            }
        }
        loadPrecios();
    }, [])

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Listado de precios</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<ListaPrecios precios={precios}/>)
            }
        </div>
    </>
}

export default Precios;