import { useEffect, useState } from "react";
import { createUsuario, getRoles } from "../services/api";
import FormUsuario from "../components/FormUsuario"
import Swal from "sweetalert2"
import { useOutletContext } from "react-router-dom";
const RegisterUser = () => {
    const {roles} = useOutletContext();

    const handleSubmitForm = formData => {
        Swal.fire({
            title:"Esta seguro que quiere registrar el usuario?",
            icon: "warning",
            showCancelButton: true, 
            confirmButtonText: "Si",
            cancelButtonText: "Cancelar",
        }).then(async res => {
            if(res.isConfirmed){
                const respuesta = await createUsuario(formData);
                Swal.fire({
                    title:"Usuario registrado",
                    icon: "success",
                    text: respuesta
                })
            }
        });
    }

    return <>
        <h1 className="card-title mt-3">Registro de usuario</h1>
        <FormUsuario roles={roles} onSubmit={handleSubmitForm}/>
    </>
}

export default RegisterUser;