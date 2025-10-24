import { useEffect } from "react";
import ListaProducciones from "../components/ListaProducciones";
import { getProducciones } from "../services/api";

const Producciones = () => {
    const [producciones, setProducciones] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducciones = async () => {
            try {
                const resultado = await getProducciones(); 
                setProducciones(resultado);
            } catch (err) {
                setError("Error al obtener producciones");
            } finally {
                setLoading(false);
            }
        }
        loadProducciones();
    }, []);

    const handleChangeState = (id, state) => {

    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Listado de producciones</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<ListaProducciones producciones={producciones} onClickStateButton={handleChangeState} />)
            }
        </div>
    </>
}

export default Producciones;