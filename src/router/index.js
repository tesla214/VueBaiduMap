import Vue from 'vue'
import Router from 'vue-router'
import StoreSearch from '@/components/StoreSearch'
import BaiduMap from '@/components/BaiduMap'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'StoreSearch',
            component: StoreSearch
        },
        // {
        //     path: '/map',
        //     name: 'map',
        //     component: BaiduMap
        // },
    ]
})
