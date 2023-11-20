import { NavLink } from "react-router-dom";
import './index.css'

function MenuItem({title, to, icon}){
    return (
        <NavLink to={to} className="header_navigation__text">
            {icon}
            <span>{title}</span>
        </NavLink>
    )
}

export default MenuItem;