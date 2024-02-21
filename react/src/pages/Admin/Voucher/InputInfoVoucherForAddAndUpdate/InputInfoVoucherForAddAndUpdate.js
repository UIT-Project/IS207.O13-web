
import 'bootstrap';
import request from "../../../../utils/request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faFloppyDisk, faL, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import CurrencyInput from 'react-currency-input-field';

import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";

function InputInfoVoucher({nameFunction, functionSaveInfo, isEmpty, isUpdating, setIsUpdating}){
    const nameFunctionIsAdd = 'add';
    const nameFunctionIsUpdate = 'update';
    const searchParams  = new URLSearchParams(window.location.search);
    const [watchVoucherDetail, setWatchVoucherDetail] = useState(false);
    const [infoVoucher, setInfoVoucher] = useState({
        showNameVoucher: '',
        minOrderValue: 0,
        maxDecreaseMoney: 5000000,
        typeVoucher: '',
        desctiption: '', 
        quantityUse: 50, 
        startDate: '',
        endDate: '',
        decreasePersent: 0,
    });  

    useEffect(() => {   
        console.log("thay đổi masp", isUpdating, nameFunction)
        const mavoucher = searchParams.get('mavoucher');
        if(mavoucher !== null){ 
            handleWatchVoucherDetail('default but don;t use', searchParams.get('mavoucher'))
        }   
        // else    
        //     setWatchProductDetail(false);
    }, [window.location.search]);

    const getInforVoucherDetail = (mavoucher) => {
        const data = {
            mavoucher: mavoucher,
        } 
        request.get(`/api/infoVoucherDetail`, {params: data})
        .then(res => {    
            console.log(res.data.dataVoucherDetail_sanphams[0], 'cạc3', mavoucher)
            setInfoVoucher({
                showNameVoucher: res.data.dataVoucherDetail_sanphams[0].MAVOUCHER,
                minOrderValue: res.data.dataVoucherDetail_sanphams[0].GIATRI_DH_MIN,
                maxDecreaseMoney: res.data.dataVoucherDetail_sanphams[0].GIATRI_GIAM_MAX,
                typeVoucher: res.data.dataVoucherDetail_sanphams[0].PHANLOAI_VOUCHER,
                desctiption: res.data.dataVoucherDetail_sanphams[0].MOTA, 
                quantityUse: res.data.dataVoucherDetail_sanphams[0].SOLUONG, 
                startDate: res.data.dataVoucherDetail_sanphams[0].THOIGIANBD,
                endDate: res.data.dataVoucherDetail_sanphams[0].THOIGIANKT,
                decreasePersent: parseFloat(res.data.dataVoucherDetail_sanphams[0].GIATRIGIAM),
            })
            console.log(parseFloat(res.data.dataVoucherDetail_sanphams[0].GIATRIGIAM), 'data')
            setWatchVoucherDetail(true); 

        })
    };

    const handleWatchVoucherDetail = (item, mavoucher) => {
        getInforVoucherDetail(mavoucher); 
        console.log(item)
        // Navigate(`/admin/updateVoucher?nameStatus=${[item.key]}&numberPagination=${[item.value.openingPage]}&masp=${masp}`);
    }

    const handleInputInfoVoucher = (e) => {
        // e.persist();
        let {value, name} = e.target;

        const regex_showNameVoucher = /^[a-zA-Z0-9]*$/;
        const regex_ChiNhapSo = /^\d*$/;
 
        if(name === 'showNameVoucher' && regex_showNameVoucher.test(value)){
            setInfoVoucher({...infoVoucher, [name]: value}); 
        } 
        else if((name === 'minOrderValue' || name === 'quantityUse'  || name === 'maxDecreaseMoney') && regex_ChiNhapSo.test(value)){
            // const numericValue = parseFloat(value);
            // const formattedValue = formatNumber(value); // Chuyển đổi giá trị số thành chuỗi hàng trăm nghìn triệu
            // console.log(formattedValue)
            setInfoVoucher({...infoVoucher, [name]: value}); 
        } 
        
        else if(name === 'typeVoucher' || name === 'decreasePersent' || name === 'startDate' || name === 'desctiption' || name === 'endDate'){
            if(name === 'decreasePersent') value = parseFloat(value)
            console.log(typeof(value))
            setInfoVoucher({...infoVoucher, [name]: value}); 


            console.log(name + "fff " + typeof(value));
        }

    }

    const handleInputInfoVoucher_vnd = (value, name) => {
        const regex_showNameVoucher = /^[a-zA-Z0-9]*$/;
        const regex_ChiNhapSo = /^\d*$/;
        if (value === undefined ) {
            console.log(value, 'value')
            value = 0; // Gán giá trị là '0' khi không còn giá trị nào trong trường input
            setInfoVoucher({ ...infoVoucher, [name]: value }); 
        } 
        else if ((name === 'minOrderValue' || name === 'maxDecreaseMoney') && regex_ChiNhapSo.test(value)) {
            setInfoVoucher({ ...infoVoucher, [name]: value }); 
        }
    }; 

    const renderDecreasePercent = () => {
        const options = [];

        for (let i = 5; i <= 100; i += 5) {
            options.push(
                <option key={i} value={i / 100}>
                    {i}%
                </option>
            );
        }

        return options;
    }


    return(
        <div>
            <div>
                <div class="col-auto"></div>
                <div class="body_box container col-lg-7">
                    
                    <div class="address_update" id="address_update">
                        <div class="row mb-2">
                            <div class="input_ten_div">
                                {/* <label for="#" class="form-label">Tên sản phẩm</label> */}
                                <input 
                                    type="text" class="form-control " placeholder="Mã voucher" 
                                    onChange={handleInputInfoVoucher} 
                                    name="showNameVoucher" 
                                    value={infoVoucher.showNameVoucher}
                                    disabled={nameFunction === nameFunctionIsAdd ? false  : true }
                                />
                                <span className={`red_color ${isEmpty && infoVoucher.showNameVoucher === '' ? '' : 'display_hidden'}`}>Nhập Mã voucher </span>
                            </div>
                        </div>
                        
                        <div class="row mb-3 phanLoai_chooseGiaTriGiam">
                            <div class="col-4">
                                <label for="#" class="form-label">Phân loại</label>
                                <select class="form-select" id="phan_loai_2" required
                                    onChange={handleInputInfoVoucher}
                                    name="typeVoucher"
                                    value={infoVoucher.typeVoucher} 
                                    disabled={isUpdating || nameFunction === nameFunctionIsAdd ? false  : true }
                                >
                                <option selected value=""></option>
                                <option value="Đơn hàng">Đơn hàng</option>
                                <option value="Vận chuyển">Vận chuyển</option> 
                                </select>
                                <span className={`red_color ${isEmpty && infoVoucher.typeVoucher === '' ? '' : 'display_hidden'}`}>Chọn phân loại </span>

                            </div> 
                            <div class="col-4">
                                <label for="#" class="form-label">Phần trăm giảm</label>
                                <select class="form-select" id="phan_loai_2" required
                                    onChange={handleInputInfoVoucher}
                                    name="decreasePersent"
                                    value={infoVoucher.decreasePersent} 
                                    disabled={isUpdating || nameFunction === nameFunctionIsAdd ? false  : true }
                                >
                                    <option selected value=""></option>
                                    {renderDecreasePercent()} 
                                </select>
                                <span className={`red_color ${isEmpty && infoVoucher.decreasePersent === 0 ? '' : 'display_hidden'}`}>Chọn phần trăm giảm </span>

                            </div> 
                        </div>
                        <div className="row mb-3 phanLoai_chooseGiaTriGiam">
                            <div class="col-4 inputDate">
                                <label className="form-label">Ngày bắt đầu</label> 
                                <input 
                                    type="date" 
                                    name="startDate" 
                                    className="form-control widthInputDate"
                                    onChange={handleInputInfoVoucher}
                                    value={infoVoucher.startDate}  
                                    disabled={isUpdating || nameFunction === nameFunctionIsAdd ? false  : true }
                                ></input>
                                <span className={`red_color ${isEmpty && infoVoucher.startDate === '' ? '' : 'display_hidden'}`}>Chọn ngày bắt đầu </span>
                                <span className={`red_color ${infoVoucher.startDate !== '' &&  new Date(infoVoucher.startDate)  <= new Date() ? '' : 'display_hidden'}`}>Ngày bắt đầu phải sau ngày hiện tại</span>

                            </div>
                            <div class="col-4 inputDate">
                                <label className="form-label">Ngày hết hạn</label>
                                <input 
                                    type="date" 
                                    name="endDate" 
                                    className="form-control widthInputDate"
                                    onChange={handleInputInfoVoucher}
                                    value={infoVoucher.endDate}
                                    disabled={isUpdating || nameFunction === nameFunctionIsAdd ? false  : true }
                                ></input>
                                <span className={`red_color ${isEmpty && infoVoucher.endDate === '' ? '' : 'display_hidden'}`}>Chọn ngày hết hạn </span>
                                <span className={`red_color ${infoVoucher.startDate !== '' && infoVoucher.startDate !== '' &&  new Date(infoVoucher.startDate)  >= new Date(infoVoucher.endDate) ? '' : 'display_hidden'}`}>Ngày hết hạn phải sau ngày bắt đầu</span>

                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12 input_gia" id="input_gia_1">
                                <div class="col-4 inputDate">
                                    <label for="#" class="form-label">Giá trị đơn hàng tối thiểu</label> 
                                    <CurrencyInput
                                        className="form-control widthInputDate"
                                        placeholder="Giá trị đơn hàng tối thiểu"
                                        onValueChange={(value, name) => handleInputInfoVoucher_vnd(value, name)}
                                        name="minOrderValue"
                                        value={infoVoucher.minOrderValue}
                                        allowNegativeValue={false} // Tùy chọn, để không cho phép giá trị âm
                                        decimalSeparator="," // Phân cách phần thập phân
                                        groupSeparator="." // Phân cách hàng nghìn
                                        suffix=" VND" // Đơn vị tiền tệ
                                        disabled={isUpdating || nameFunction === nameFunctionIsAdd ? false  : true }
                                    />
                                    <span className={`red_color ${isEmpty && infoVoucher.minOrderValue === '' ? '' : 'display_hidden'}`}>Nhập giá trị hoá đơn tối thiểu</span>

                                </div>
                                <div class="col-4 inputDate">
                                    <label for="#" class="form-label">Giá trị giảm tối đa</label> 
                                    <CurrencyInput
                                        className="form-control widthInputDate"
                                        placeholder="Tiền giảm tối đa"
                                        onValueChange={(value, name) => handleInputInfoVoucher_vnd(value, name)}
                                        name="maxDecreaseMoney"
                                        value={infoVoucher.maxDecreaseMoney}
                                        allowNegativeValue={false} // Tùy chọn, để không cho phép giá trị âm
                                        decimalSeparator="," // Phân cách phần thập phân
                                        groupSeparator="." // Phân cách hàng nghìn
                                        suffix=" VND" // Đơn vị tiền tệ
                                        disabled={isUpdating || nameFunction === nameFunctionIsAdd ? false  : true }
                                    />
                                    <span className={`red_color ${isEmpty && infoVoucher.maxDecreaseMoney === '' ? '' : 'display_hidden'}`}>Nhập giá trị giảm tối đa</span>

                                </div>
                            </div> 
                        </div>
                        <div className="row mb-3 phanLoai_chooseGiaTriGiam">
                            <label className="form-label">Số lần sử dụng</label>
                            <div class="col-6 soLanSuDungDiv">
                                <input 
                                    type="text" class="form-control" placeholder="Số lần sử dụng" 
                                    onChange={handleInputInfoVoucher}
                                    name="quantityUse"  
                                    value={infoVoucher.quantityUse}
                                    disabled={isUpdating || nameFunction === nameFunctionIsAdd ? false  : true }
                                />

                            </div> 
                                <span className={`red_color ${isEmpty && infoVoucher.quantityUse === '' ? '' : 'display_hidden'}`}>Nhập số lần sử dụng</span>
                        </div> 
                        <div className="row mb-3 phanLoai_chooseGiaTriGiam">
                            <label className="form-label">Mô tả</label>
                            <textarea 
                                id="w3review" name="desctiption" rows="4" cols="80"
                                className="w3review" placeholder="Nhập mô tả sản phẩm"
                                value={infoVoucher.desctiption} 
                                onChange={handleInputInfoVoucher}
                                disabled={isUpdating || nameFunction === nameFunctionIsAdd ? false  : true }
                            > 
                            </textarea>
                            <span className={`red_color ${isEmpty && infoVoucher.desctiption === '' ? '' : 'display_hidden'}`}>Nhập mô tả </span>

                        </div>
                        
                        
                    </div> 
                    
                </div>
                <div class="col-auto"></div>
            </div> 
            <div class="address_update_button_contain row"> 
                <button class="address_cancel_button btn btn-outline-secondary">Hủy</button> 
                <button class={`address_confirm_button btn btn-dark`} onClick={() => functionSaveInfo(infoVoucher)}>{nameFunctionIsAdd === nameFunction ? 'Thêm voucher' : 'Cập nhật'}</button>
            </div>
        </div>
    )
}
export default InputInfoVoucher;