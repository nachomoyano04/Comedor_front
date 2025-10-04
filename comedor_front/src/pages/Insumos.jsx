import { useEffect, useState } from "react";
import { changeStateInsumoById, getInsumos } from "../services/api";
import ListaInsumos from "../components/ListaInsumos";
import { useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";

const Insumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { unidades_de_medida } = useOutletContext();

    useEffect(() => {
        const loadInsumos = async () => {
            try {
                const respuesta = await getInsumos();
                setInsumos(respuesta);
            } catch (err) {
                console.log(err);
                setError("Error al traer los insumos");
            } finally {
                setLoading(false);
            }
        }
        loadInsumos();
    }, []);

    const handleStateInsumo = (id, state) => {
        Swal.fire({
            title: "Esta seguro que quiere dar de baja el insumo?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        }).then(async res => {
            if (res.isConfirmed) {
                const resultado = await changeStateInsumoById(id, state);
                await Swal.fire({
                    title: resultado, icon: "success", timer: 1500
                });
                setInsumos(insumos.map(i => {
                    if (i.id == id) {
                        return { ...i, estado: state == 1 ? 0 : 1 }
                    }
                    return i;
                }))
            }
        })
    }

    return <>
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Lista de insumos</h5>
            </div>
            <div className="card-body">
                {error && <span className="bs-danger">{error}</span>}
                {loading ? (<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>) :
                    (<ListaInsumos insumos={insumos} unidades_de_medida={unidades_de_medida} onClickChangeStateInsumo={handleStateInsumo} />)
                }
            </div>
    </>
}

export default Insumos;