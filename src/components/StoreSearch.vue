<template>
    <div class="storesearch">
        <input class="searchbox"
               ref="searchbox"
               @input="searchByKeyword"
               type="text"
               placeholder="请输入关键词">
        <div class="citypick clearfix">
            <div ref="province"
                 class="picker province"
                 :class="{active: provPickerActive}"
                 @click.stop="toggleProv">
                <div class="result" :data-pid="currentProv.id">
                    <span>{{currentProv.title}}</span>
                    <span class="arrow"></span>
                </div>
                <div class="panel">
                    <ul>
                        <li v-for="(province, i) in provinces"
                            :class="{selected: currentProv.id === province.id}"
                            :key="province.id"
                            @click="pickProv(i)">
                            {{province.title}}
                        </li>
                    </ul>
                </div>
            </div>
            <div ref="city"
                 class="picker city"
                 :class="{active: cityPickerActive}"
                 @click.stop="toggleCity">
                <div class="result" :data-cid="currentCity.id">
                    <span>{{currentCity.title}}</span>
                    <span class="arrow"></span>
                </div>
                <div class="panel">
                    <ul>
                        <li v-for="(city, i) in cities"
                            :class="{selected: currentCity.id === city.id}"
                            :key="city.id"
                            @click="pickCity(i)">
                            {{city.title}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="stores-list">
            <ul>
                <li v-for="store in stores">
                    <div class="text">
                        <h3 v-html="store.title"></h3>
                        <p v-html="store.address"></p>
                        <div v-html="store.tel"></div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="mapbox">
            <baidu-map :options="mapOptions"></baidu-map>
        </div>
    </div>
</template>

<script>
    
    import BaiduMap from './BaiduMap';
    
    const Provs = [
        {
            id: 1,
            title: '北京',
            cities: [
                {
                    id: 11,
                    title: '北京'
                }
            ]
        },
        {
            id: 2,
            title: '广东',
            cities: [
                {
                    id: 21,
                    title: '广州'
                },
                {
                    id: 22,
                    title: '深圳'
                },
                {
                    id: 23,
                    title: '东莞'
                }
            ]
        },
        {
            id: 3,
            title: '广西',
            cities: [
                {
                    id: 31,
                    title: '南宁'
                },
                {
                    id: 32,
                    title: '柳州'
                },
                {
                    id: 33,
                    title: '桂林'
                }
            ]
        }
    ];
    
    const allStores = [
        {
            id: 1,
            cityId: 11,
            title: '北京王府井第八分店',
            address: '北京市王府井大街正中央A栋11232号',
            tel: 13058132840
        },
        {
            id: 2,
            cityId: 11,
            title: '北京王府井第二分店',
            address: '北京市王府井大街正中央B栋11290号',
            tel: 13058132840
        },
        {
            id: 3,
            cityId: 22,
            title: '深圳南山店',
            address: '深圳南山店23290号',
            tel: 13058132840
        },
    ];
    
    const initialCity = {
        id: '--',
        title: '请选择城市'
    };
    
    export default {
        name: 'store-search',
        components: {
            BaiduMap
        },
        data() {
            return {
                provinces: [],
                currentProv: {
                    id: '--',
                    title: '请选择省份'
                },
                currentCity: initialCity,
                provPickerActive: false,
                cityPickerActive: false,
                stores: [],
                mapOptions:{
                    ak: 'vGFoYQvuUPR9mjGEGzkTPA8beQ5Tj0Ak',
                    center: '113.925045, 22.587504',
                    zoom: 18,
                    markers: [
                        {
                            id: 1,
                            title: '兴东地铁站D口',
                            address: '行动',
                            position: '113.925045, 22.587504'
                        },
                        {
                            id: 2,
                            title: '兴东地铁站B口',
                            position: '113.927045, 22.587504'
                        },
                        {
                            id: 3,
                            title: '兴东地铁站C口',
                            position: '113.929045, 22.587504'
                        }
                    ],
                    markerIcon: {
                        url: '/static/images/markerIcon.png',
                        size: {
                            width: 20,
                            height: 25
                        }
                    }
                }
            }
        },
        computed: {
            cities: function(){
                return this.cityMap[this.currentProv.id] || [];
            }
        },
        created(){
            this.allStores = allStores;
            this.stores = allStores;
            this.provs = Provs;
            this.cityMap = {};
            this.provinces = Provs;
            Provs.forEach((prov) => {
                this.cityMap[prov.id] = prov.cities;
            });
            setTimeout( () => {
                this.mapOptions.markers = [
                    {
                        id: 1,
                        title: '兴东地铁站D口',
                        address: '行动',
                        position: '113.925045, 22.587504'
                    }
                ];
            }, 3000);
        },
        mounted(){
            document.addEventListener('click', () => {
                this.provPickerActive = this.cityPickerActive = false;
            }, false);
        },
        methods: {
            // 选中省份
            pickProv(index){
                if(this.provinces[index] !== this.currentProv){
                    this.currentProv = this.provinces[index];
                    this.currentCity = initialCity;
                    this.stores = this.getStoreByProv(this.currentProv);
                }
            },
            
            // 选中城市
            pickCity(index){
                if(this.cities[index] !== this.currentCity){
                    this.currentCity = this.cities[index];
                    this.stores = this.getStoresByCity(this.currentCity);
                }
            },
            
            // 显示/隐藏省份列表面板
            toggleProv(){
                this.provPickerActive = !this.provPickerActive;
                this.cityPickerActive = false;
            },
            
            // 显示/隐藏城市列表面板
            toggleCity(){
                this.cityPickerActive = !this.cityPickerActive;
                this.provPickerActive = false;
            },
            
            // 筛选某省份下的所有店铺，由于后台接口限制，只能变相筛选(后台接口返回的店铺信息只提供城市ID而没有提供省份ID)
            getStoreByProv(prov){
                let stores = prov.cities.map(city => this.getStoresByCity(city));
                return [].concat.apply([], stores);
            },
            
            // 筛选某城市下的所有店铺
            getStoresByCity(city){
                return this.allStores.filter(store => store.cityId === city.id);
            },
            
            // 通过关键字搜索店铺
            searchByKeyword(){
                var keyword = event.target.value.trim();
                if(!keyword){
                    this.stores = this.allStores;
                    return;
                }
                let reg = new RegExp('(' + keyword + ')', 'i'),
                    res = [];
                this.allStores.forEach(item => {
                    let str = [item.title, item.address, item.tel].join('');
                    if(reg.test(str)){
                        let store = Object.assign({}, item);
                        this.markKeyword(store, ['title', 'address', 'tel'], reg)
                        res.push(store);
                    }
                });
                this.stores = res;
            },
            
            // 标记关键字
            markKeyword(obj, fields, reg) {
                fields.forEach((field) => {
                    obj[field] = obj[field].toString().replace(reg, '<span>$1</span>');
                });
            }
        }
    }
    
</script>

<style lang="scss" scoped>
    
    .storesearch{
        padding: 50px;
    }
    
    .searchbox {
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        padding: 0 10px;
        border: 1px solid #999;
        outline: 0;
        transition: border-color .3s;
        &:focus {
            border-color: #000;
        }
    }
    
    .picker {
        position: relative;
        float: left;
        box-sizing: border-box;
        width: calc(50% - 7px);
        height: 40px;
        margin-top: 15px;
        border: 1px solid #999;
        font-size: 12px;
        line-height: 40px;
        color: #666;
        cursor: pointer;
        &.active{
            .panel{
                top: calc(100% + 5px);
                opacity: 1;
                visibility: visible;
            }
        }
    }
    
    .province {
        margin-right: 7px;
    }
    
    .city {
        margin-left: 7px;
    }

    .result{
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 0 10px;
    }
    
    .panel{
        position: absolute;
        top: calc(100% + 15px);
        left: -1px;
        padding: 10px 0;
        min-width: 100%;
        min-height: 30px;
        max-height: 300px;
        border: 1px solid #999;
        border-radius: 4px;
        box-shadow: 0 3px 15px rgba(#000, .1);
        background-color: #fff;
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
        transition: all .35s;
        li{
            box-sizing: border-box;
            line-height: 30px;
            padding: 0 10px;
            &:hover{
                background-color: #eee;
            }
        }
        li.selected{
            color: #fff;
            background-color: #222;
        }
    }
    
    // mark keyword
    .stores-list /deep/ span{
        /*display: inline-block;*/
        /*padding: 1px 2px;*/
        border-radius: 2px;
        display: inline-block;
        
        background-color: rgba(blue, .15);
    }
    
    .mapbox{
        position: absolute;
        top: 50px;
        left: 50px;
        width: 600px;
        height: 400px;
    }
    
</style>
