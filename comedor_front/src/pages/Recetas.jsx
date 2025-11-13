import { useEffect, useState } from "react";
import { changeStateRecetaById, getRecetas } from "../services/api";
import ListaRecetas from "../components/ListaRecetas";
import Swal from "sweetalert2";

const Recetas = () => {
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecetas = async () => {
            try {
                const respuesta = await getRecetas();
                let recipes = respuesta.reduce((acc, el) => {
                    if(!acc[el.id]){
                        acc[el.id] = {id: el.id, nombre:el.nombre, estado: el.estado, descripcion: el.descripcion, insumos: []}
                    }
                    acc[el.id].insumos.push({producto: el.producto, cantidad: el.cantidad, simbolo: el.simbolo, insumo_id: el.insumo_id}); 
                    return acc;
                }, {});
                recipes = Object.values(recipes);
                setRecetas(recipes);
            } catch (err) {
                console.log(err);
                setError("Error al obtener recetas");
            } finally {
                setLoading(false);
            }
        };
        loadRecetas();
    }, [])

    const handleChangeState = async (id, state) => {
        const res = await Swal.fire({ icon:"warning", title: `Seguro desea darla de ${state==1?"baja":"alta"}`, showCancelButton:true, cancelButtonText:"Cancelar", confirmButtonText:"Si" });
        if(res.isConfirmed){
            try {
                const resultado = await changeStateRecetaById(id, state);
                await Swal.fire({icon:"success", title: resultado, timer:2000});
                setRecetas(recetas.map(r => {
                    if(r.id == id){
                        return {...r, estado: r.estado == 1? 0 : 1}  
                    } 
                    return r;
                }));
            } catch (err) {
                await Swal.fire({ icon:"error", title: err.response.data.error });
            }
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Listado de recetas</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<ListaRecetas recetas={recetas} onClickStateButton={handleChangeState}/>)
            }
        </div>
    </>

}

export default Recetas;