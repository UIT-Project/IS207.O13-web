import './index.css'

function Footer(){
    return <footer className='mauchu_footer_defaultLayout'>
    <div class="container_footer">
        <div class="container container_footer_in">
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
                        <li class="footer__policy_li">Những câu hỏi thường gặp</li>
                        <li class="footer__policy_li">Chính sách thành viên</li>
                        <li class="footer__policy_li">Chính sách thanh toán</li>
                        <li class="footer__policy_li">Chính sách vận chuyển</li>
                        <li class="footer__policy_li">Chính sách khiếu nại</li>
                        <li class="footer__policy_li">Chính sách đổi trả</li>
                        <li class="footer__policy_li">Chính sách bảo hành</li>
                    </ul>
                </div>
                <div class="col-sm-3">
                    <h3>Fanpage</h3>
                    <i class="contact_info__icon fa-brands fa-facebook"></i>
                    <i class="contact_info__icon fa-brands fa-square-instagram"></i>
                    <i class="contact_info__icon fa-brands fa-linkedin"></i>
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
}

export default Footer;