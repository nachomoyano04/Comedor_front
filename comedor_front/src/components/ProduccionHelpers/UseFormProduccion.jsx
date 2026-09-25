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
        const cantProd = parseFloat(formData.cantidad_producida) || 1;
        const insumosCalculados = e?.insumos ? cambiarCantInsumos(e.insumos, cantProd) : [];
        setFormData({
            ...formData,
            fecha: e ? horaActual : "",
            insumos: insumosCalculados,
            receta_id: e ? e.value : "",
            turno: ""
        });
        setTurno(null);
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
        if (name == "cantidad_producida") {
            const soloNumeros = value.replace(/\D/g, "");
            if (soloNumeros.length > 4 || Number(soloNumeros) > 1000) return;
            let newFormData;
            if (soloNumeros && soloNumeros !== "0") {
                const cantidad = parseFloat(soloNumeros);
                const insumosConCantidad = isEditing 
                    ? (produccionOriginal?.insumos ? cambiarCantInsumos(produccionOriginal.insumos, cantidad) : formData.insumos) 
                    : (receta?.insumos ? cambiarCantInsumos(receta.insumos, cantidad) : formData.insumos);
                newFormData = { ...formData, cantidad_producida: Number(soloNumeros), insumos: insumosConCantidad };
            } else {
                newFormData = { ...formData, cantidad_producida: soloNumeros === "" ? "" : 0, insumos: isEditing ? (produccionOriginal?.insumos || formData.insumos) : (receta?.insumos || []) };
            }
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && newFormData.cantidad_comensales > 0);
            setFormData(newFormData);
        }
        if (name == "cantidad_comensales") {
            const soloNumeros = value.replace(/\D/g, "");
            if (soloNumeros.length > 5 || Number(soloNumeros) > 10000) return;
            const newFormData = { ...formData, cantidad_comensales: soloNumeros === "" ? "" : Number(soloNumeros) };
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && Number(soloNumeros) > 0);
            setFormData(newFormData);
        }
        if (name == "insumo") {
            const insumo_id = e.target.getAttribute("data-id");
            const newFormData = { ...formData, insumos: formData.insumos.map(i => i.value == insumo_id ? { ...i, cantidad: value === "" ? "" : Number(value) } : i) };
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
            setInsAAgregar({value: insAAgregar.value, cantidad: cantidad_insumo, label: insAAgregar.label, simbolo: insAAgregar.simbolo});
        } else { //esta eligiendo insumo
            setInsAAgregar(e);
        }
    }

    return {
        receta, handleSelectReceta, isEditing, formData, handleChangeModalInsumo, handleClickModal, insAAgregar, insumosDisponibles, handleChange, opcionesTurno, turno, handleSelectTurno, areChanges, handleReset, handleClickBtnListaInsumos
    }
}