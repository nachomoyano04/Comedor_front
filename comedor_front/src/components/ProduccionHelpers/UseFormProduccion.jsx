import { useState } from "react";
import {isEqual} from "lodash"

export const useFormProduccion = ({ produccion, recetas, insumosBD }) => {
    const isEditing = produccion != null;
    const opcionesTurno = [{ value: "mañana", label: "Mañana" }, { value: "tarde", label: "Tarde" }, { value: "noche", label: "Noche" }];
    const horaActual = new Date().toLocaleString('sv', { hour12: false }).slice(0, 16);
    const [formData, setFormData] = useState({ cantidad_comensales: isEditing ? produccion.cantidad_comensales : "", cantidad_producida: isEditing ? produccion.cantidad_producida : "", receta_id: isEditing ? produccion.receta_id : "", turno: isEditing ? produccion.turno : "", insumos: isEditing ? produccion.insumos : [], fecha: isEditing ? produccion.fecha : ""});
    const [receta, setReceta] = useState(isEditing ? recetas.find(r => r.value == produccion.receta_id) : null);
    const [turno, setTurno] = useState(isEditing ? opcionesTurno.find(ot => ot.value == produccion.turno) : null);
    const [areChanges, setAreChanges] = useState(false);
    const [insAAgregar, setInsAAgregar] = useState(null);
    const insumosDisponibles = insumosBD?.filter(i => !(formData.insumos.some(ins => ins.value == i.value)));

    let restProduccion;
    if(isEditing){
        let { id, costo_primo_total, descripcion, estado, nombre, ...rest } = produccion;
        restProduccion = rest;
    }
    const [produccionOriginal, setProduccionOriginal] = useState(() => {
        if(isEditing){
            let { id, costo_primo_total, descripcion, estado, nombre, ...rest } = produccion;
            return rest;
        }
        return null;
    });

    const handleSelectReceta = e => {
        setReceta(e);
        if (!e) {
            setFormData({ fecha: "", cantidad_comensales: "", cantidad_producida: "", insumos: [], turno: null, receta_id: "" })
            setTurno(null);
            return;
        };
        const recetaDiferente = !produccion || produccion.receta_id != e.value
        let formActualizado;
        if (recetaDiferente) {
            setTurno(null);
            formActualizado = { ...formData, cantidad_producida: "", insumos: e.insumos, cantidad_comensales: "", turno: "", receta_id: e.value, fecha: horaActual };
        } else {
            setTurno(opcionesTurno.find(ot => ot.value == produccionOriginal.turno) || null);
            formActualizado = { ...formData, receta_id: produccionOriginal.receta_id, cantidad_producida: produccionOriginal.cantidad_producida, turno: produccionOriginal.turno, insumos: produccionOriginal.insumos, cantidad_comensales: produccionOriginal.cantidad_comensales, fecha: produccionOriginal.fecha };
        }
        isEditing && setAreChanges(!isEqual(restProduccion, formActualizado));
        setFormData(formActualizado);
    }

    const cambiarCantInsumos = (insumos, cantidad) => {
        const cantidad_producida_de_receta = parseFloat(isEditing ? produccionOriginal.cantidad_producida : 1);
        return insumos.map(i => {
            const cantidadBase = parseFloat(i.cantidad) / cantidad_producida_de_receta;
            return { ...i, cantidad: Number((cantidadBase * cantidad).toFixed(2)) };
        }).sort((a,b) => a.value - b.value);
    }

    const handleChange = e => {
        const {name, value} = e.target;
        if (name == "cantidad_producida" && formData.insumos.length > 0 && receta && value <= 1000 && value.length < 5) {
            const soloNumeros = value.replace(/\D/g, "");
            if(soloNumeros.length > 4 || soloNumeros > 1000) return;
            let newFormData;
            if (soloNumeros && soloNumeros != 0) { //acá hacemos el producto entre la cantidad de produccion y la cantidad en cada insumo
                const cantidad = parseFloat(soloNumeros);
                const insumosConCantidad = isEditing ? cambiarCantInsumos(produccionOriginal.insumos, cantidad) : cambiarCantInsumos(receta.insumos, cantidad);
                newFormData = {...formData, cantidad_producida: Number(soloNumeros), insumos: insumosConCantidad };
            } else {
                newFormData = {...formData, cantidad_producida: "", insumos: isEditing ? formData.insumos : receta.insumos };
            }
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion));
            setFormData(newFormData)
        }
        if (name == "cantidad_comensales" && value <= 10000 && value.length < 6) {
            const newFormData = { ...formData, cantidad_comensales: Number(value.replace(/[^0-9]/g, '')) }
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && value > 0);
            setFormData(newFormData)
        }
        if (name == "insumo") {
            const insumo_id = e.target.getAttribute("data-id");
            const newFormData = { ...formData, insumos: formData.insumos.map(i => i.value == insumo_id ? { ...i, cantidad: Number(value) } : i) }
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && newFormData.cantidad_comensales > 0 && newFormData.cantidad_producida > 0);
            setFormData(newFormData);
        }
        if (name == "fecha") {
            const newFormData = { ...formData, fecha: value };
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && newFormData.cantidad_comensales > 0 && newFormData.cantidad_producida > 0);
            setFormData(newFormData);
        }
    }

    //Resetear al formulario original
    const handleReset = () => {
        setFormData({ cantidad_comensales: isEditing ? produccion.cantidad_comensales : "", cantidad_producida: isEditing ? produccion.cantidad_producida : "", receta_id: isEditing ? produccion.receta_id : "", turno: isEditing ? produccion.turno : "", insumos: isEditing ? produccion.insumos : [], fecha: isEditing ? produccion.fecha : "" });
        setTurno(isEditing ? opcionesTurno.find(ot => ot.value == produccion.turno) : null);
        setReceta(isEditing ? recetas.find(r => r.value == produccion.receta_id) : null);
        isEditing && setAreChanges(false);
    }

    //Eliminar insumo al tocar boton 
    const handleClickBtnListaInsumos = i => {
        const newFormData = { ...formData, insumos: formData.insumos.filter(ins => ins.value != i.value) };
        setProduccionOriginal(prev => ({...prev, insumos: prev.insumos.filter(ins => ins.value != i.value)}))
        isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && newFormData.cantidad_comensales > 0 && newFormData.cantidad_producida > 0);
        setFormData(newFormData);
    }

    //Actualizamos el form data con el turno elegido
    const handleSelectTurno = e => {
        setTurno(e);
        if (!e) return;
        const newFormData = { ...formData, turno: e.value };
        isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && newFormData.cantidad_comensales > 0 && newFormData.cantidad_producida > 0);
        setFormData(newFormData);
    }

    /* Logica modal*/
    const handleClickModal = () => {
        const insumoAAgregarActualizado = { ...insAAgregar, cantidad: Number((insAAgregar.cantidad * Number(formData.cantidad_producida)).toFixed(1)) };
        setInsAAgregar(insumoAAgregarActualizado);
        setProduccionOriginal(prev => ({...prev, insumos: [...prev.insumos, insumoAAgregarActualizado].sort((a,b) => a.value-b.value)}));
        const newFormData = { ...formData, insumos: [...formData.insumos, insumoAAgregarActualizado].sort((a,b) => a.value-b.value) };
        setFormData(newFormData)
        isEditing && setAreChanges(!isEqual(newFormData, restProduccion));
        setInsAAgregar(null);
    }

    const handleChangeModalInsumo = e => {
        if (e.target) { //esta cambiando la cantidad
            const cantidad_insumo = Number(e.target.value);
            const newInsumo = {value: insAAgregar.value, cantidad: cantidad_insumo, label: insAAgregar.label, simbolo: insAAgregar.simbolo};
            setInsAAgregar(newInsumo);
        } else { //esta eligiendo insumo
            setInsAAgregar(e);
        }
    }

    return {
        receta, handleSelectReceta, isEditing, formData, handleChangeModalInsumo, handleClickModal, insAAgregar, insumosDisponibles, handleChange, opcionesTurno, turno, handleSelectTurno, areChanges, handleReset, handleClickBtnListaInsumos
    }
}