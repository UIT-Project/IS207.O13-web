import images from "../../assets/images"; 
import './collection.css'
import 'bootstrap/dist/css/bootstrap.css'; 
import request from "../../utils/request";
import { useEffect, useState } from "react";
import { Button } from "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
// import useGlobalVariableContext from "../../context_global_variable/context_global_variable";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import useGlobalVariableContext from "../../context_global_variable/context_global_variable";

function Collection(){ 

    // trang này hiển thị thông tin sản phẩm tìm kiếm được khi search ở thanh tìm kiếm trong header
    // sau đó sử dụng các bộ lọc để lọc sản phẩm
    // sau khi đọc các trang trước thì trang này mọi người có thể soi code để hiểu
    const {formatPrice, setCategory1, category1} = useGlobalVariableContext(); 
    console.log(category1, 'newCategory')
    const numberOrderEachPage = 20;
    const { resultQuery, setResultQuery, textQuery, setTextQuery} = useGlobalVariableContext();
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0); 


    const [loadNewList, setLoadNewList] = useState(0);
    const [filter, setFilter] = useState('moinhat');
    const [mapl_sp2, setMapl_sp2] = useState(1);
    const [listFilter, setListFilter] = useState([
        {
            name_filter: 'moinhat',
            name_show: 'Mới nhất'
        }, 
        {
            name_filter: 'banchay',
            name_show: 'Bán chạy'
        }, 
        {
            name_filter: 'thapDenCao',
            name_show: 'Thấp đến cao'
        }, 
        {
            name_filter: 'caoDenThap',
            name_show: 'Cao xuống thấp'
        },
    ])
    const [listProductCategory2, setListProductCategory2] = useState([])
    const searchParams  = new URLSearchParams(window.location.search); 
    const mapl_sp = searchParams.get('mapl_sp') ? searchParams.get('mapl_sp') : 1;
    const [query, setQuery] = useState(searchParams.get('query'));

    const [state_mapl_sp, setState_mapl_sp] = useState(parseInt(searchParams.get('mapl_sp')));
    const [state_query, setState_query] = useState(searchParams.get('query'));


    const [orderStatus, setOrderStatus] = useState({
        collection:{
            nameState: parseInt(mapl_sp),
            orderList: [],
            pageQuantity: null,
            paginationList: [],
            openingPage: 1,
            hasLoadFirtTime: 0,
            hasChangeFromPreState: 0,
            itemQuantity: 0,
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
    })
    const orderStatus_Array = Object.entries(orderStatus).map(([key, value]) => (
        {
            key: key,
            value: value
        }
    )) 
    const handleClickFilter = (type_mapl_sp2, type_filter) => {
        const item_status = orderStatus_Array[0]
        const updateOpeningPage = prevOrderStatus => (
            {
                ...prevOrderStatus, 
                [item_status.key] : {...prevOrderStatus[item_status.key],  openingPage:  1}
            }
        );
        setOrderStatus({
            collection:{
                nameState: parseInt(mapl_sp),
                orderList: [],
                pageQuantity: null,
                paginationList: [],
                openingPage: 1,
                hasLoadFirtTime: 0,
                hasChangeFromPreState: 0,
                itemQuantity: 0,
                spaceGetDataFromOrderList: [{
                    paginationNumber: 1,
                    ordinalNumber: 1,
                    startIndex: 0,
                    endIndex: numberOrderEachPage,
                }]
            },
        })  
        setFilter(type_filter); 
        setMapl_sp2(type_mapl_sp2); 
        setPaginationNumberRunFirst(0);
        // getQuantityCollectionToDevidePage(type_mapl_sp2)
        getInfoCollection(1, type_mapl_sp2, type_filter)
        console.log(type_mapl_sp2, type_filter, 'type')
    }
    // const handleClickCategory2 = (type) => {
    //     setMapl_sp2(type); 
    //     getInfoCollection(1, type, filter)
    //     console.log(type, 'type')
    // }

    useEffect(() => {   
        if(paginationNumberRunFirst === 0 ){
            orderStatus_Array.map(item => getInfoCollection(1, mapl_sp2, filter))
            // getQuantityCollectionToDevidePage(mapl_sp2) 
        }
        // getInforOrderDetail(1);  
    }, [paginationNumberRunFirst === 0])

    const getDetailCategory2 = () => {
        // const data = {
        //     typeProduct_mapl: infoAddNewProduct.typeProduct
        // }
        request.get(`api/getDetailCategory2`, {params: {typeProduct_mapl: mapl_sp}})
        .then(res => {
            console.log(res.data.listDetailCategory2)
            setListProductCategory2(res.data.listDetailCategory2)
        })                                                                                      
        .catch(err => {
            console.log( err)
        })
    } 

    const getQuantityCollectionToDevidePage = (mapl_sp2) => { 
        const data = {
            mapl_sp: parseInt(mapl_sp), 
            mapl_sp2: parseInt(mapl_sp2),
            query_data: query,
        }
        console.log('SL_MASP', data)
        request.get('/api/getQuantityCollectionToDevidePage',  {params: data})
        .then(res=> {
            orderStatus_Array.forEach(itemStatus => {
                let found = false;
                res.data.quantity.forEach(itemStatusFromDB => {
                    // if(itemStatusFromDB.MAPL_SP === itemStatus.value.nameState)
                    // {
                        found = true

                        const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MASP / numberOrderEachPage)  

                        let arrAddToPaginationList = [];
                        for(let i = 1; i <= pageQuantityShow; i++)
                            arrAddToPaginationList.push(i);
                        // console.log(pageQuantityShow);
                        setOrderStatus(prevOrderStatus => ({
                            ...prevOrderStatus, 
                                [itemStatus.key] : 
                                    {...prevOrderStatus[itemStatus.key],  
                                    pageQuantity: itemStatusFromDB.SL_MASP, 
                                    paginationList: arrAddToPaginationList}
                        }))
                    // }
                })
                // if(found === false){
                //     setOrderStatus(prevOrderStatus => ({
                //         ...prevOrderStatus, 
                //         [itemStatus.key] : 
                //             {...prevOrderStatus[itemStatus.key],  
                //             pageQuantity: 0, 
                //             paginationList: []}
                //     }))
                // } 
            });
            
            // console.log(orderStatus) 
        })  
        .catch(err => {
            console.log(err)
        })
    } 

    const getInfoCollection =  (openingPage, ma_category2, filter2) => {     

        const itemInOrderStatus_Array= orderStatus_Array[0]
        console.log(itemInOrderStatus_Array.value.openingPage, 'openingPage')
        const queryForGetInfoCollection = { 
            start: numberOrderEachPage * ( openingPage - 1),
            collection: orderStatus_Array[0].value.nameState,
            numberOrderEachPage: numberOrderEachPage,
            mapl_sp: parseInt(mapl_sp), 
            mapl_sp2: ma_category2,
            filter: filter2,
            query_data: query
        }   
        console.log(queryForGetInfoCollection, 'queryForGetInfoCollection')

        try{
            request.get(`/api/getInfoCollection`, {params: queryForGetInfoCollection}) 
            .then(res=>{      
                console.log(res, 'getInfoCollection', openingPage, paginationNumberRunFirst)
                setOrderStatus(prevOrderStatus => {
                    const itemIndex = prevOrderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.findIndex(
                        item => item.paginationNumber === openingPage
                    );
                    let arrAddToPaginationList = []
                    let SL_MASP = 0 
                    res.data.quantity.forEach(itemStatusFromDB => { 
                        const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MASP / numberOrderEachPage)  
 
                        for(let i = 1; i <= pageQuantityShow; i++)
                            arrAddToPaginationList.push(i); 
                        SL_MASP = itemStatusFromDB.SL_MASP
                    })    

                    if(itemIndex === -1 || (openingPage === 1 && paginationNumberRunFirst === 0)){
                        setPaginationNumberRunFirst(1);
                        console.log('arrAddToPaginationList', SL_MASP, arrAddToPaginationList )
                        console.log(res.data, 'okk', orderStatus_Array[0].value.spaceGetDataFromOrderList) ;

                        return {
                            ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                            [itemInOrderStatus_Array.key] : 
                            {   
                                ...prevOrderStatus[itemInOrderStatus_Array.key], 
                                orderList: [ 
                                    ...prevOrderStatus[itemInOrderStatus_Array.key].orderList.filter(item => item),
                                    ...res.data.orderList_DB.filter(item => item) 
                                ], 
                                pageQuantity: SL_MASP,
                                paginationList: arrAddToPaginationList,
                                spaceGetDataFromOrderList: [
                                    ...orderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList,
                                    {
                                        paginationNumber: openingPage,
                                        ordinalNumber: orderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.length + 1,
                                        startIndex: orderStatus[itemInOrderStatus_Array.key].orderList.length,
                                        endIndex: res.data.orderList_DB.length + orderStatus[itemInOrderStatus_Array.key].orderList.length,
                                    },
                                ] 
                            }
                        } 
                    }
                    else{  
                        console.log(res.data, 'getInfoCollection', openingPage, paginationNumberRunFirst, itemIndex, orderStatus_Array[0].value.spaceGetDataFromOrderList)

                        return {
                            ...prevOrderStatus, 
                        } 
                    } 
                }) 
                // orderStatus[itemInOrderStatus_Array.key].paginationList.filter((item, index) => 
                //     orderStatus[itemInOrderStatus_Array.key].paginationList.indexOf(item) === index
                // );     
            }) 
        }
        catch(err){
            console.log(err)
        } 
    }

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };
    const handleClickItemPagination = (item_pagina) => {
        const item_status = orderStatus_Array[0]
        const updateOpeningPage = prevOrderStatus => (
            {
                ...prevOrderStatus, 
                [item_status.key] : {...prevOrderStatus[item_status.key],  openingPage:  item_pagina}
            }
        );
        setOrderStatus(updateOpeningPage)  
        console.log(item_pagina, 'item_pagina')
        getInfoCollection(item_pagina, mapl_sp2, filter);
        handleScrollToTop();
    }

    useEffect(() => {  
        // if(query !== null){
            // getQuantityCollectionToDevidePage(1)
            getInfoCollection(1, 1, filter);
            getDetailCategory2();
            // handleClickFilter(mapl_sp, mapl_sp2)
        // }
        // else{
        //     getQuantityCollectionToDevidePage(1)
        //     getInfoCollection(1, 1, filter);
        //     getDetailCategory2();
        //     // handleClickFilter(mapl_sp, mapl_sp2)

        // }
        // setState_query((searchParams.get('query')))
        // setState_mapl_sp(parseInt(searchParams.get('mapl_sp')))
    }, []);  
     
    const product = () => {
        let index = {
            start: 0,
            end: 0,
        } 
        console.log(orderStatus_Array[0].value.orderList, 'orderStatus_Array[0].value.spaceGetDataFromOrderList')
        orderStatus_Array[0].value.spaceGetDataFromOrderList.filter(item_pagination => {  
            if (item_pagination.paginationNumber ===  orderStatus_Array[0].value.openingPage) {
                index.start = item_pagination.startIndex;
                index.end = item_pagination.endIndex;
            }   
        })
        // if(Array.isArray(resultQuery)){
            
            return(
                orderStatus.collection.orderList.slice(index.start, index.end).map((product) =>{
                    const url = `/infoProduct?id=${product.MASP}`;
                    return  ( 
                        <div key={product.MASP} class="product_item_div__out">
                            <a href={url}>
                                <div class="product_item_div__in"> 
                                    <div>
                                        <img src={product.imgURL} alt="sản phẩm test" width="247.5" height="250" class="product_item__img"/> 
                                    </div>
                                    <div class="product_item__summary">
                                        <a href="#">
                                            <h6 class="product_item__summary__title">{product.TENSP}</h6>
                                        </a>
                                        <div class="product_item__summary__price_and_heart">
                                            <div class="product_item__summary__price">
                                                <span class="product_item__summary__sale_price space_item_in_a_row">{formatPrice(product.GIABAN)}₫
                                                </span>
                                                <span class="product_item__summary__origin_price space_item_in_a_row">
                                                    <del>{formatPrice(product.GIAGOC)}₫</del>
                                                </span>
                                            </div> 
                                            <div>
                                                {/* <button  onClick={() => addProductToCart(product) } className="product_item__summary__heart">
                                                    <FontAwesomeIcon icon={faHeart} ></FontAwesomeIcon>
                                                </button>  */}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__column_10__product_thumbail__yeuthich">
                                        <i class="fa-solid fa-check grid__column_10__product_thumbail__yeuthich__check_icon"></i>
                                        <span class="grid__column_10__product_thumbail__text_yeuthich">{formatPrice(parseInt(100 - (product.GIABAN / product.GIAGOC * 100)))}%</span> 
                                    </div> 
                                </div> 
                            </a>
                        </div>
                    )
                })
            )
        // }
    }

    const renderPagination = () => {
        console.log(orderStatus_Array[0])
        if(orderStatus_Array[0].value.orderList.length !== 0){
            return orderStatus_Array[0].value.paginationList.map((item_pagina) => 
                <button className="btn_pagination" key={item_pagina} onClick={() => handleClickItemPagination(item_pagina)}>{item_pagina}</button>
            )
        }
    }

    const renderListProductCategory2 = listProductCategory2.map((item, index) => 
        <button 
            key={index}
            className={
                `
                    grid__column_10__filter__result_filter_button 
                    ${mapl_sp2 === item.MAPL2  ? "grid__column_10__filter__result_filter_button--active" : ""}   
                `
            }
            onClick={() => handleClickFilter(item.MAPL2, filter)}
        >{item.TENPL2}</button>
    )

    const renderListFilter = listFilter.map((item, index) => {
        if(index < 2){
            return (
                <button 
                    key={index}
                    className={
                        `
                            grid__column_10__filter__result_filter_button 
                            ${filter === item.name_filter  ? "grid__column_10__filter__result_filter_button--active" : ""}   
                        `
                    }
                    onClick={() => handleClickFilter(mapl_sp2, item.name_filter)}
                >{item.name_show}</button>
            )
        }
    })

    const renderListFilterCaretDown = listFilter.map((item, index) => {
            if(index >= 2){
                return (
                    <div key={index} className={`${filter === item.name_filter  ? "grid__column_10__filter__result_filter_button--active" : ""}`}>
                        <span 
                            class={
                                `
                                    header__body__search_and_recommend__search__selection_scope__in 
                                    header__body__search_and_recommend__search__selection_scope__in_shop
                                    // ${filter === item.name_filter  ? "grid__column_10__filter__result_filter_button--active" : ""}   
                                `
                            }
                            onClick={() => handleClickFilter(mapl_sp2, item.name_filter)}
                        >{item.name_show}
                            {/* <FontAwesomeIcon icon={faCheck} className="header__body__search_and_recommend__search__selection_scope__icon_in"></FontAwesomeIcon> */}
                        </span>
                    </div>
                )
            }
        } 
    )
     
     
    return ( 
        <div class="container"> 
            {/* <!-- show_product hiển thị phần "SẢN PHẨM MỚI"--> */}
            <div class="show_product__title_div">
                <h1 class={`${state_query !== null ? '' : 'display_hidden'}`}>SẢN PHẨM TÌM THẤY</h1> 
                <h1 class={`${state_query === null && state_mapl_sp === 1 ? '' : 'display_hidden'}`}>THỜI TRANG NAM</h1> 
                <h1 class={`${state_query === null && state_mapl_sp === 2 ? '' : 'display_hidden'}`}>THỜI TRANG NỮ</h1>
                <h1 class={`${state_query === null && state_mapl_sp === 3 ? '' : 'display_hidden'}`}>THỜI TRANG TRẺ EM</h1>
            </div>
            <div className={`row ${query === null ? '' : 'display_hidden'}`}>
                <div class="grid__column_10__filter">
                    <div class="grid__column_10__filter__div_title">
                        <span class="grid__column_10__filter__text_title">Danh mục: </span>
                    </div>
                    <div class="grid__column_10__filter__div_result_filter_select">
                        {/* <button class="grid__column_10__filter__result_filter_button grid__column_10__filter__result_filter_button--active">Phổ Biến</button> */}
                        {renderListProductCategory2} 
                    </div> 
                </div>
            </div>
            <div className={`row ${query !== null && orderStatus_Array[0].value.pageQuantity === 0 ? 'display_hidden' : ''}`}>
                <div class="grid__column_10__filter">
                    <div class="grid__column_10__filter__div_title">
                        <span class="grid__column_10__filter__text_title">Sắp xếp theo</span>
                    </div>
                    <div class="grid__column_10__filter__div_result_filter_select">
                        {/* <button class="grid__column_10__filter__result_filter_button grid__column_10__filter__result_filter_button--active">Phổ Biến</button> */}
                        {renderListFilter} 
                        <div class="grid__column_10__filter__div_result_filter_select__sort_price">
                            <span class="grid__column_10__filter__div_result_filter_select__text_sort_price">Giá
                                <div class="grid__column_10__filter__div_result_filter_select__select_text_sort_price">
                                    {renderListFilterCaretDown}
                                    {/* <div className={`${filter === listFilter[3]  ? "grid__column_10__filter__result_filter_button--active" : ""}`}>
                                        <span 
                                            class={
                                                `
                                                    header__body__search_and_recommend__search__selection_scope__in 
                                                    header__body__search_and_recommend__search__selection_scope__in_shop
                                                    ${filter === listFilter[3]  ? "grid__column_10__filter__result_filter_button--active" : ""}   
                                                `
                                            }
                                            onClick={() => handleClickFilter(`${listFilter[3]}`)}
                                        >Cao Đến Thấp</span> 
                                    </div> */}
                                </div>
                            </span> 
                            <svg enable-background="new 0 0 11 11" viewBox="0 0 11 11" x="0" y="0" class="header__body__search_and_recommend__search__icon_scope">
                                <g><path d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path></g>
                            </svg>                                        
                        </div> 
                    </div> 
                </div>
            </div>
            <div className="row productHaveFound">
                <span 
                    className={`${query !== null ? '' : 'display_hidden'}`}
                >Tìm thấy {orderStatus_Array[0].value.pageQuantity} sản phẩm</span>
                <span 
                    className={`${query === null ? '' : 'display_hidden'}`}
                >Có {orderStatus_Array[0].value.pageQuantity} sản phẩm</span>
            </div>
            <div class="show_product">
                {/* <!-- product_item_container__out khối bọc ngoài cho tất cả sản phẩm để dễ padding, margin --> */}
                <div class="product_item_container__out">
                    {/* <!-- product_item_container__in khối bọc trong cho tất cả sản phẩm --> */}
                    <div class="product_item_container__in">
                        {/* <!-- product_item_div__out hiển thị thông tin từng sản phẩm --> */} 
                        {product()} 
                    </div>
                </div>
            </div> 
            <div>
                { renderPagination() }
            </div>
        </div>
    )
}

export default Collection;