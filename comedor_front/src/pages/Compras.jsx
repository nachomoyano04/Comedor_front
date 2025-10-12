import { useEffect, useState } from "react";
import ListaCompras from "../components/ListaCompras";
import { deleteCompra, getInsumos, getPreciosByInsumo } from "../services/api";
import Swal from "sweetalert2";

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [insumos, setInsumos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCompras = async () => {
            try {
                const i = await getInsumos();
                const c = await getPreciosByInsumo(i[0].id); //le pasamos el primer insumo para ver la lista de precios
                setCompras(c);
                const insu = i.map(ins => {return {value: ins.id, label: ins.producto}});
                setInsumos(insu);
            } catch (err) {
                console.log(error);
                setError("Error al cargar las compras realizadas");
            } finally {
                setLoading(false);
            }
        };
        loadCompras();
    }, [])

    const handleChangeInsumo = async (e) => {
        const c = await getPreciosByInsumo(e.value);
        setCompras(c.length > 0? c : [])
    }

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
                (<ListaCompras insumos={insumos} onChangeInsumo={handleChangeInsumo} compras={compras} onClickDeleteCompra={handleDeleteCompra}/>)
            }
        </div>
    </>
}

export default Compras;