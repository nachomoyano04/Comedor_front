import { Outlet } from "react-router-dom";
import {useState, useEffect} from "react";
import { getUdm } from "../services/api";

const LayoutInsumos = () => {
    const [unidades_de_medida, setUnidades_de_medida] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInsumos = async () => {
            try {
                const answer = await getUdm();
                setUnidades_de_medida(answer);
            } catch (err) {
                console.log(err);
                setError("Error al obtener unidades de medida");
            } finally {
                setLoading(false);
            }
        }
        loadInsumos();
    }, []);

    return <div>
        <h1>Gestion de insumos</h1>
            {error && <span className="bs-danger">{error}</span>}
            {loading ?
            (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                <Outlet context={{unidades_de_medida}} />
            }
    </div>
}

export default LayoutInsumos;