import { useEffect, useRef, useState } from "react";
import images from "../../assets/images";
import './infoAccount.css';
import "bootstrap"
import { useParams } from "react-router-dom";
import request from "../../utils/request";
import useGlobalVariableContext from "../../context_global_variable/context_global_variable";

function InfoAccount() {
    return (
        <div>
            <div class="order_info_body container">
                <div class="heading text-uppercase text-center">
                    <h1>Thông tin tài khoản</h1>
                </div>
                <div class="form_container row">
                    <div class="container col-6">
                        <div class="row">
                            <p class="text-end col-2">Họ</p>
                            <input class="col-7" type="text" width="250"/>
                        </div>
                        <div class="name_row row">
                            <p class="text-end col-2">Tên</p>
                            <input class="col-7" type="text" width="250"/>
                        </div>
                        <div class="name_row row">
                            <p class="col-2">Ngày sinh</p>
                            <input class="col-3" type="date" width="250"/>
                        </div>
                        <div class="name_row row">
                            <p class="col-2">Giới tính</p>
                            <div class="col-7">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/>
                                        <label class="form-check-label" for="inlineRadio1">Nam</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
                                        <label class="form-check-label" for="inlineRadio2">Nữ</label>
                                </div>
                            </div>
                        </div>
                        <div class="name_row row">
                            <p class="text-end col-2">Email</p>
                            <input class="col-7" type="text" width="250"/>
                        </div>
                        <div class="name_row row">
                            <p class="text-end col-2">SĐT</p>
                            <input class="col-7" type="text" width="250"/>
                        </div>
                        <div class="name_row address row">
                            <p class="text-end col-2">Địa chỉ</p>
                            <input class="col-10" type="text" />
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="circular-image">
                            <img src="dog-meme.png" alt="Circular Image"/>
                        </div>
                        <input class="image-button" type="button" value="Chọn ảnh"/>
                    </div>
                    <div class="w-100"></div>
                    <input class="last-button" type="button" value="Lưu thay đổi"/>

                </div>

            </div>
        </div>
    )
}

export default InfoAccount;