<template>
    <baidu-map class="map"
               :ak="options.ak"
               :center="getPoint(options.center)"
               :zoom="options.zoom"
               @ready="initMap">
        <bm-marker v-for="(marker, i) in options.markers" :position="getPoint(marker.position)"
                   :dragging="marker.dragging || dragging"
                   :icon="marker.icon || options.markerIcon || false"
                   :title="marker.title"
                   :key="marker.id"
                   @click="openInfoWindow(i)">
            <bm-info-window
                :show="show === i"
                @close="closeInfoWindow"
                @open="openInfoWindow(i)">
                <h4>{{marker.title}}</h4>
                <p>{{marker.address}}</p>
                <p>{{marker.tel}}</p>
            </bm-info-window>
        </bm-marker>
    </baidu-map>
</template>

<script>
    import {BaiduMap, BmMarker, BmInfoWindow, BmLabel} from 'vue-baidu-map'
    
    export default {
        name: 'bmap',
        components: {
            BaiduMap,
            BmMarker,
            BmInfoWindow,
            BmLabel
        },
        props: {
            options: {
                type: Object,
                required: true,
                ak: {
                    type: String,
                    required: true
                },
                center: {
                    type: String,
                    required: true
                },
                zoom: {
                    type: Number,
                    default: 16
                },
                markers: {
                    type: Array,
                    default: []
                },
                markerIcon: {
                    type: Object,
                    default: {}
                }
            }
        },
        data() {
            return {
                center: {},
                show: -1,
                dragging: false,
            }
        },
        created() {
            // this.icon = ;
            console.log(this.options);
        },
        methods: {
            getPoint(position) {
                let arr = position.split(',');
                return {
                    lng: arr[0],
                    lat: arr[1]
                };
            },
            initMap() {
                this.center = this.getPoint(this.options.center);
            },
            openInfoWindow(i) {
                this.show = i;
            },
            closeInfoWindow() {
                this.show = -1;
            }
        }
    }
</script>

<style lang="scss" scoped>
    
    .map {
        width: 100%;
        height: 100%;
    }


</style>
