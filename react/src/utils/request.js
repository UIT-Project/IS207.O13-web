import axios from 'axios';

const request = axios.create({
    baseURL:"http://localhost:8000",
    headers:{
        "Content-Type":"application/json"
    }
})

export const get = async(path) => {
    const response = await request.get(path);
    return response.data;
}

// export const post = async(path) => {
//     const response = await request.post(path);
//     return response.data;
// }

export default request;