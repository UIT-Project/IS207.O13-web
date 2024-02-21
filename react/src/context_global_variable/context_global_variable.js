import { createContext, useContext, useRef, useState } from "react";

const GlobalVariableContext = createContext();

export function GlobalVariable({children}){

    const [loginOrLogout, setLoginOrLogout] = useState("signIn");
    const [textQuery, setTextQuery] = useState("");
    const [resultQuery, setResultQuery] = useState(""); 
    const [statusPressAddToCart, setStatusPressAddToCart] = useState(false);
    const divPopupCartRef = useRef(null);
    const [infoCarts, setInfoCarts] = useState([]);
    const [isClickedPayment, setIsClickedPayment] = useState(0);
    const [category1, setCategory1] = useState(1)
    const listSizeToCheck = ["S", "M", "L", "XL", "XXL", "3XL"]
    const [contentPopup, setContentPopup] = useState({
        title: '',
        content: '',
    })

    const openPopup = () => {
        const popupOverlay = document.querySelector(".popup-overlay");
        const popupContainer = document.querySelector(".popup-container");
    
        popupOverlay.style.display = "flex";
        setTimeout(() => {
          popupContainer.style.opacity = "1";
          popupContainer.style.transform = "scale(1)";
        }, 100);
    }; 
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    
    return <GlobalVariableContext.Provider 
                value={{
                    loginOrLogout, setLoginOrLogout, 
                    textQuery, setTextQuery, 
                    resultQuery, setResultQuery, 
                    statusPressAddToCart, setStatusPressAddToCart,
                    divPopupCartRef,
                    infoCarts, setInfoCarts,
                    formatPrice,
                    isClickedPayment, setIsClickedPayment,
                    category1, setCategory1,
                    listSizeToCheck,
                    contentPopup, setContentPopup,
                    openPopup,
                }}
            >
        {children}
    </GlobalVariableContext.Provider>
}

export default function useGlobalVariableContext(){
    return useContext(GlobalVariableContext);
}