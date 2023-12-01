import { useEffect, useRef, useState } from "react"; 
import images from "../../assets/images";
import './infoAccount.css'; 
import "bootstrap"
import { useParams } from "react-router-dom";
import request from "../../utils/request";
import useGlobalVariableContext from "../../context_global_variable/context_global_variable";

function InfoAccount() {
    const [notifySaveInfoAccount, setNotifySaveInfoAccount] = useState('');
    const [notifySaveInfoChangePassword, setNotifySaveInfoChangePassword] = useState('');
    const [infoAccount, setInfoAccount] = useState({
        name: '',
        email: '', 
        gender: '',
        numberPhone: '',
        address: '',
    })
    const [infoChangePassword, setInfoChangePassword] = useState({
        oldPassword: '',
        newPassword: '', 
        confirmNewPassword: '',
        matk: localStorage.getItem('auth_matk'),
    })
    const [isLoading, setIsLoading] = useState(false);
    const getInfoAccount = () => {
        request.get('/api/getInfoAccount', {params : {matk: localStorage.getItem('auth_matk')}})
        .then(res => {
            setInfoAccount({
                name: res.data.infoAccount.TEN,
                email: res.data.infoAccount.EMAIL,
                gender: res.data.infoAccount.gioitinh,
                numberPhone: res.data.infoAccount.SDT,
                address: res.data.infoAccount.DIACHI,
            })
            console.log(res.data.infoAccount)

        })
    }
    const handleSaveInfoAccount = () => { 
        const data = {
            name: infoAccount.name,
            email: infoAccount.email, 
            gender: infoAccount.gender,
            numberPhone: infoAccount.numberPhone,
            address: infoAccount.address,
        }
        request.post('/api/saveInfoAccount', data)
        .then(res => {
            if(res.data.status === 200)
                setNotifySaveInfoAccount('Lưu thành công');
        })
    }

    const handleChangePassword = () => {
        console.log('ok')
        setIsLoading(true)
        if(infoChangePassword.newPassword !== infoChangePassword.confirmNewPassword){
            setNotifySaveInfoChangePassword('Xác nhận mật khẩu mới không khớp')
            setIsLoading(false)
        }
        else{
            request.post('/api/changePassword', infoChangePassword)
            .then(res => { 
                if(res.data.status === 200){
                    setNotifySaveInfoChangePassword('Lưu thành công');  
                    setInfoChangePassword({
                        oldPassword: '',
                        newPassword: '', 
                        confirmNewPassword: '',
                        matk: localStorage.getItem('auth_matk'),
                    });  
                 setIsLoading(false)
                }
                else{
                    console.log(res.data.validation_errors);
                    setNotifySaveInfoChangePassword(res.data.validation_errors.newPassword);  
                    setIsLoading(false)
                }
            })
        }
    }
    const handleInputInfoChangePassword = (e) => {
        e.persist(); 
        setInfoChangePassword({...infoChangePassword, [e.target.name]: e.target.value}); 
    }
    const handleInputInfoAccount = (e) => {
        e.persist();
        setInfoAccount({...infoAccount, [e.target.name]: e.target.value});
        console.log(infoAccount)
    }
    const handleInputInfoAccount_numberPhone = (e) => {
        e.persist();
        e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
        setInfoAccount({...infoAccount, [e.target.name]: e.target.value});
        console.log(infoAccount)
    }
    useEffect(() => {
        getInfoAccount()
    }, [])
    useEffect(() => {
        // Set giá trị sau 2 giây
        const timeout = setTimeout(() => {
            setNotifySaveInfoAccount('');
        }, 2000);
     
        return () => {
          clearTimeout(timeout); 
        };
    }, [notifySaveInfoAccount]);

    useEffect(() => {
        // Set giá trị sau 2 giây
        const timeout = setTimeout(() => {
            setNotifySaveInfoChangePassword('');
            
        }, 2000);
     
        return () => {
          clearTimeout(timeout); 
        };
    }, [notifySaveInfoChangePassword]);

    const renderLoading = () => {
        return (
            <div class={`donut_InfoAccount multi_InfoAccount ${isLoading ? '' : 'display_hidden'}`}></div> 
        )
    }

    return (
        <div>
            <div class="order_info_body container">
                <div class="heading text-uppercase text-center thongtintaikhoan">
                    <h1>Thông tin tài khoản</h1>
                </div>
                <div class="form_container row">
                    <div class="container col-6"> 
                        <div class="name_row row">
                            <p class="text-end col-3">Họ và Tên</p>
                            <input 
                                class="col-7 round_corner_input" 
                                type="text" 
                                width="250"
                                name="name" 
                                onChange={handleInputInfoAccount} 
                                value={infoAccount.name} 
                            />
                        </div>
                        {/* <div class="name_row row">
                            <p class="col-2">Ngày sinh</p>
                            <input class="col-3" type="date" width="250"/>
                        </div> */}
                        <div class="name_row row">
                            <p class="text-end col-3">Giới tính</p>
                            <div class="col-7">
                                <div class="form-check form-check-inline">
                                    <input 
                                        class="form-check-input" 
                                        type="radio" 
                                        name="gender"
                                        id="inlineRadio1" 
                                        value="Nam"
                                        checked={infoAccount.gender === 'Nam'}
                                        onChange={handleInputInfoAccount}
                                    />
                                        <label class="form-check-label" for="inlineRadio1">Nam</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input 
                                        class="form-check-input" 
                                        type="radio" 
                                        name="gender" 
                                        id="inlineRadio2" 
                                        value="Nữ"
                                        checked={infoAccount.gender === 'Nữ'} 
                                        onChange={handleInputInfoAccount}

                                    />
                                        <label class="form-check-label" for="inlineRadio2">Nữ</label>
                                </div>
                            </div>
                        </div>
                        <div class="name_row row">
                            <p class="text-end col-3">Email</p>
                            <input class="col-7 round_corner_input" type="text" width="250"
                                name="email" 
                                onChange={handleInputInfoAccount} 
                                value={infoAccount.email}
                                disabled  
                            />
                        </div>
                        <div class="name_row row">
                            <p class="text-end col-3">SĐT</p>
                            <input class="col-7 round_corner_input" type="text" width="250"
                                name="numberPhone" 
                                onChange={handleInputInfoAccount_numberPhone} 
                                value={infoAccount.numberPhone}  
                            />
                        </div>
                        <div class="name_row address row">
                            <p class="text-end col-3">Địa chỉ</p>
                            <input class="col-7 round_corner_input" type="text"
                                name="address" 
                                onChange={handleInputInfoAccount} 
                                value={infoAccount.address} 
                            />
                        </div>
                    </div>
                    <div class="col-5"> 
                        <span className="name_row">Thay đổi mật khẩu</span>
                        <div class="name_row row">
                            <p class="text-end col-4">Mật khẩu cũ</p>
                            <input class="col-7 round_corner_input" type="text" width="180"
                                name="oldPassword" 
                                onChange={handleInputInfoChangePassword} 
                                value={infoChangePassword.oldPassword}
                            />
                        </div>
                        <div class="name_row row">
                            <p class="text-end col-4">Mật khẩu mới</p>
                            <input class="col-7 round_corner_input" type="password" width="250"
                                name="newPassword"  
                                onChange={handleInputInfoChangePassword} 
                                value={infoChangePassword.newPassword}
                            />
                        </div>
                        <div class="name_row row">
                            <p class="text-end col-4">Xác nhận mật khẩu</p>
                            <input class="col-7 round_corner_input" type="password" width="250"
                                name="confirmNewPassword"  
                                onChange={handleInputInfoChangePassword} 
                                value={infoChangePassword.confirmNewPassword}
                            />
                        </div>
                        <div className="notifySaveInfoChangePassword">
                            <span className="notifySaveInfoChangePassword">{notifySaveInfoChangePassword}</span>
                        </div>
                        <input 
                            class={`changePassword-button ${isLoading ? 'display_hidden' : ''}`}
                            type="button" 
                            value="Đổi mật khẩu" 
                            onClick={handleChangePassword} 
                        />
                        {renderLoading()}
                    </div>
                    <div class="w-100"></div>
                    <input class="last-button" type="button" value="Lưu thay đổi" onClick={handleSaveInfoAccount}/>
                    {/* <div> */}
                        <span className="notifySaveInfoAccount">{notifySaveInfoAccount}</span>
                    {/* </div> */}
                </div>
                        
            </div>
        </div>
    )
}

export default InfoAccount;