import { useEffect, useState } from "react";
import ListaCompras from "../components/ListaCompras";

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCompras = async () => {
            try {
                // const compras = await getInsumos();
                setCompras([])
            } catch (err) {
                console.log(error);
                setError("Error al cargar las compras realizadas");
            } finally {
                setLoading(false);
            }
        };
        loadCompras();
    }, [])

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Listado de compras</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<ListaCompras compras={compras}/>)
            }
        </div>
    </>
}

export default Compras;