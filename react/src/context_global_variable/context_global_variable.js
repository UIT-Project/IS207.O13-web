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
                    isClickedPayment, setIsClickedPayment
                }}
            >
        {children}
    </GlobalVariableContext.Provider>
}

export default function useGlobalVariableContext(){
    return useContext(GlobalVariableContext);
}