import axios from "axios";

export const register = (user: {username : string, email: string, password: string }) => {
    return axios.post('http://localhost:3000/auth/register', user);
}

export const login = (user: {email: string, password:string}) => {
    return axios.post('http://localhost:3000/auth/login', user)
}