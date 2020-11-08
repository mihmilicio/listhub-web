import axios from 'axios';

const api = axios.create({
  baseURL: 'https://listhub-api.herokuapp.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 120000
});

export default api;
