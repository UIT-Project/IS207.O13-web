import './index.css'

function Menu({children}){
    return ( 
        <nav className='header_navigation'> 
            {children}
        </nav>
    )
}

export default Menu;