import { createContext, useContext, useRef, useState } from "react";

const GlobalVariableContext = createContext();

export function GlobalVariable({children}){

    const [loginOrLogout, setLoginOrLogout] = useState("signIn");
    const [textQuery, setTextQuery] = useState("");
    const [resultQuery, setResultQuery] = useState(""); 
    const [statusPressAddToCart, setStatusPressAddToCart] = useState(false);
    const divPopupCartRef = useRef(null);
    const [infoCarts, setInfoCarts] = useState([]);

    return <GlobalVariableContext.Provider 
                value={{
                    loginOrLogout, setLoginOrLogout, 
                    textQuery, setTextQuery, 
                    resultQuery, setResultQuery, 
                    statusPressAddToCart, setStatusPressAddToCart,
                    divPopupCartRef,
                    infoCarts, setInfoCarts
                }}
            >
        {children}
    </GlobalVariableContext.Provider>
}

export default function useGlobalVariableContext(){
    return useContext(GlobalVariableContext);
}