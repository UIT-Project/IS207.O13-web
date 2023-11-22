import { NavLink } from "react-router-dom";
import './index.css'

function MenuItem({title, to, icon}){
    return (
        <div className="header_navigation__popup_text">
            <div>
                <NavLink to={to} className="header_navigation__text">
                    {icon}
                            {title}
                </NavLink>
            </div>
            <ul className="header_navigation__popup">
                <li>
                    <button>
                        Áo
                    </button>
                </li>
                <li>
                    <button>
                        Quần
                    </button>
                </li> 
            </ul>
        </div>
    )
}

export default MenuItem;