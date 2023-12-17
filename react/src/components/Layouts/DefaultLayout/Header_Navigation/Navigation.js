import './index.css' 
import MenuItem from './MenuItem'
import Menu from './Menu'
import config from '../../../../config'
import useGlobalVariableContext from '../../../../context_global_variable/context_global_variable'

function Navigation(){
    // const {setCategory1} = useGlobalVariableContext(); 
    const handleClickCategory1 = (newCategory) => {
        // setCategory1(newCategory); // Thay đổi giá trị setCategory1 khi click
        // console.log(newCategory, 'newCategory')
        window.location.reload();
    };
    return ( 
        <div>
            <Menu>
                <MenuItem 
                    title="Nam" 
                    to={config.routes.nam} 
                    icon={null} 
                    onClick={() => handleClickCategory1(1)}
                ></MenuItem>
                <MenuItem 
                    title="Nữ" 
                    to={config.routes.nu} 
                    icon={null} 
                    onClick={() => handleClickCategory1(2)}
                ></MenuItem>
                <MenuItem 
                    title="Trẻ em" 
                    to={config.routes.treem} 
                    icon={null} 
                    onClick={() => handleClickCategory1(3)}
                ></MenuItem>
            </Menu> 
        </div>
         
    )
}

export default Navigation;
