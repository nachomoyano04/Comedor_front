import { useState } from "react";
import { isEqualWith, trim } from "lodash";
import { trimer } from "../services/globalFunctions";

const FormUsuario = ({ u = null, roles = [], onSubmit }) => {
  const usuario = {
    nombre: u?.nombre || "",
    apellido: u?.apellido || "",
    dni: u?.dni || "",
    cuil: u?.cuil || "",
    correo: u?.correo || "",
    telefono: u?.telefono || "",
    rol: u?.rol || [],
  };

  const [formData, setFormData] = useState(usuario);
  const [areChanges, setAreChanges] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    setAreChanges(!isEqualWith(usuario, newFormData, trimer));
  };

  const handleChangeRol = (e) => {
    const rolId = Number(e.target.value);
    const newRol = e.target.checked
      ? [...formData.rol, rolId]
      : formData.rol.filter((r) => r !== rolId);

    const newFormData = {
      ...formData,
      rol: newRol.sort((a, b) => a - b),
    };

    setFormData(newFormData);
    setAreChanges(!isEqualWith(usuario, newFormData, trimer));
  };

  const handleReset = () => {
    setFormData(usuario);
    setAreChanges(false);
  };

  return (
    <form className="row g-2" onSubmit={handleSubmit}>
      <div className="col-md-4 mb-3">
        <label className="form-label">Nombre</label>
        <input
          name="nombre"
          onChange={handleChange}
          type="text"
          className="form-control"
          value={formData.nombre}
          required
        />
      </div>

      <div className="col-md-4 mb-3">
        <label className="form-label">Apellido</label>
        <input
          name="apellido"
          onChange={handleChange}
          type="text"
          className="form-control"
          value={formData.apellido}
        />
      </div>

      <div className="col-md-4 mb-3">
        <label className="form-label">Correo</label>
        <input
          name="correo"
          onChange={handleChange}
          type="email"
          className="form-control"
          value={formData.correo}
        />
      </div>

      <div className="col-md-4 mb-3">
        <label className="form-label">DNI</label>
        <input
          name="dni"
          onChange={handleChange}
          type="text"
          className="form-control"
          value={formData.dni}
        />
      </div>

      <div className="col-md-4 mb-3">
        <label className="form-label">CUIL</label>
        <input
          name="cuil"
          onChange={handleChange}
          type="text"
          className="form-control"
          value={formData.cuil}
        />
      </div>

      <div className="col-md-4 mb-3">
        <label className="form-label">Teléfono</label>
        <input
          name="telefono"
          onChange={handleChange}
          type="text"
          className="form-control"
          value={formData.telefono}
        />
      </div>

      {roles.length > 0 && (
        <div className="col-12 mb-3">
          <label className="form-label d-block">Roles</label>

          {roles.map((r) => (
            <div className="form-check form-check-inline" key={r.id}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`rol-${r.id}`}
                value={r.id}
                checked={formData.rol.includes(r.id)}
                onChange={handleChangeRol}
              />
              <label className="form-check-label" htmlFor={`rol-${r.id}`}>
                {r.nombre_rol}
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="col-12 d-flex justify-content-end gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!areChanges}
        >
          Guardar cambios
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleReset}
          disabled={!areChanges}
        >
          Cancelar
        </button>
      </div>

      {!areChanges && (
        <div className="text-end">
          <small
            style={{
              color: "#555555",
              fontStyle: "italic",
            }}
          >
            No hay cambios aún
          </small>
        </div>
      )}
    </form>
  );
};

export default FormUsuario;
