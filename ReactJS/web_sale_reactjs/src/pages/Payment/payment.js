import * as request from "../../utils/request";
import images from "../../assets/images";
import "./payment.css";
import 'bootstrap/dist/css/bootstrap.css'; 

function Payment(){
    return (
        <div class="body_box container col-7">
            <div class="address_box">
                <div class="address_title row text-start">
                    <div>
                        <i class="fa-solid fa-location-dot"></i>
                        <span>Địa chỉ nhận hàng</span>
                    </div>
                </div>
                <div class="address_info row justify-content-between">
                    <div class="col-auto fw-bold">
                        <span>Nguyễn Văn A</span>
                        <span>(+84)123456789</span>
                    </div>
                    <div class="col-auto">
                        <span>1 đường A, phường B, Quận 1, Tp.HCM</span>
                    </div>
                    <div class="col-auto">
                        <a class="link-dark" data-bs-toggle="collapse" href="#address_change">Thay đổi</a>
                    </div>
                </div>
            </div>
            <div class="address_change collapse" id="address_change">
                <div class="row mb-2">
                    <div class="col-12">
                        <label for="#" class="form-label">Địa chỉ</label>
                        <input type="text" class="form-control" value="1 đường A"/>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-4">
                        <label for="#" class="form-label">Thành phố</label>
                        <select class="form-select" required>
                        <option selected value="">Tp.HCM</option>
                        <option value="">Hà Nội</option>
                        <option value="">Đà Nẵng</option>
                        </select>
                    </div>
                    <div class="col-4">
                        <label for="#" class="form-label">Quận</label>
                        <select class="form-select" required>
                        <option selected value="">Quận 1</option>
                        <option value="">Quận 2</option>
                        <option value="">Quận 3</option>
                        <option value="">Quận 4</option>
                        <option value="">Quận 5</option>
                        </select>
                    </div>
                    <div class="col-4">
                        <label for="#" class="form-label">Phường</label>
                        <select class="form-select" required>
                        <option selected value="">Phường A</option>
                        <option value="">Phường B</option>
                        <option value="">Phường C</option>
                        <option value="">Phường D</option>
                        <option value="">Phường E</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-9"></div>
                    <div class="col-3">
                        <button class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#address_change">
                            Hủy
                        </button>
                        <button class="btn btn-success" type="button" data-bs-toggle="collapse" data-bs-target="#address_change">
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
            <div class="product_list">
                <table>
                    <tr>
                        <th class="ps-5" colspan="2">Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                    </tr>
                    <tr>
                        <td class="col-2">
                            <img class="payment_product rounded mx-auto d-block" src={images.paymen_1} alt=""/>
                        </td>
                        <td class="col-4">
                            <span class="fw-bold">Đầm cổ yếm xòe</span>
                            <br/>
                            <span>màu Hồng, size M</span>
                        </td>
                        <td class="col-2">300000</td>
                        <td class="col-2">2</td>
                        <td class="col-2">600000</td>
                    </tr>
                    <tr>
                        <td class="col-2">
                            <img class="payment_product rounded mx-auto d-block" src={images.paymen_1} alt=""/>
                        </td>
                        <td class="col-4">
                            <span class="fw-bold">Đầm cổ yếm xòe</span>
                            <br/>
                            <span>màu Hồng, size M</span>
                        </td>
                        <td class="col-2">300000</td>
                        <td class="col-2">2</td>
                        <td class="col-2">600000</td>
                    </tr>
                    <tr>
                        <td class="col-2">
                            <img class="payment_product rounded mx-auto d-block" src={images.paymen_1} alt=""/>
                        </td>
                        <td class="col-4">
                            <span class="fw-bold">Đầm cổ yếm xòe</span>
                            <br/>
                            <span>màu Hồng, size M</span>
                        </td>
                        <td class="col-2">300000</td>
                        <td class="col-2">2</td>
                        <td class="col-2">600000</td>
                    </tr>
                </table>
            </div>
            <div class="payment_info">
                <div class="row justify-content-end">
                    <div class="col-3">
                        <span>Voucher của shop:</span>
                    </div>
                    <div class="col-4"></div>
                    <div class="col-2 text-end">
                        <span class="discount_price">-12000đ</span>
                    </div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-3">
                        <span>Đơn vị vận chuyển:</span>
                    </div>
                    <div class="col-4">
                        <select class="form-select" required>
                            <option selected value="">Giao hàng tiêu chuẩn</option>
                            <option value="">Giao hàng hỏa tốc</option>
                        </select>
                    </div>
                    <div class="col-2 text-end">
                        <span>32000đ</span>
                    </div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-3">
                        <span>Phương thức thanh toán</span>
                    </div>
                    <div class="col-4">
                        <select class="form-select" required>
                            <option selected value="">Thanh toán khi nhận hàng</option>
                            <option value="">Chuyển khoản</option>
                        </select>
                    </div>
                    <div class="col-2"></div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-7 text-end">
                        <span class="fs-4">Tổng số tiền:</span>
                    </div>
                    <div class="col-2 text-end">
                        <span class="discount_price fs-4 fw-bold">1820000đ</span>
                    </div>
                </div>
            </div>
            <div class="payment_confirm justify-content-end">
                <button class="button_confirm float-end">Hoàn tất đơn hàng</button>
            </div>
        </div>
    );
}


export default Payment;