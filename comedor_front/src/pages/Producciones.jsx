import { useEffect, useState } from "react";
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
                const fixed = resultado.reduce((acc, e) => {
                    if(!acc[e.id]){
                        const produ = {id: e.id, fecha: e.fecha, estado: e.estado, nombre: e.nombre, descripcion: e.descripcion, turno: e.turno, cantidad_comensales: e.cantidad_comensales, cantidad_producida: e.cantidad_producida, costo_primo_total: e.costo_primo_total, insumos: []};
                        acc[e.id] = produ;
                    }
                    acc[e.id].insumos.push({insumo_id: e.insumo_id, producto: e.producto, simbolo: e.simbolo, cantidad_usada: e.cantidad_usada});
                    return acc;
                }, {});
                //Las ordenamos por fecha mas reciente de produccion...
                const p = Object.values(fixed).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                setProducciones(p);
            } catch (err) {
                console.log(err);
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