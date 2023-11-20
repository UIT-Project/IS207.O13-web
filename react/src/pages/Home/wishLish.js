export const isWishReq = (id, setWish) => {
    const list = localStorage.getItem("wishList")
    ? JSON.parse(localStorage.getItem("wishList")) : [];

    if(list.length > 0){
        if(list.includes(id) !== true){
            list.push(id);
            localStorage.setItem("wishList", JSON.stringify(list));
            setWish(list);
        }
    }
    else{
        list.push(id);
        localStorage("wishList", JSON.stringify(list));
        setWish(list);
    }
};