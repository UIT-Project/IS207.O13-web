import images from "../../../assets/images"; 
import './paymentResult.css'
import 'bootstrap/dist/css/bootstrap.css'; 
import request from "../../../utils/request";
import { useEffect, useState } from "react";
import { Button } from "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";
import { faCheck } from "@fortawesome/free-solid-svg-icons";


function PaymentResult(){  
    //sau khi thanh toán thì vnpay sẽ trỏ về lại tên miền của mình, kèm theo các thông tin được kèm  trong url
    //  http://localhost:3000/paymentResult?vnp_Amount=500000?vnp_BankCode=VCB đây là ví dụ
    //sau đó sử dụng URLSearchParams để lấy những thông số này và hiển thị ra màn hình cũng như cập nhật trạng thái 
    //thanh toán của đơn hàng online này
    //trang này chỉ đọc qua tổng quan để biết nó làm gì, khỏi cần đọc phần xử lý
    useEffect(() => {
        document.title = "DosiIn | Thanh toán thành công"
    }, []);
    const urlParams = new URLSearchParams(window.location.search);
    const [infoPaymentResult, setInfoPaymentResult] = useState({
        vnp_Amount: urlParams.get('vnp_Amount'),
        vnp_BankCode: urlParams.get('vnp_BankCode'),
        vnp_BankTranNo: urlParams.get('vnp_BankTranNo'),
        vnp_OrderInfo: urlParams.get('vnp_OrderInfo'),
        vnp_PayDate: urlParams.get('vnp_PayDate'),
        vnp_ResponseCode: urlParams.get('vnp_ResponseCode'),
        vnp_TxnRef: urlParams.get('vnp_TxnRef'),
        vnp_TransactionStatus: urlParams.get('vnp_TransactionStatus'),
        vnp_SecureHash: urlParams.get('vnp_SecureHash'),
        vnp_TransactionNo: urlParams.get('vnp_TransactionNo'),
    }); 
 

    const handlePaymentResult = () => {
        console.log(infoPaymentResult)
        request.post(`/api/processPaymentResult`, infoPaymentResult)
        .then(res => {
            console.log(res.data)   
        })
    }

    useEffect(() => {  
        handlePaymentResult();
    }, []);  
     
    return ( 
        <div class="container">  
            <div className="row"> 
                <h6>Số tiền thanh toán: {infoPaymentResult.vnp_Amount}</h6>
                <h6>Mã ngân hàng thanh toán: {infoPaymentResult.vnp_BankCode}</h6>
                <h6>Mã giao dịch: {infoPaymentResult.vnp_BankTranNo}</h6>
                <h6>Nội dung thanh toán: {infoPaymentResult.vnp_OrderInfo}</h6>
                <h6>Trạng thái thanh toán: {infoPaymentResult.vnp_ResponseCode == '00' ? "Thành công" : "Không thành công"}</h6>
                <h6>Mã đơn hàng: {infoPaymentResult.vnp_TxnRef}</h6>
            </div>  
        </div>
    )
}

export default PaymentResult;