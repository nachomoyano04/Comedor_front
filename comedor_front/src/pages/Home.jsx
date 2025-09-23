import InsumoCard from "../components/InsumoCard";
import { getInsumos } from "../services/api";
import { useEffect, useState } from "react";
const Home = () => {
    const [insumos, setInsumos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadInsumos = async() => {
            try {
                const ins = await getInsumos();
                setInsumos(ins);   
            } catch (error) {
                console.log(error);
                setError("Error al obtener insumos");
            } finally{
                setLoading(false);
            }
        }
        loadInsumos();
    }, []);
    return (
        <div className="container-text-center">
            {error && <span className="bs-danger">{error}</span>}
            {loading? 
                (<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>):
                (<div className="row border border-primary">
                    {insumos.map(i => <InsumoCard insumo={i} key={i.id}/>)}
                </div>)
            }    
        </div>
    )
}

export default Home;