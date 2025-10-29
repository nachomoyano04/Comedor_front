import { useEffect, useState } from "react";
import ListaProducciones from "../components/ListaProducciones";
import { changeStateProduccionById, getProducciones } from "../services/api";
import Swal from "sweetalert2"

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
                console.log(p)
            } catch (err) {
                console.log(err);
                setError("Error al obtener producciones");
            } finally {
                setLoading(false);
            }
        }
        loadProducciones();
    }, []);

    const handleChangeState = async (id, state) => {
        const res = await Swal.fire({
            icon: "warning",
            title: `Seguro desea ${state == 1 ? "dar de baja": "dar de alta"} la produccion?`,
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        });
        if(res.isConfirmed){
            try {
                const respuesta = await changeStateProduccionById(id, state);
                await Swal.fire({icon:"success", title: respuesta, timer: 2000});
                setProducciones(producciones.map(p => {
                    if(p.id == id){
                        return {...p, estado: state == 1? 0 : 1}
                    }
                    return p;
                }));
                //Modificar producciones... cambiar estado a la de id: id
            } catch (error) {
                Swal.fire({icon:"error", title: error.response.data.error, timer:2000});                
            }
        }
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