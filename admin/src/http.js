import axios from 'axios'
import Vue from "vue";
import router from './router'

const http = axios.create({
    baseURL: 'admin/api'
})

// 給標頭加一個token
http.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (localStorage.token){
        config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// 一個攔截任何請求的東西 可以判斷錯誤或是正常要做什麼 這邊是用於錯誤的時候顯示錯誤請求
http.interceptors.response.use(res => {
    return res
}, err => {
    if (err.response.data.message) {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message
        })
        if(err.response.status === 401){
            router.push('/login')
        }
    }
    return Promise.reject(err)
})

export default http