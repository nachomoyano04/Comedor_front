import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteContactoProveedor, getProveedor, newContactoProveedor, updateProveedor } from "../services/api";
import FormProveedor from "../components/FormProveedor"
import Swal from "sweetalert2";

const UpdateProve = () => {
    const {id} = useParams();
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProv = async () => {
            try {
                const resultado = await getProveedor(id);
                let p = resultado.reduce((acc, e) => {
                    if(acc.length == 0){
                        acc = {id: e.id, codigo: e.codigo, cuit: e.cuit, domicilio: e.domicilio, email: e.email, estado: e.estado, horarios_atencion: e.horarios_atencion, localidad: e.localidad, nombre_fantasia: e.nombre_fantasia, razon_social: e.razon_social, contactos: []};
                    }
                    e.id_contacto && acc.contactos.push({id_contacto: e.id_contacto, proveedor_id: e.proveedor_id, email_contacto: e.email_contacto, nombre_contacto: e.nombre_contacto, telefono_contacto: e.telefono_contacto, es_principal: false});
                    return acc;
                }, []);
                setProveedor(p);
            } catch (err) {
                console.log(err);
                setError("Error al obtener el proveedor");
            } finally{
                setLoading(false);
            }
        }
        loadProv();
    }, [])

    const handleBorrarContacto = async id_contacto => {
        const res = await Swal.fire({icon:"warning",title:"Seguro desea borrar el contacto?",showCancelButton:true, confirmButtonText:"Si"})
        if(res.isConfirmed){
            const respuesta = await deleteContactoProveedor(id_contacto);
            setProveedor({...proveedor, contactos: proveedor.contactos?.filter(c => c.id_contacto != id_contacto)});
            Swal.fire({icon:"success", title: respuesta, timer: 2000})
        }
    }
 
    const handleSubmitForm = async formData => {
        const {tipo, ...restFormData} = formData;
        try {
            if(tipo == "proveedor"){
                const response = await updateProveedor(id, restFormData);
                await Swal.fire({
                    icon:"success",
                    title: response,
                    timer: 2000
                })
                navigate("/proveedores/listado");
            }else{ // registrar el contacto...
                const {tipo, ...restForm} = formData;
                const {id_contacto} = await newContactoProveedor(restFormData);
                const contacto = {...restForm, id_contacto};
                setProveedor({...proveedor, contactos: [...proveedor.contactos, contacto]});
                Swal.fire({icon: "success", title: "Contacto creado con exito", timer: 2000});
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: err.response.data.error })
        }
    }

    return <>
        {/* Card Header */}
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Editar Proveedor</h5>
        </div>
        {/* Card Body */}
        <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
            ) : (
                <div className="card-body d-flex justify-content-center">
                    <div style={{width: "100%", maxWidth: "800px"}}>
                        <FormProveedor proveedor={proveedor} onSubmit={handleSubmitForm} onClickBtnBorrarContacto={handleBorrarContacto}/>
                    </div>
                </div>
            )}
        </div>
    </>
}

export default UpdateProve;