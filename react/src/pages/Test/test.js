import { useEffect, useState } from "react";
import * as request from "../../utils/request";
import axios from "axios";

function Test(){
    const [tests, setTest] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        // try{
        //     const result = await axios("http://localhost:8000/api/test");
        //     console.log(result.data);
        //     setTest(result.data);
        // }
        // catch (e){
        //     console.log(e);
        // }
        request.get('/api/test')
            .then(res=>{
                setTest(res);
                console.log(res);
            })
            .catch(res=>{
                console.log(res.data);
            })
    } 
    const render = tests.map((test, index) => 
        <li key={index}>{test.MASP} và {test.TENSP}</li>
    )
    return ( 
    <div>
        <h1>TEST</h1> 
        <div>
            <ul>{render}</ul> 
        </div>
    </div>
    )
}

export default Test;