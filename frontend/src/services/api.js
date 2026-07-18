import axios from 'axios';

// Create an Axios instance with the backend base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request interceptor: automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const registerUser = (username, password) =>
  api.post('/auth/register', { username, password });

export const loginUser = (username, password) =>
  api.post('/auth/login', { username, password });

// Vehicle API calls
export const getVehicles = () => api.get('/vehicles');

export const searchVehicles = (query) => api.get(`/vehicles/search?q=${query}`);

export const createVehicle = (vehicleData) => api.post('/vehicles', vehicleData);

export const updateVehicle = (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData);

export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

export const purchaseVehicle = (id) => api.post(`/vehicles/${id}/purchase`);

export const restockVehicle = (id, quantity) =>
  api.post(`/vehicles/${id}/restock`, { quantity });

export default api;
