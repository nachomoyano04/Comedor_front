import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../services/AuthProvider";
import { useContext } from "react";
import EmptyState from "./EmptyState";
import { FaBoxes, FaPlus } from "react-icons/fa";

const ListaInsumos = ({ insumos, unidades_de_medida, onClickChangeStateInsumo }) => {
    const { user } = useContext(AuthContext);

    if (!insumos || insumos.length === 0) {
        return (
            <EmptyState 
                icon={FaBoxes}
                title="No hay insumos registrados todavía"
                description="Carga los alimentos y materias primas (leche, harina, arroz, carnes, verduras) para gestionar el inventario del comedor."
                actionLink="/insumos/nuevo_insumo"
                actionText="Agregar Nuevo Insumo"
                actionIcon={FaPlus}
                canCreate={user?.roles?.some(r => [1, 2].includes(r))}
            />
        );
    }

    return <>
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th scope="col" className="text-center">Codigo</th>
                        <th scope="col" className="text-center">Producto</th>
                        <th scope="col" className="text-center">Marca</th>
                        <th scope="col" className="text-center">Unidad de medida</th>
                        <th scope="col" className="text-center">Stock</th>
                        {/* Solo pueden editar o dar de baja/alta rol: ADMIN Y COCINA */}
                        {user?.roles.some(r => [1, 2].includes(r)) && <>
                            <th scope="col" className="text-center">Editar</th>
                            <th scope="col" className="text-center">Estado</th>
                        </>}
                    </tr>
                </thead>
                <tbody>
                    {insumos.map(i =>
                        <tr key={i.id}>
                            <td className="text-center">{i.codigo}</td>
                            <td className="text-center">{i.producto}</td>
                            <td className="text-center">{i.marca}</td>
                            <td className="text-center">{unidades_de_medida.find(udm => udm.id == i.id_unidad_de_medida)?.nombre || "- - -"}</td>
                            <td className="text-center">{i.stock}</td>
                            {/* Solo pueden editar y cambiar estado roles: ADMIN Y COCINA */}
                            {user?.roles.some(r => [1, 2].includes(r)) && <>
                                <td className="text-center">
                                    <Link className="btn btn-warning" to={`/insumos/editar/${i.id}`}>
                                        <FontAwesomeIcon icon={faPencil} />
                                    </Link>
                                </td>
                                <td className="text-center">
                                    <button onClick={() => onClickChangeStateInsumo(i.id, i.estado)} className={`btn btn-sm ${i.estado === 1 ? 'btn-success' : 'btn-danger'}`}>
                                        {i.estado === 1 ? "Activo" : "Inactivo"}</button>
                                </td>
                            </>}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
}
export default ListaInsumos;