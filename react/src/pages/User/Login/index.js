import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import {  faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import './style.css';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Request from "../../../utils/request";
import useGlobalVariableContext from '../../../context_global_variable/context_global_variable'; 

function Login(){ 

    // Trong file này cần xử lý
    // 1.kiểm tra xem người dùng đã nhấn đăng ký hay đăng nhập
    // 2. nếu nhấn đăng ký thì http://localhost:3000/login hiển thị phần đăng ký và ngược lại
    // 3.nếu đăng ký thì xử lý lưu thông tin tài khoản, đăng nhập thì kiểm tra xem trùng khớp với db không rồi login

    useEffect(() => {
      document.title = "DosiIn | Đăng nhập"
    }, []);
    // đoạn code này để chuyển slide sign in or sign up
    //nếu isSignUpActive = true thì có nghĩa là người dùng đã chọn đăng ký
    //bởi vì http://localhost:3000/login dùng cho cả đăng ký và đăng nhập nên và phải sử dụng  isSignUpActive để biết là đang nhấn đăng nhập hay đăng ký
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const {loginOrLogout} = useGlobalVariableContext();
    const [isNotifyOpenMailToVerify, setIsNotifyOpenMailToVerify] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isClickForgetPass, setIsClickForgetPass] = useState(false);
    const [isSendMailRecoverSuccess, setIsSendMailRecoverSuccess] = useState(false);
    // const [isDisableButton, setIsSendMailRecoverSuccess] = useState(false);
    //nếu người dùng click đăng nhập thì setIsSignUpActive false và ngược lại
    useEffect(()=>{ 
      if(loginOrLogout === 'signIn'){
        setIsSignUpActive(false);
      } 
      else{
        setIsSignUpActive(true); 
      }
    }, [loginOrLogout])


    const click_signin = () => { 
        setIsSignUpActive(false);
    }
    const click_signup = () => {
        setIsSignUpActive(true);
    }

    const Navigate = useNavigate();

    //lưu giá trị từ những ô nhập thông tin đăng ký
    const [registerInput, setRegisterInput] = useState({
      name_register: '',
      email_register: '',
      password_register: '',
      confirmPassword_register: '',
      gender_register: '',
      error_list_register: [],
    });

    // xử lý nhập liệu vào các ô đăng ký
    //để ý đến name, value và onchange ở các thẻ input
    const handleInputRegister = (e) => {
      e.persist();
      setRegisterInput({...registerInput, [e.target.name]: e.target.value});
      console.log(registerInput.gender_register)
    }
    
    //đây là đoạn mã gửi thông tin đăng ký
    const registerSubmit = async (e) => {
      e.preventDefault();
      //dữ liệu sẽ gửi xuống để lưu thông tin đăng ký
      setIsLoading(true)
      const data_register = {
        name: registerInput.name_register,
        email: registerInput.email_register,
        password: registerInput.password_register,
        confirmPassword: registerInput.confirmPassword_register,
        gender: registerInput.gender_register,
        role: "Khách hàng",
        AdminVerify: 0,
      }
      console.log(data_register)
      //sử dụng sanctum để lưu thông tin đăng ký và check valid ở phần backend
      Request.get('/sanctum/csrf-cookie')
        .then(async () => {
          Request.post('/api/register', data_register) //request post để lưu thông tin
        .then(res => {
          console.log(res.data.status)
          if(res.data.status === 200){// nếu lưu thông tin thành công thì status trả về từ server là 200 
            console.log(res.data.email);
            localStorage.setItem('auth_token', res.data.token);
            localStorage.setItem('auth_email', res.data.email);
            setIsNotifyOpenMailToVerify(true);

            // swal("success", res.data.message, "success");
            Navigate('/login');
          }
          else{
            
            setIsLoading(false)
            if(registerInput.confirmPassword_register !== registerInput.password_register){
              setRegisterInput({...registerInput, error_list_register: {confirmPassword: ['Mật khẩu không khớp']}});
            }
            else{
              setRegisterInput({...registerInput, error_list_register: res.data.validation_errors});
            }
          }
        })
        })
        .catch(error => {
          console.log('lỗi', error);
        })
    }


    const [loginInput, setLoginInput] = useState({ 
      email_login: '',
      password_login: '',
      error_list_login: [],
    });

    const handleInputLogin = (e) => {
      e.persist();
      setLoginInput({...loginInput, [e.target.name]: e.target.value});
    }
     
    const loginSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true)

      const data_login = { 
        email: loginInput.email_login,
        password: loginInput.password_login,
      }
      console.log('loginSubmit')

      Request.get('/sanctum/csrf-cookie')
        .then(async () => {
          Request.post('/api/login', data_login) 
        .then(res => {
          console.log(res.data.status, 'a')
          if(res.data.status === 200){
            console.log(res);
            localStorage.setItem('auth_token', res.data.token);
            localStorage.setItem('auth_email', res.data.email);
            localStorage.setItem('auth_matk', res.data.matk);
            setIsLoading(false)

            // swal("success", res.data.message, "success");
            Navigate('/');
          }
          else if(res.data.status === 401)
          {
            console.log(res.data.validation_errors);
            setLoginInput({...loginInput, error_list_login: res.data.validation_errors}); 
            setIsLoading(false)

          }
          else{
            console.log(res.data.validation_errors);
            setLoginInput({...loginInput, error_list_login: res.data.validation_errors});
            setIsLoading(false)

          }
        })
        })
        .catch(error => {
          console.log('lỗi', error);
        })
    }

    const handleForgetPassword = () => {
      setIsClickForgetPass(true)
    }
    
    const handleReturnLogin = () => {
      setIsClickForgetPass(false)
      setIsSendMailRecoverSuccess(false) 
      setLoginInput({...loginInput, error_list_login: []})
    }

    const recoverPassword = () => {
      const data = {
        email: loginInput.email_login
      }
      setIsLoading(true)
      console.log('recoverPassword')
      Request.post('/api/sendMailRecoverPassword', data)
      .then(res => {
        console.log(res.data.status)
        if(res.data.status === 200){// nếu lưu thông tin thành công thì status trả về từ server là 200 
          setIsSendMailRecoverSuccess(true) 
          setIsLoading(false)  
        }
        else{
          console.log( res.data.validation_errors)
          setLoginInput({...loginInput, error_list_login: res.data.validation_errors});
          setIsLoading(false) 
        }
      })
    }

    const renderNotifyRegisterSuccess = () => {
      return (
        <div className={`NotifyRegisterSuccess ${isNotifyOpenMailToVerify ? '' : 'display_hidden'}`}>
          {/* <div style="background-color: #35b8e8; height: 140px;">
          </div> */}
          <div className='notify_SuccessRegister_div'>
            <div className='notify_SuccessRegister'>Đăng ký thành công</div>
              <br />
              <p>Hãy kiểm tra và xác nhận email để kích hoạt tài khoản của bạn</p>
            <div>
              <br />
              <br /> 
            </div>
          </div>  
        </div>
      )
    }

    const renderLoading = () => {
      return (
        <div class={`donut multi ${isLoading ? '' : 'display_hidden'}`}></div> 
      )
    }

    return (
    <div> 
        {renderNotifyRegisterSuccess()}
      <div class={`container-pluid_all ${isNotifyOpenMailToVerify ? 'display_hidden' : ''}`}>
        <div className={`container-pluid ${isSignUpActive ? "sign-up-mode" : ""}`}>
          <div class="forms-container-pluid">
            <div class="signin-signup">
              <form action="#" class="sign-in-form" onSubmit={loginSubmit}>
                <h2 class="title">Đăng Nhập</h2>
                <div class={`input-field ${isSendMailRecoverSuccess ? 'display_hidden' : ''}`}>
                  <FontAwesomeIcon icon={faEnvelope} class="input-field_icon"></FontAwesomeIcon>
                  {/* <i class="fas fa-user"></i> */}
                  <input type="text" name="email_login" onChange={handleInputLogin} value={loginInput.email_login} placeholder="Email" />
                </div>
                <p class={`${isSendMailRecoverSuccess ? '' : 'display_hidden'}`}>Chúng tôi đã gửi một mail cho bạn để khôi phục mật khẩu, hãy kiểm tra mail</p>
                <span className={`${isSendMailRecoverSuccess ? 'display_hidden' : ''}`}>{loginInput.error_list_login.email}</span>
                <div class={`input-field ${isClickForgetPass ? 'display_hidden' : ''}`}>
                  <FontAwesomeIcon icon={faLock} class="input-field_icon" className='input-field__faclock'></FontAwesomeIcon>
                  {/* <i class="fas fa-lock"></i> */}
                  <input 
                    type="password" 
                    name="password_login" 
                    onChange={handleInputLogin} 
                    value={loginInput.password_login} 
                    placeholder="Mật khẩu" 
                  />
                </div>
                <span 
                  className='quenmatkhau' 
                  onClick={handleForgetPassword} 
                  class={`quenmatkhau ${isClickForgetPass ? 'display_hidden' : ''}`}
                >Quên mật khẩu</span>
                <span 
                  className='quenmatkhau' 
                  onClick={handleReturnLogin} 
                  class={`quenmatkhau ${isClickForgetPass ? '' : 'display_hidden'}`}
                >Quay lại đăng nhập</span>
                <span>{loginInput.error_list_login.password}</span>
                <input 
                  type="submit" 
                  value="Đăng nhập" 
                  class={
                    `btn solid btn_login 
                    ${isClickForgetPass ? 'display_hidden' : ''}
                    ${isLoading ? 'display_hidden' : ''}`
                  }
                /> 

                <span 
                  onClick={recoverPassword} 
                  class={
                    `button_recoverPassword 
                    ${isClickForgetPass ? '' : 'display_hidden'} 
                    ${isLoading ? 'display_hidden' : ''}
                    ${isSendMailRecoverSuccess ? 'display_hidden' : ''}`
                  }
                >Khôi phục mật khẩu</span>
                {renderLoading()}
                {/* <p class="social-text">Or Sign in with social platforms</p>
                <div class="social-media">
                  <a href="#" class="social-icon">
                      <FontAwesomeIcon icon={faFaceAngry}></FontAwesomeIcon> 
                  </a>
                  <a href="#" class="social-icon">
                      
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="#" class="social-icon">
                    <i class="fab fa-google"></i>
                  </a>
                  <a href="#" class="social-icon">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                </div> */}
              </form>
              <form action="#" class="sign-up-form" onSubmit={registerSubmit}>
                <h2 class="title">Đăng Ký</h2>
                <div class="input-field">
                  <FontAwesomeIcon icon={faUser} class="input-field_icon"></FontAwesomeIcon>
                  <input 
                    type="text" 
                    name="name_register" 
                    onChange={handleInputRegister} 
                    value={registerInput.name_register} 
                    placeholder="Tên người dùng"
                  /> 
                </div>
                <span>{registerInput.error_list_register.name}</span>
                <div class="input-field">
                  <FontAwesomeIcon icon={faEnvelope} class="input-field_icon"></FontAwesomeIcon>
                  <input type="email" name="email_register" onChange={handleInputRegister} value={registerInput.email_register} placeholder="Email" />
                </div>
                <span>{registerInput.error_list_register.email}</span>

                <div class="input-field">
                  <FontAwesomeIcon icon={faLock} class="input-field_icon"></FontAwesomeIcon>
                  <input type="password" name="password_register" onChange={handleInputRegister} value={registerInput.password_register} placeholder="Mật khẩu" />
                </div>
                <span>{registerInput.error_list_register.password}</span>

                <div class="input-field">
                  <FontAwesomeIcon icon={faLock} class="input-field_icon"></FontAwesomeIcon>
                  <input type="password" name="confirmPassword_register" onChange={handleInputRegister} value={registerInput.confirmPassword_register} placeholder="Nhập lại mật khẩu" />
                </div>
                <span>{registerInput.error_list_register.confirmPassword}</span>
                <h5>Giới tính</h5>
                <div class="gender-input">
                  <div id=" male-input">
                    
                    <input 
                      type="radio" 
                      name="gender_register" 
                      value="Nam" 
                      id="male"  
                      onChange={handleInputRegister}
                      className='css-gender'
                    />
                    <label for="male" className='gender_css'>Nam</label>
                  </div>
                  <div id="female-input">
                    
                    <input 
                      type="radio" 
                      name="gender_register" 
                      value="Nữ" 
                      id="female"  
                      onChange={handleInputRegister}
                      className='css-gender' 
                    />
                    <label for="female" className='gender_css'>Nữ</label>
                  </div>
                </div>
                {/* <span>Chọn giới tính</span> */}

                {/* <div class="input-field">
                  <i class="fas fa-cake"></i>
                  <input type="date" placeholder="Birthday" className='css_birthday_input' />
                </div> */}

                <input type="submit" class={`btn btn_sign_up ${isLoading ? 'display_hidden' : ''}`} value="Đăng ký" />
                {renderLoading()}

                {/* <p class="social-text">Or Sign up with social platforms</p>
                <div class="social-media">
                  <a href="#" class="social-icon">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" class="social-icon">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="#" class="social-icon">
                    <i class="fab fa-google"></i>
                  </a>
                  <a href="#" class="social-icon">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                </div> */}
              </form>
            </div>
          </div>
      
          <div class="panels-container-pluid">
            <div class="panel left-panel">
              <div class="content">
                <h3>Bạn mới biết đến cửa hàng chúng tôi ?</h3>
                <p>
                Cửa hàng chúng tôi là điểm đến lý tưởng cho những người yêu thời trang và muốn thể hiện phong cách cá nhân. 
                Chúng tôi tự hào là một cửa hàng thời trang chất lượng, mang đến những bộ sưu tập đa dạng về quần áo, giày 
                dép và phụ kiện để đáp ứng mọi nhu cầu thời trang của bạn.
                </p>
                <button class="btn transparent" id="sign-up-btn" onClick={click_signup}>
                Đăng Ký
                </button>
              </div>
              {/* <img src="https://dosi-in.com/images/assets/icons/logo.svg" class="image" alt="" /> */}
            </div>
            <div class="panel right-panel">
              <div class="content">
                <h3>Đã có tài khoản ?</h3>
                <p>
                Cửa hàng chúng tôi là điểm đến lý tưởng cho những người yêu thời trang và muốn thể hiện phong cách cá nhân. 
                Chúng tôi tự hào là một cửa hàng thời trang chất lượng, mang đến những bộ sưu tập đa dạng về quần áo, giày 
                dép và phụ kiện để đáp ứng mọi nhu cầu thời trang của bạn.
                </p>
                <button class="btn transparent" id="sign-in-btn" onClick={click_signin}>
                Đăng Nhập
                </button>
              </div>
              {/* <img src="https://dosi-in.com/images/assets/icons/logo.svg" class="image" alt="" /> */}
            </div>
          </div>
        </div>
      </div>

    <footer>
      <div class="container-pluid_footer">
          <div class="container-pluid_footer_in">
              <div class="row">
                  <div class="col-sm-3">
                      <h3>Giới thiệu</h3>
                      <span>Đây là một trang web bán áo quần, phục vụ cho đồ án môn phát triển web của học sinh trường UIT</span>
                  </div>
                  <div class="col-sm-3">
                      <h3>Thông tin liên hệ</h3>
                      <ul class="footer__contact_info_ul">
                          <li class="foooter__contact_info_li">
                              <i class="fa-solid fa-location-dot"></i>
                              <span>25, Nguyễn Du, Khu Phố 6, phường Linh Trung, TP. Thủ Đức</span>
                          </li>
                          <li class="foooter__contact_info_li">
                              <i class="fa-solid fa-phone"></i>
                              <span>0867474444</span>
                          </li>
                          <li class="foooter__contact_info_li">
                              <i class="fa-solid fa-envelope"></i>
                              <span>email123@gmail.com</span>
                          </li>
                          <li class="foooter__contact_info_li">
                              <i class="fa-solid fa-calendar-days"></i>
                              <span>9h-18h từ thứ 2 đến chủ nhật</span>
                          </li>
                      </ul>
                  </div>
                  <div class="col-sm-3">
                      <h3>Nội dung chính sách</h3>
                      <ul class="footer__policy_ul">
                          <li class="footer__policy_li"><a class="footer__policy_li_link" href="#">Những câu hỏi thường gặp</a></li>
                          <li class="footer__policy_li"><a class="footer__policy_li_link" href="#">Chính sách thành viên</a></li>
                          <li class="footer__policy_li"><a class="footer__policy_li_link" href="#">Chính sách thanh toán</a></li>
                          <li class="footer__policy_li"><a class="footer__policy_li_link" href="#">Chính sách vận chuyển</a></li>
                          <li class="footer__policy_li"><a class="footer__policy_li_link" href="#">Chính sách khiếu nại</a></li>
                          <li class="footer__policy_li"><a class="footer__policy_li_link" href="#">Chính sách đổi trả</a></li>
                          <li class="footer__policy_li"><a class="footer__policy_li_link" href="#">Chính sách bảo hành</a></li>
                      </ul>
                  </div>
                  <div class="col-sm-3">
                      <h3>Fanpage</h3>
                      <a href="#"><i class="contact_info__icon fa-brands fa-facebook"></i></a>
                      <a href="#"><i class="contact_info__icon fa-brands fa-square-instagram"></i></a>
                      <a href="#"><i class="contact_info__icon fa-brands fa-linkedin"></i></a>                        
                  </div>
              </div> 
          </div>
          <div class="bottom_footer">
              <p>
                  Copyright © 2023
                  <a href="">Web_Name</a> 
                  .
                  <a href="">Powered by Nhom_2</a>
              </p>
          </div>
      </div>
    </footer>
</div>
    )
}

export default Login;