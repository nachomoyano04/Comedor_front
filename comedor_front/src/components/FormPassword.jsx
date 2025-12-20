import { useState } from "react";

const FormPassword = ({ onSubmit }) => {
    const [formData, setFormData] = useState({ actual: "", nueva: "", nueva2: "" });
    const [borderRepetida, setBorderRepetida] = useState("1px solid red");

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        //Chequeamos de que el campo nueva y repetir coincidan...
        setBorderRepetida(name == "nueva"? value === formData.nueva2 ? null : "1px solid red": value === formData.nueva ? null : "1px solid red");
    }

    const handleReset = () => {
        setFormData({ actual: "", nueva: "", nueva2: "" });
    }

    return <form className="row g-2" onSubmit={handleSubmit}>
        <div className="col-md-3 mb-3"></div>
        <div className="col-md-6 mb-3">
            <label className="form-label">Actual</label>
            <input name="actual" onChange={handleChange} type="password" className="form-control" value={formData.actual} required />
        </div>
        <div className="col-md-3 mb-3"></div>
        <div className="col-md-3 mb-3"></div>
        <div className="col-md-6 mb-3">
            <label className="form-label">Nueva</label>
            <input name="nueva" onChange={handleChange} type="password" className="form-control" value={formData.nueva} required />
            {formData.nueva && borderRepetida && (<div><small className="text-danger fst-italic">Las contraseñas no coinciden</small></div>)}
        </div>
        <div className="col-md-3 mb-3"></div>
        <div className="col-md-3 mb-3"></div>
        <div className="col-md-6 mb-3">
            <label className="form-label">Repetir nueva</label>
            <input name="nueva2" onChange={handleChange} type="password" style={{ border: formData.nueva && borderRepetida }} className="form-control" value={formData.nueva2} required />
            <div></div>
            {formData.nueva && borderRepetida && (<div><small className="text-danger fst-italic">Las contraseñas no coinciden</small></div>)}
        </div>
        <div className="col-md-3 mb-3"></div>
        <div className="col-12 d-flex justify-content-end gap-2">
            <button type="submit" className="btn btn-primary" disabled={borderRepetida}>Guardar cambios</button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Cancelar</button>

        </div>
    </form>

}

export default FormPassword;