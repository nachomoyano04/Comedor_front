import { useEffect, useState } from "react";
import { getPrecios, getPreciosByInsumo } from "../services/api_endpoints";
import ListaPrecios from "../components/ListaPrecios";
import { useParams } from "react-router-dom";
import ListaPreciosInsumo from "../components/ListaPreciosInsumo";
import LineApexChart from "../components/LineApexChart";

const Precios = () => {
    const {id} = useParams();
    const [precios, setPrecios] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadPrecios = async () => {
            try {
                if(id){ //necesita el historial de precios de un insumo
                    const prices = await getPreciosByInsumo(id);
                    setPrecios(prices);
                }else{
                    const prices = await getPrecios();
                    setPrecios(prices);
                }
            } catch (err) {
                console.log(err);
                setError("Error al obtener precios");
            } finally{
                setLoading(false);
            }
        }
        loadPrecios();
    }, [id])

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{id? `Historial de precios de "${precios.length>0?precios[0].producto:"- - -"}"`: `Listado de precios`}</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (id ? <><ListaPreciosInsumo historial={precios} /><LineApexChart precios={precios}/></>:<ListaPrecios precios={precios}/>)
            }
        </div>
    </>
}

export default Precios;