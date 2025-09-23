const UsuarioForm = () => {
    return <>
    <div className="bd-example-snippet bd-code-snippet">
        <div className="bd-example m-0 border-0">
            <form className="row g-3">
                <div className="col-md-4">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="validationDefault01" required/>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Apellido</label>
                    <input type="text" className="form-control" id="validationDefault02" required/>
                </div>
                <div className="col-md-4">
                    <label className="form-label">DNI</label>
                    <div className="input-group">
                    <span className="input-group-text" id="inputGroupPrepend2">@</span>
                    <input type="text" className="form-control" id="validationDefaultUsername" aria-describedby="inputGroupPrepend2" required/>
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="form-label">CUIL</label>
                    <input type="text" className="form-control" id="validationDefault03" required/>
                </div>
                <div className="col-md-3">
                    <label className="form-label">CUIL</label>
                    <input type="text" className="form-control" id="validationDefault03" required/>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Zip</label>
                    <input type="text" className="form-control" id="validationDefault05" required/>
                </div>
                <div className="col-12">
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="invalidCheck2" required/>
                    <label className="form-check-label">
                        Agree to terms and conditions
                    </label>
                    </div>
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Submit form</button>
                </div>
            </form>
        </div>
    </div>
    </>
}

export default UsuarioForm;