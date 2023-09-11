import axios from "axios";

const baseURL = process.env.SMS_ENDPOINT || "https://api.smsdev.com.br";

export const api = axios.create({
    baseURL,
    params: {
        key: process.env.SMS_KEY,
        type: 9,
    },
    headers: {},
});

export default api;