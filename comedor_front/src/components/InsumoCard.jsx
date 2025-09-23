const InsumoCard = ({insumo}) => {
    return (
        <div className="col">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{insumo.producto}</h5>
                    <p className="card-text">Código del producto: {insumo.codigo}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <div className="list-group-item">{insumo.marca}</div>
                    <div className="list-group-item">Unidad de medida: {insumo.nombre}</div>
                </ul>
            </div>
        </div>
    )
}

export default InsumoCard;