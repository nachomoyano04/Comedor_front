const ListaRecetas = ({recetas}) => {
    return <div className="container text-center">
        <div className="row">
            {recetas.map(r => {
                return <div key={r.id} className={r.estado == 1?"card ms-3 text-bg-primary":"card ms-3 text-bg-danger"} style={{maxWidth: "18rem"}}>
                        <div className="card-header">{r.nombre}</div>
                        <div className="card-body">
                            <h5 className="card-title">Descripción</h5>
                            <p className="card-text">{r.descripcion}</p>
                        </div>
                    </div>
            })}
        </div>
    </div>
}

export default ListaRecetas;