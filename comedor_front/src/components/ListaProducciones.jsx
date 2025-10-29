import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const ListaProducciones = ({producciones, onClickStateButton}) => {
    return <div className="row row-cols-1 row-cols-md-2 g-4">
        {producciones.map(p => {
            return <div key={p.id} className="col">
                <div className={`card h-100 border-start border-4 shadow-sm ${p.estado == 1 ? "border-success-subtle bg-white" : "border-danger-subtle bg-danger-subtle"}`} style={{borderRadius: "1rem"}}>
                    <div className="card-header border-0 d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="mb-0 fw-semibold">{p.nombre}</h5>
                            <small className="text-secondary">
                                {new Date(p.fecha).toLocaleDateString("es-AR", {year: "numeric", month: "short", day: "numeric"})}
                            </small>
                        </div>
                        <div className="d-flex align-items-center">
                            <button onClick={() => onClickStateButton(p.id, p.estado)} className={`btn badge rounded-pill px-3 py-2 fw-normal ${p.estado === 1 ? "btn-success text-ligth" : "btn-danger text-ligth"}`}>
                                {p.estado === 1 ? "Activa" : "Inactiva"}
                            </button>
                            <Link to={`/produccion/editar/${p.id}`} className="btn btn-warning ms-2">
                                <FontAwesomeIcon icon={faPencil}/>    
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <p className="card-text text-body-secondary mb-3 text-center">{p.descripcion}</p>
                        <div className="d-flex justify-content-around mb-3  ">
                            <h6 className="text-body">
                                Costo primo total: ${p.costo_primo_total.replace(".",",")}
                            </h6>
                        </div>
                        <div className="d-flex justify-content-between text-secondary">
                            <span>Comensales: {p.cantidad_comensales}</span>
                            <span>Turno {p.turno}</span>
                        </div>
                    </div>
                    {p.insumos.length > 0 && (
                        <ul className="list-group list-group-flush rounded-3 overflow-hidden mx-3 mb-3">
                            {p.insumos.map((i) => (
                                <li key={i.insumo_id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span className="fw-medium">{i.producto}</span>
                                    <span className="text-muted small">{i.cantidad_usada} {i.simbolo}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        })}
    </div>
}

export default ListaProducciones;