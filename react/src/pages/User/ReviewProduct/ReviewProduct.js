import "./ReviewProduct.css"
import 'bootstrap/dist/css/bootstrap.css';
import request from "../../../utils/request";
import images from "../../../assets/images"; 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faL, faPaperPlane, faStar, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
 
function ReviewProduct() {

    // CÁCH PHẦN CẦN XỬ LÝ TRONG FILE NÀY
    // 1.Lấy dữ liệu sản phẩm trong giỏ hàng (bảng chitiet_giohangs) của tài khoản đang đăng nhập và hiển thị dữ liệu
    // 2.Xử lý khi người dùng checked, chọn và bỏ chọn một sản phẩm
    // 3.Cập nhật số lượng
    // 4.Xoá sản phẩm khỏi giỏ hàng
    // 5.Click để chuyển sang thanh toán

    //dùng ctrl + f để biết những hàm handle nằm ở thẻ tag nào trong phần return
    useEffect(() => {
        document.title = "DosiIn | Đánh giá sản phẩm"
    }, []);
    //isCheckedAll xử lý khi tất cả sản phẩm trong giỏ hàng được chọn để thanh toán
    const [isCheckedAll, setIsCheckedAll] = useState(false); 
    //itemCarts chứa thông tin từng sản phẩm trong giỏ hàng để hiển thị ra màn hình và thao tác
    const [itemCarts, setItemCart] = useState([]);
    const [tongTienAllItem, setTongTienAllItem] = useState(0);
    const [infoOrderDetail, setInfoOrderDetail] = useState({
        data_relative_Donhang: [],
        data_sanPham_relative_CTDH: [],
    }) 
    const [isReviewAll, setIsReviewAll] = useState(false);
    const [review, setReview] = useState(''); // Nội dung đánh giá
    //sử dụng để chuyển hướng web
    const Navigate = useNavigate();
    const searchParams  = new URLSearchParams(window.location.search);
    const madh = searchParams.get('madh');  
    //khi mà người dùng nhấn chọn tất cả thì itemCarts sẽ chạy qua tất cả các sản phẩm và cho nó giá trị trái với 
    //trạng thái nút clickAll, ví dụ nếu clickAll đang được tích thì khi nhấn tick thì tất cả sản phẩm sẽ không được chọn và ngược lại
    const [infoReviewAll, setInfoReviewAll] = useState({
        starQuantity: 0,
        contentReview: [],
    })
    const handleInputContentReview = (index, e) => {
        if(index === itemCarts.length){
            setInfoReviewAll({...infoReviewAll, contentReview: e.target.value})
        }
        else{
            setItemCart(prevItemCarts => {
                const updatedItemCarts = [...prevItemCarts]; // Tạo bản sao mới của mảng itemCarts
                updatedItemCarts[index] = { ...updatedItemCarts[index], contentReview: e.target.value }; // Thêm thuộc tính mới cho đối tượng tại index
                return updatedItemCarts; // Trả về mảng được cập nhật
            });    
        }
    };
    const handleClickCheckboxAll = () => {   
        itemCarts.forEach(item => {
            (!isCheckedAll ) ? item.SELECTED = 1 : item.SELECTED = 0;
        }) 
        setIsCheckedAll(!isCheckedAll);
        console.log(itemCarts, 'okokokok')
    }

     
    //trong này cẩn xử lý 3 cái
    const handleClickCheckbox = (index) => {  
        // 1 là chuyển đổi trạng thái của sản phẩm khi tick vào
        // nếu được chọn slected = 1 và ko thì = 0
        const listItemCarts = [...itemCarts]; 
        listItemCarts[index].SELECTED = (listItemCarts[index].SELECTED === 0) ? 1 : 0;
     
        setItemCart(prevItemCarts => {
            const updatedItemCarts = [...prevItemCarts]; // Tạo bản sao mới của mảng itemCarts
            console.log(updatedItemCarts[index].SELECTED, 'ksdkkkkkkkkk' );
            updatedItemCarts[index] = { 
                ...updatedItemCarts[index], 
                SELECTED: listItemCarts[index].SELECTED
            }; // Thêm thuộc tính mới cho đối tượng tại index
            return updatedItemCarts; // Trả về mảng được cập nhật
        });  
        setIsCheckedAll(listItemCarts.every((itemCarts) => itemCarts.SELECTED)); 
  
    };

    //cái này cũng xử lý 3 cái giống ở trên
    const hanelInputSoLuong = (index, event) => {

        const ListItemCarts = [...itemCarts];
        ListItemCarts[index].SOLUONG = parseInt(event.target.value, 10);
        ListItemCarts[index].TONGGIA = ListItemCarts[index].SOLUONG * ListItemCarts[index].GIABAN;
        setItemCart(ListItemCarts); 

        let tinhtongtien = 0;
        ListItemCarts.map(item => tinhtongtien = tinhtongtien + item.TONGGIA)
        setTongTienAllItem(tinhtongtien);
        
        const infoUpdateQuantityItemCart = {
            matk: parseInt(localStorage.getItem('auth_matk')),
            masp: itemCarts[index].MASP,
            mamau: itemCarts[index].MAMAU,
            masize: itemCarts[index].MASIZE, 
            soluong: itemCarts[index].SOLUONG,
            tonggia: itemCarts[index].SOLUONG * itemCarts[index].GIABAN,
        } 

        try{
            request.post("/api/updateQuantityProperty", infoUpdateQuantityItemCart)
            .then(res => {  
                console.log(res.data.matk);
            })
        }
        catch(err){ 
            console.log(err);
        }

    }

    //chuyển hướng sang thanh toán
    const handleClickPayment = () => { 
        Navigate("/payment");
    }

    const handleContinuelyBuy = () => {
        // Navigate("/payment");
    }

    //xử lý xoá sản phẩm giống với cập nhật số lượng và chọn sản phẩm ddthanh toán
    const handleClickSaveReview = (item, index) => {
        let infoSaveReview = {
            madh: madh,
            maxdsp: 1,
            masp: 1,
            soluongsao: 5,
            noidungdanhgia: 'cảm ơn',
            matk: localStorage.getItem('auth_matk'),
        }
        if(index === itemCarts.length){
            infoSaveReview = {
                madh: madh,
                maxdsp: itemCarts.map(item => item.MAXDSP),
                soluongsao: infoReviewAll.starQuantity,
                noidungdanhgia: infoReviewAll.contentReview,
                matk: localStorage.getItem('auth_matk'),
                masp: itemCarts[0].MASP
            }
            console.log(infoSaveReview, 'ksjdkllll')
        }
        else{
            infoSaveReview = {
                madh: madh,
                maxdsp: [item.MAXDSP],
                soluongsao: item.starQuantity,
                noidungdanhgia: item.contentReview,
                matk: localStorage.getItem('auth_matk'),
                masp: item.MASP
            }
        } 
        console.log(infoSaveReview);
        request.post('/api/saveReviewProduct', infoSaveReview) 
        .then(res => {
            console.log(res.data.message);

            if(index === itemCarts.length){
                itemCarts.splice(0, itemCarts.length);  
            }
            else{
                itemCarts.splice(index, 1); 
            }
            const listItemCarts = [...itemCarts];
            setItemCart(listItemCarts); 
        })   
    }
    const getInforOrderDetail = (madh) => {
        const data = {
            madh: madh
        }
        request.get(`/api/infoOrderDetail`, {params: data})
        .then(res => {  
            // if(typeof res.data.data_relative_Donhang !== 'object')
                setInfoOrderDetail({
                    data_relative_Donhang: res.data.data_relative_Donhang[0],
                    data_sanPham_relative_CTDH: res.data.data_sanPham_relative_CTDH,
                })
            // else
            // setInfoOrderDetail({
            //     data_relative_Donhang: res.data.data_relative_Donhang,
            //     data_sanPham_relative_CTDH: res.data.data_sanPham_relative_CTDH,
            // }) 
            console.log(res, ' ', infoOrderDetail, ' ', madh);
        })
    };

    //lấy ra danh sách sản phẩm trong giỏ hàng với mã tài khoản
    const handleGetListProductCart = () => {
        const data = {
            madh: madh
        }
        request.get(`/api/infoOrderDetail_myOder`, {params: data})
        .then(res => {  
            console.log(res.data.data_sanPham_relative_CTDH, 'kjsdkjsdks')
            const infoCartReverse = res.data.data_sanPham_relative_CTDH.map(item => {
                return {
                    ...item,
                    starQuantity: 0,
                    contentReview: '',
                    SELECTED: 0,
                }
            })
            setItemCart( infoCartReverse );    
            
            setIsCheckedAll(infoCartReverse.every((itemCarts) => itemCarts.SELECTED)); 
            let tinhtongtien = 0;
            infoCartReverse.map(item => tinhtongtien = tinhtongtien + item.TONGGIA)
            setTongTienAllItem(tinhtongtien); 
            console.log(res.matk);
            if(res.data.data_sanPham_relative_CTDH.length === 0)
                setIsReviewAll(true)
        })
        .catch(e => {
            console.log(e);
        })  
    }

    useEffect(() => {
        handleGetListProductCart();
    }, [])

    // const [rating, setRating] = useState([]); // State để lưu điểm số đánh giá

    const handleRating = (value, index) => {
        // setRating(value); // Cập nhật điểm số khi người dùng chọn
        // Tùy vào nhu cầu, bạn có thể gửi điểm số này lên server ở đây
        // setRating(prevRatings => {
        //     const updatedRatings = [...prevRatings];
        //     updatedRatings[index] = value;
        //     return updatedRatings;
        // });
        if(isCheckedAll && index === itemCarts.length){
            setInfoReviewAll({...infoReviewAll, starQuantity: value})
        }
        else if(!isCheckedAll && index !== itemCarts.length){
            setItemCart(prevItemCarts => {
                const updatedItemCarts = [...prevItemCarts]; // Tạo bản sao mới của mảng itemCarts
                updatedItemCarts[index] = { ...updatedItemCarts[index], starQuantity: value }; // Thêm thuộc tính mới cho đối tượng tại index
                return updatedItemCarts; // Trả về mảng được cập nhật
            });  
        }   
    };

    const handleDirectory = (route) => {
        if(route === 'Trang chủ')
            window.location.href = `/`;
        else if(route === 'Đơn hàng')
        window.location.href = `/myorder`;
    }

    const handleTurnBack = () => {
        Navigate('/myorder')
    }

    useEffect(() => {
        if(isCheckedAll){
            setItemCart(prevItemCarts => {
                const updatedItemCarts = prevItemCarts.map(item => ({
                    ...item,
                    starQuantity: 0,
                    contentReview: '',
                    // Thêm các thuộc tính khác nếu cần
                }));
                return updatedItemCarts;
            });
        }
        else{
            setInfoReviewAll({
                starQuantity: 0,
                contentReview: '',
            })
        }
    }, [isCheckedAll])

    const renderStar = (item, index) => {
        const stars = []; 
        for (let i = 1; i <= 5; i++) {
        stars.push(
            <FontAwesomeIcon
                icon={faStar}
                key={i}
                onClick={() => handleRating(i, index)}
                style={{ color: i <= (index === itemCarts.length ? infoReviewAll.starQuantity : item.starQuantity )? 'gold' : 'gray', cursor: 'pointer' }}
            />
        );
        }
        return stars;
    };

    const renderInfoCart = itemCarts.map((item, index) => {   
        
        return (
            <tr class="row1" key={index}>
                <td>
                    <input 
                        type="checkbox" 
                        name="checkboxProductInCart" id=""   
                        checked = {(item.SELECTED === 1) ? true : false}   
                        onChange={() => handleClickCheckbox(index)}
                    />
                </td>

                <td class="rowitem">
                    <div class="box-row1-column1">
                        <div class="row1-column1-item">
                            <img class="img-row1" src={item.imgURL} alt=""/>
                        </div>
                        <div class="row1-column1-item" id="itemm">
                            <p>
                                {item.TENSP} <br/>
                                Màu: {item.TENMAU} <br/>
                                Size: {item.MASIZE}
                            </p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="box-row1-column2 box-row1">
                        {/* <b class="row1-item">{item.GIABAN}</b> */} 
                            {renderStar(item, index)}
                    </div>
                </td>
                <td>
                    <div class="box-row1-column3 box-row1" id="box_review">
                        <textarea
                            placeholder="Nhập đánh giá của bạn..."
                            value={item.contentReview}
                            onChange={(e) => handleInputContentReview(index, e)}
                            style={{
                                width: '100%',
                                height: '100px',
                                marginTop: '10px',
                                borderRadius: '8px', // Border radius cho ô nhập đánh giá
                                padding: '8px' // Thêm padding cho ô nhập để đẹp hơn
                            }}
                            disabled={isCheckedAll ? true : false}
                        /> 
                    </div>
                </td> 
                <td>
                    <div class="box-row1-column5 box-row1">
                        <button 
                            class="btn-delete" id="btn_deletee"
                            onClick={() => handleClickSaveReview(item, index)}
                            disabled={isCheckedAll ? true : false}
                        >
                            <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                        </button> 
                    </div>
                </td>
                
            </tr>
        )
    })

    return( 
    <div class="container mt-3 container-content">
        <div className="faCircleChevronLeft_div">
            <span onClick={handleTurnBack}  className="faCircleChevronLeft">
                <FontAwesomeIcon class={`fa-solid faCircleChevronLeft_reviewProduct`} icon={faCircleChevronLeft} ></FontAwesomeIcon>
            </span>
        </div>
        <h1 class="text-header-content">Đánh giá sản phẩm</h1>
        <div className={`${itemCarts.length === 0 && isReviewAll ? 'display_hidden' : ''}`}>
            <div class="tbody_table_cart">

                <table class="table table-hover">
                    <thead class="table-header">
                        <tr class="table-header-row">
                            <th class="header-column0">                        
                                <input 
                                    type="checkbox" 
                                    name="checkboxProductInCart" id=""  
                                    checked = {isCheckedAll} 
                                    onChange={handleClickCheckboxAll}
                                />
                            </th>
                            <th class="header-column1">Sản phẩm</th>
                            <th class="header-column2">Đánh Giá</th>
                            <th class="header-column3">Nội dung đánh giá</th> 
                            <th class="header-column5">  
                                {/* <button><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></button> */}
                            </th> 
                        </tr>
                    </thead>
                        <tbody>
                            {renderInfoCart} 
                        </tbody> 
                </table>
            </div>
            <div class="container mt-5 content-bottom_review">
                <div class="review_all">
                    <div class="review_checkbox">
                            <input 
                                type="checkbox" 
                                name="checkboxProductInCart" id=""  
                                checked = {isCheckedAll} 
                                onChange={handleClickCheckboxAll}
                            />
                    </div>
                    <div class="span_danhgia">Đánh giá tất cả: </div>
                   
                </div>
              
                <div class="box-row1-column2 box-row1" id="start_1">
                    {/* <b class="row1-item">{item.GIABAN}</b> */} 
                        {renderStar(0, itemCarts.length)}
                </div>
                <div class="box-row1-column3 box-row1" id="boxreview">
                    <textarea
                        placeholder="Nhập đánh giá của bạn..."
                        value={infoReviewAll.contentReview}
                        onChange={(e) => handleInputContentReview(itemCarts.length, e)}
                        style={{
                            width: '100%',
                            height: '100px',
                            marginTop: '10px',
                            borderRadius: '8px', // Border radius cho ô nhập đánh giá
                            padding: '8px' // Thêm padding cho ô nhập để đẹp hơn
                        }}
                        disabled={!isCheckedAll ? true : false}
                    /> 
                </div>
                <div class="box-row1-column5 box-row1" id="delete_1">
                    <button 
                        class="btn-delete" id="btn_deletee"
                        onClick={() => handleClickSaveReview(0, itemCarts.length)}
                        disabled={!isCheckedAll ? true : false}
                    >
                        <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                    </button> 
                </div>
            
            </div>
        </div>
        <div className={`${itemCarts.length === 0 ? '' : 'display_hidden'}`}>
            Cám ơn bạn đã thực hiện đánh giá
            <div>
                <button className="btn" onClick={()=>handleDirectory('Trang chủ')}>
                    Trang chủ
                </button>
                <button className="btn" onClick={()=>handleDirectory('Đơn hàng')}>
                    Đơn hàng
                </button>
            </div>
        </div>
        <div class="container mt-5 content-bottom">
            {/* <div>
                <button class="btn-continue" onClick={handleContinuelyBuy}>Trở lại</button>
            </div> */}
            {/* <div class="box-thanh-toan">
                <div class="box-thanh-toan-discount">
                    <p><b>Mã giảm giá</b></p>
                    <p>Chọn hoặc nhập mã</p>
                </div>
                <hr class="line-thanh-toan"/>
                <div class="box-thanh-toan-tongtien">
                    <p><b>Tổng tiền</b></p>
                    <p class="total">
                        <b>
                            {tongTienAllItem}
                            đ
                        </b>
                    </p>
                </div>
                <div class="box-thanh-toan-button">
                    <button class="btn-thanh-toan" onClick={handleClickPayment}>THANH TOÁN</button>
                </div>
            </div> */}
        </div>
        </div>
    )
}
export default ReviewProduct;