import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth_token = localStorage.getItem('auth_token');
        const auth_email = localStorage.getItem('auth_email');
        const auth_matk = localStorage.getItem('auth_matk');
        const auth_role = localStorage.getItem('auth_role');
        console.log(auth_role, 'auth_role')
        // Kiểm tra xem auth_token đã tồn tại hay chưa
        if (!auth_token && !auth_email && !auth_matk && !auth_role) {
            // Nếu không có auth_token, điều hướng đến trang login
            navigate('/admin/adminLogin');
        }
        if(auth_role === null) navigate('/admin/adminLogin');
    }, [navigate]);

    return;
};

export default useAuthCheck;