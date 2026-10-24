import axios from "axios";


// Automatically use Render URL in production if VITE_API_URL is missing
const baseURL = import.meta.env.VITE_API_URL || 'https://ai-interview-guide-and-resume-builder.onrender.com';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Needed if you are using cookies/sessions for auth
});


export async function register({ username, email, password }) {
   try {
   const response = await api.post("/api/auth/register",{
        username,
        email,
        password
    })

    return response.data;

   } catch(err){
    console.log(err);
    
   }
}


export async function login({ email, password }) {
    try {
        
        const response = await api.post("/api/auth/login",{
            email, password
        })

        return response.data;

    } catch (error) {
        console.log(error);
        
    }
}


export async function logout() {
    try {
        
        const response = await api.get("/api/auth/logout")

        return response.data;

    } catch (err) {
       console.log(err);
        
    }
}

export async function getMe() {
    try {
        
        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err);
        
    }
}
