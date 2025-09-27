import { useEffect, useState } from "react";
import { getInsumos } from "../services/api";
import ListaInsumos from "../components/ListaInsumos";

const Insumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInsumos = async () => {
            try {
                const respuesta = await getInsumos();
                setInsumos(respuesta);
            } catch (err) {
                console.log(err);
                setError("Error al traer los insumos");
            } finally{
                setLoading(false);
            }
        }
        loadInsumos();
    }, []);
        console.log(insumos);

    return <>
        <h1 className="card-title my-4">Insumo</h1>
        {error && <span className="bs-danger">{error}</span>}
        {loading?(<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                 </div>) : (<ListaInsumos insumos={insumos}/>)
        }    
    </>
}

export default Insumos;