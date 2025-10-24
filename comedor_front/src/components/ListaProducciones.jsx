import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListaProducciones = ({producciones, onClickStateButton}) => {
    return <div className="row row-cols-1 row-cols-md-2 g-4">
        {producciones.map(p => {
            return <div key={p.id} className="col">
                <div className={`card shadow-sm border-0 h-100 ${p.estado == 1 ? "bg-body text-dark" : "bg-danger-subtle text-dark"}`}>
                    <div className="card-header border-0 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-semibold">{p.nombre}</h5>
                        <div>
                            <button onClick={() => onClickStateButton(p.id, p.estado)} className={`btn badge rounded-pill px-3 py-2 fw-normal ${p.estado === 1 ? "btn-success text-ligth" : "btn-danger text-ligth"}`}>
                                {p.estado === 1 ? "Activa" : "Inactiva"}
                            </button>
                            <Link to={`/recetas/editar/${p.id}`}>
                                <FontAwesomeIcon icon={faPencil} className="btn btn-warning mx-1"/>    
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <h5 className="card-text text-light-emphasis mb-3">{r.descripcion}</h5>
                    </div>
                    <ul className="list-group list-group-flush rounded-3 overflow-hidden mx-3 mb-3">
                        {r.insumos.map((r) => (
                            <li key={r.insumo_id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span className="fw-medium">{r.producto}</span>
                                <span className="text-muted small">{r.cantidad} {r.simbolo}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        })}
    </div>
}

export default ListaProducciones;