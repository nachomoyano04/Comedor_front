import { Link } from "react-router-dom";
import { FaPlus, FaFolderOpen } from "react-icons/fa";

const EmptyState = ({
    icon: Icon = FaFolderOpen,
    title = "No hay datos registrados todavía",
    description = "Aún no se ha cargado información en esta sección.",
    actionLink,
    actionText,
    actionIcon: ActionIcon = FaPlus,
    secondaryLink,
    secondaryText,
    secondaryIcon: SecondaryIcon,
    canCreate = true
}) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 text-center p-4 p-md-5 my-3 bg-white">
            <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-primary mx-auto mb-3 shadow-sm"
                style={{ width: "72px", height: "72px", fontSize: "1.9rem" }}
            >
                {Icon && <Icon className="text-primary" />}
            </div>
            
            <h4 className="fw-bold text-dark mb-2">{title}</h4>
            
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: "480px", fontSize: "0.95rem", lineHeight: "1.5" }}>
                {description}
            </p>
            
            {canCreate && actionLink && actionText && (
                <div className="d-flex flex-wrap justify-content-center gap-2">
                    <Link 
                        to={actionLink} 
                        className="btn btn-primary px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                        style={{ borderRadius: "0.6rem" }}
                    >
                        {ActionIcon && <ActionIcon />}
                        <span>{actionText}</span>
                    </Link>

                    {secondaryLink && secondaryText && (
                        <Link 
                            to={secondaryLink} 
                            className="btn btn-outline-secondary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                            style={{ borderRadius: "0.6rem" }}
                        >
                            {SecondaryIcon && <SecondaryIcon />}
                            <span>{secondaryText}</span>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
