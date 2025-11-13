import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select"

const ModalAddInsumo = ({insumosBD, handleChangeModalInsumo, cantidad_producida, handleClickModal, insAAgregar}) => {
    return <>
        <button type="button" className="btn btn-sm border bg-success  mb-1 d-flex align-items-center gap-2" title="Agregar insumo" data-bs-toggle="modal" data-bs-target="#modalAddInsumo">
            <FontAwesomeIcon icon={faAdd} style={{ color: "white" }}></FontAwesomeIcon>
        </button>
        <div className="modal fade" id="modalAddInsumo" aria-hidden="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-8 mb-3">
                                <label className="form-label">Insumo</label>
                                <Select options={insumosBD} onChange={handleChangeModalInsumo}></Select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Cantidad</label>
                                {cantidad_producida > 0 && (<small className="text-muted ms-2">x{cantidad_producida}</small>)}
                                <input type="number" disabled={!insAAgregar} value={insAAgregar?.cantidad || 0} className="form-control" onChange={handleChangeModalInsumo} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" disabled={!insAAgregar || !insAAgregar.cantidad} className="btn btn-success" onClick={handleClickModal} data-bs-dismiss="modal">Agregar</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ModalAddInsumo;