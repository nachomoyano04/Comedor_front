import { useCallback, useEffect, useState } from "react";
import ListaCompras from "../components/ListaCompras";
import { deleteCompra, getInsumos, getPreciosByInsumo } from "../services/api";
import Swal from "sweetalert2";
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
        const res = await Swal.fire({
            icon: "warning",
            title: `Seguro desea eliminar la compra?`
        });
        if(res.isConfirmed){
            const resultado = await deleteCompra(id);
            await Swal.fire({
                icon: "success",
                title: resultado,
                timer: 2000
            });
            setCompras(compras.filter(c => c.id != id));
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