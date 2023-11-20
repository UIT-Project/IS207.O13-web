import './index.css' 
import MenuItem from './MenuItem'
import Menu from './Menu'
import config from '../../../../config'

function Navigation(){
    return ( 
        <div>
            <Menu>
                <MenuItem title="Nam" to={config.routes.nam} icon={null}></MenuItem>
                <MenuItem title="Nữ" to={config.routes.nu} icon={null}></MenuItem>
                <MenuItem title="Trẻ em" to={config.routes.treem} icon={null}></MenuItem>
            </Menu> 
        </div>
         
    )
}

export default Navigation;
