import { useCallback, useEffect, useState } from "react";
import ListaCompras from "../components/ListaCompras";
import { deleteCompra, getPreciosByInsumo } from "../services/api_endpoints";
import notify from "../utils/notify";
import { useOutletContext } from "react-router-dom";

const Compras = () => {
    const {insumos} = useOutletContext();
    const [compras, setCompras] = useState([]);
    const [ins, setIns] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCompras = async () => {
            try {
                const  i = insumos.map(i => {return {value: i.id, label: i.producto}});
                setIns(i);
                if(insumos.length > 0){
                    const c = await getPreciosByInsumo(insumos[0].id); //le pasamos el primer insumo para ver la lista de precios
                    setCompras(c);
                }
            } catch (err) {
                console.log(error);
                setError("Error al cargar las compras realizadas");
            } finally {
                setLoading(false);
            }
        };
        loadCompras();
    }, [])

    const handleChangeInsumo = useCallback(async (e) => {
        try {
            const c = await getPreciosByInsumo(e.value);
            setCompras(c.length > 0? c : [])
        } catch (err) {
            setError(`Error al cambiar el insumo: ${err}`)
            setCompras([]);
        }
    }, []); 

    const handleDeleteCompra = async id => {
        const confirmado = await notify.confirm({
            title: "¿Eliminar compra?",
            text: "¿Estás seguro de que deseas eliminar este registro de compra?",
            confirmButtonText: "Sí, eliminar"
        });
        if (confirmado) {
            try {
                const resultado = await deleteCompra(id);
                notify.success(typeof resultado === "string" ? resultado : "Compra eliminada");
                setCompras(prev => prev.filter(c => c.id != id));
            } catch (err) {
                notify.error(err.response?.data?.error || "Error al eliminar la compra");
            }   
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Listado de compras</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<ListaCompras insumos={ins} onChangeInsumo={handleChangeInsumo} compras={compras} onClickDeleteCompra={handleDeleteCompra}/>)
            }
        </div>
    </>
}

export default Compras;