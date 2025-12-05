import { useState } from "react"
import Select from "react-select"

const FormCalculadora = ({ recetas }) => {
    const [cantidadC, setCantidadC] = useState(1);
    const [recetaOriginal, setRecetaOriginal] = useState(null);
    const [insumos, setInsumos] = useState(null);
    const [calcular, setCalcular] = useState(false);

    const handleBtnCalcular = () => {
        setCalcular(!calcular);
        if(recetaOriginal && cantidadC > 0){
            setInsumos(recetaOriginal.insumos.map(i => {
                return {...i, cantidad: (cantidadC * Number(i.cantidad) / recetaOriginal.cuantos_comen).toFixed(2)}
            }))
        }
    }

    const handleBtnLimpiar = () => {
        setCantidadC(1);
        setRecetaOriginal(null);
        setInsumos(null);
        setCalcular(false);
    }

    const handleChange = e => {
        if (!e.target) { //cambia la receta
            setRecetaOriginal(e);
        } else { //cambia la cantidad de comensales
            const cantidad = e.target.value;
            setCantidadC(cantidad);
        }
    }

    return <form className="row g-3">
        <div className="col-md-6">
            <label className="form-label">Receta</label>
            <Select required name="receta" value={recetaOriginal} onChange={handleChange} options={recetas}></Select>
        </div>
        <div className="col-md-6">
            <label className="form-label">Cantidad comensales</label>
            <input name="cantidad_comensales" value={cantidadC} onChange={handleChange} type="number" maxLength={"2"} className="form-control" required />
        </div>
        {insumos && <div className="col-md-8 mb-3">
            <label className="form-label fw-semibold">Cantidad de insumos a comprar para "{recetaOriginal.label}"</label>
            <ul className="list-group shadow-sm rounded-4 overflow-hidden">
                {insumos.map((l) => (
                    <li key={l.value} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
                        <div className="d-flex align-items-center flex-grow-1">
                            <span className="fw-medium">{l.label}</span>
                        </div>
                        <div className="d-flex align-items-center ms-3">
                            <input type="number" name="insumo" data-id={l.value} value={l.cantidad || 0} onChange={handleChange} className="form-control form-control-sm text-end" style={{ width: "150px" }} placeholder={"cantidad (" + l.simbolo + ")"} required />
                            <small className="ms-2 text-muted">{l.simbolo}</small>
                        </div>
                    </li>
                ))}
            </ul>
        </div>}
        <div className="col-12 d-flex justify-content-end gap-2">
            <button className="btn btn-primary" type="button" onClick={handleBtnCalcular} disabled={!recetaOriginal || cantidadC < 1}>Calcular</button>
            <button className="btn btn-secondary" type="button" onClick={handleBtnLimpiar}>Limpiar</button>
        </div>
    </form>
}

export default FormCalculadora;