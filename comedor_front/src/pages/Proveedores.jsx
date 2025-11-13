import { useEffect, useState } from "react";
import { changeStateProveeById, getProveedores } from "../services/api";
import ListaProveedores from "../components/ListaProveedores";
import Swal from "sweetalert2";

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

    const handleStateProv = async (id, state) => {
        const res = await Swal.fire({ title: `Esta seguro que desea dar de ${state == 1? "Baja":"Alta"} el proveedor?`, icon: "warning", confirmButtonText: "Si", cancelButtonText: "Cancelar", showCancelButton: true })
        if(res.isConfirmed){
            try {
                const respuesta = await changeStateProveeById(id, state);
                await Swal.fire({icon: "success", title: respuesta});
                setProveedores(proveedores.map(p => {
                    if(p.id == id){
                        return {...p, estado: state == 1 ? 0 : 1}; 
                    }
                    return p;
                }));
            } catch (err) {
                await Swal.fire({ icon: "error", title: err.response.data.error });   
            }
        }
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