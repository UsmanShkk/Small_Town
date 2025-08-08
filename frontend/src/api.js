import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Content-Type': 'multipart/form-data'
  // },
  timeout: 200000, // 10 second timeout
});


API.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const loginUser = (formData) => API.post("/auth/login", formData);
export const registerUser = (formData) => API.post("/auth/register", formData);
export const googleuser = (formData) => API.get("/auth/google");

export const setRole = (data) => API.post('/auth/set-role', data);
export const registerVendor = (formData) => API.post("/vendor/register", formData);
export const vendorstatus = () => API.get("/vendor/status");
export const fetchVendorProfile = () => API.get('/vendor/me');
export const testConnection = () => API.get("/test");
export const fetchVendorMeals = () => API.get('/vendor-meals');
export const createMeal = (mealData) => API.post('/vendor-meals-create', mealData);
export const updateMeal = (id, mealData) => API.put(`/vendor-meals-new/${id}`, mealData);
export const deleteMeal = (id) => API.delete(`/vendor-meals-delete/${id}`);
export const loginVendor = (formdata) => API.post("/vendor/login", formdata) ;
export const authVendor = () => API.get('/vendor/me');
export const authcustomer = () => API.get('/protected/customer-panel');
export const allmeals = () => API.get('/meals');
export const getmealbyId = (id) => API.get(`/meals/${id}`)