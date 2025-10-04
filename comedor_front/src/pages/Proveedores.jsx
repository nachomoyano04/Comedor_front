import { useEffect, useState } from "react";
import { getProveedores } from "../services/api";
import ListaProveedores from "../components/ListaProveedores";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProveedores = async () => {
            try {
                const provs = await getProveedores();
                setProveedores(provs);
            } catch (err) {
                console.log(err);
                setError("Error al obtener los proveedores");
            } finally {
                setLoading(false);
            }
        }
        loadProveedores();
    }, []);

    const handleStateProv = (id, estado) => {
        console.log("RAW");
    }

    return <>
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Lista de proveedores</h5>
            </div>
            <div className="card-body">
                {error && <span className="bs-danger">{error}</span>}
                {loading ? (<div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>) : 
                (<ListaProveedores proveedores={proveedores} onClickChangeStateProveedor={handleStateProv} />)
                }
            </div>
    </>
}

export default Proveedores;