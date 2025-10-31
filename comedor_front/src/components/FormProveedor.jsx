import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";

const FormProveedor = ({ proveedor = null, onSubmit, onClickBtnBorrarContacto }) => {
    const [formData, setFormData] = useState({ tipo: "proveedor", codigo: proveedor?.codigo || "", razon_social: proveedor?.razon_social || "", nombre_fantasia: proveedor?.nombre_fantasia || "", cuit: proveedor?.cuit || "", horarios_atencion: proveedor?.horarios_atencion || "", domicilio: proveedor?.domicilio || "", localidad: proveedor?.localidad || "", email: proveedor?.email || "", contactos: proveedor?.contactos || [] });
    const [formDataContacto, setFormDataContacto] = useState({ tipo: "contacto", proveedor_id: proveedor?.id, nombre_contacto: "", telefono_contacto: "", email_contacto: "", es_principal: false });
    const [areChanges, setAreChanges] = useState(false);

    useEffect(() => {
        setFormData({ tipo: "proveedor", codigo: proveedor?.codigo || "", razon_social: proveedor?.razon_social || "", nombre_fantasia: proveedor?.nombre_fantasia || "", cuit: proveedor?.cuit || "", horarios_atencion: proveedor?.horarios_atencion || "", domicilio: proveedor?.domicilio || "", localidad: proveedor?.localidad || "", email: proveedor?.email || "", contactos: proveedor?.contactos || [] });
        setAreChanges(false);
    }, [proveedor]);

    const isEditing = proveedor !== null;

    const handleChange = e => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        //Logica de comparacion para ver si hay cambios o no...
        if (isEditing && proveedor) {
            const { id, estado, ...restProveedor } = proveedor;
            const { tipo, ...restFormData } = newFormData;
            setAreChanges(!isEqual(restProveedor, restFormData))
        }
    }

    const handleChangeContacto = e => {
        const { name, value } = e.target;
        const newFormData = { ...formDataContacto, [name]: value };
        setFormDataContacto(newFormData);
    }

    const handleReset = origen => {
        if (origen == 1) { //formulario del proveedor
            setFormData({ tipo: "proveedor", codigo: proveedor?.codigo || "", razon_social: proveedor?.razon_social || "", nombre_fantasia: proveedor?.nombre_fantasia || "", cuit: proveedor?.cuit || "", horarios_atencion: proveedor?.horarios_atencion || "", domicilio: proveedor?.domicilio || "", localidad: proveedor?.localidad || "", email: proveedor?.email || "", contactos: proveedor?.contactos || [] })
            setAreChanges(false);
        } else {//formulario del contacto de proveedor
            setFormDataContacto({ tipo: "contacto", proveedor_id: proveedor?.id, nombre_contacto: "", telefono_contacto: "", email_contacto: "", es_principal: false });
        }
    }

    const handleSubmitContacto = e => {
        e.preventDefault();
        const { tipo } = formDataContacto;
        tipo == "contacto" ? handleReset(2) : ""; // Si es un contacto, limpiamos los campos
        onSubmit(formDataContacto);
    }

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData);
    }

    return <>
        <form className="row g-2" onSubmit={handleSubmit}>
            <div className="col-md-4 mb-3">
                <label className="form-label">Codigo</label>
                <input name="codigo" onChange={handleChange} type="text" className="form-control" value={formData.codigo} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Email</label>
                <input name="email" onChange={handleChange} type="text" className="form-control" value={formData.email} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">CUIT</label>
                <input name="cuit" onChange={handleChange} type="text" className="form-control" value={formData.cuit} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Razón social</label>
                <input name="razon_social" onChange={handleChange} type="text" className="form-control" value={formData.razon_social} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Nombre fantasía</label>
                <input name="nombre_fantasia" onChange={handleChange} type="text" className="form-control" value={formData.nombre_fantasia} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Horarios de atención</label>
                <input name="horarios_atencion" onChange={handleChange} type="text" className="form-control" value={formData.horarios_atencion} required />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Localidad</label>
                <input name="localidad" onChange={handleChange} type="text" className="form-control" value={formData.localidad} required />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Domicilio</label>
                <input name="domicilio" onChange={handleChange} type="text" className="form-control" value={formData.domicilio} required />
            </div>
            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-primary" type="submit" disabled={!isEditing ? false : isEditing && areChanges ? false : true}>{isEditing ? "Guardar cambios" : "Registrar"}</button>
                <input className="btn btn-secondary" type="button" disabled={!isEditing ? false : isEditing && areChanges ? false : true} onClick={() => handleReset(1)} value={"Cancelar"} />
            </div>
        </form>
        <hr />
        {isEditing && (<>
            {proveedor.contactos.length > 0 && (
                <>
                    <div className="card-header bg-primary-subtle border-0">
                        <h5 className="mb-0 fw-semibold text-primary-emphasis d-flex align-items-center gap-2">Contactos</h5>
                    </div>
                    {proveedor.contactos.map(p => {
                        return (
                            <div key={p.id_contacto} className="col">
                                <div className="card shadow-sm border-0 h-100 rounded-4 overflow-hidden">
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label className="form-label text-secondary mb-1">Nombre</label>
                                                <div className="form-control bg-body-secondary border-0">{p.nombre_contacto || <span className="text-muted">—</span>}</div>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label text-secondary mb-1">Teléfono</label>
                                                <div className="form-control bg-body-secondary border-0">{p.telefono_contacto || <span className="text-muted">—</span>}</div>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label text-secondary mb-1">Email</label>
                                                <div className="form-control bg-body-secondary border-0">{p.email_contacto || <span className="text-muted">—</span>}</div>
                                            </div>
                                            <div className="col-md-1 d-flex flex-column align-items-center justify-content-center text-center">
                                                <label className="form-label text-secondary mb-1">Borrar</label>
                                                <button type="button" className="btn btn-sm border p-1" onClick={() => onClickBtnBorrarContacto(p.id_contacto)}>
                                                    <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    })}
                </>
            )}
            <p className="d-inline-flex gap-1 mt-2">
                <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#formularioContactoProveedor" aria-expanded="false" aria-controls="collapseExample">Agregar contacto</button>
            </p>
            <div className="collapse" id="formularioContactoProveedor">
                <div className="card card-body">
                    <form className="row g-2" onSubmit={handleSubmitContacto}>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Nombre</label>
                            <input name="nombre_contacto" onChange={handleChangeContacto} type="text" className="form-control" value={formDataContacto.nombre_contacto} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Telefono</label>
                            <input name="telefono_contacto" onChange={handleChangeContacto} type="text" className="form-control" value={formDataContacto.telefono_contacto} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Email</label>
                            <input name="email_contacto" onChange={handleChangeContacto} type="text" className="form-control" value={formDataContacto.email_contacto} required />
                        </div>
                        <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                            <button className="btn btn-primary" type="submit">Guardar</button>
                            <input className="btn btn-secondary" type="button" onClick={() => handleReset(2)} value={"Cancelar"} />
                        </div>
                    </form>
                </div>
            </div>
        </>
        )}
    </>
}

export default FormProveedor;