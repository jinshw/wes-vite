<template>
    <!-- <div id="markerContainer" :style="{ left: winPos.x + 'px', top: winPos.y + 'px' }"> -->
        <div id="markerContainer" >
        <el-dialog :title="markName + '附件'" v-model="dialogVisible" :modal-append-to-body="false">
            <el-upload class="upload-class" ref="upload" :action="attachment.action" :on-remove="attachment.delete"
                :on-success="attachment.success" :file-list="attachment.fileList" :on-preview="attachment.download"
                :auto-upload="false">
                <template #trigger>
                    <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success"
                    @click="$refs.upload.submit()">上传到服务器</el-button>
            </el-upload>
        </el-dialog>
        <div class="panel-info-container">
            <div id="createMerkerPanel" v-if="markMode === 'marker' || markMode === 'MARKER'" v-show="visible">
            <el-container v-show="!selectPanel">
                <el-header>
                    <span>添加标记</span>
                    <span class="closebtn cesiumDrawFont iconclose" @click="visible = false">
                        <el-icon><CloseBold /></el-icon>
                    </span>
                    
                    <i class="el-icon-paperclip" v-if="attachment.enabled" @click="dialogVisible = true" title="附件"
                        style="font-size:16px"></i>
                </el-header>
                <!-- marker-panel信息 -->
                <el-container id="marker-panel">
                    <el-container>
                        <el-main class="marker-main-class">
                            <div class="pane-row">
                                <div>
                                    <label>名称：</label>
                                    <el-input v-model="markName" ref="nameinput" ></el-input>
                                </div>
                                <div >
                                    <label>类型：</label>
                                    <el-select v-model="customProperty.iconUrl" @change="selectChangeHandler" placeholder="请选择类型">
                                        <el-option label="警员" value="jingyuan"></el-option>
                                        <el-option label="警车" value="jingche"></el-option>
                                        <el-option label="停车场" value="tingchechang"></el-option>
                                        <el-option label="停车场-进口" value="tingchechang-in"></el-option>
                                        <el-option label="停车场-出口" value="tingchechang-out"></el-option>
                                        <el-option label="摄像头" value="shexiangtou"></el-option>  
                                        <el-option label="管控点" value="guankongdian"></el-option> 
                                        <el-option label="控制点" value="kongzhidian"></el-option> 
                                    </el-select>
                                </div>
                            </div>
                            <!-- 警车信息 S -->
                            <div class="pane-row" v-show="editMarkerType === 'jingche'">
                                <div>
                                    <label>联系人：</label>
                                    <el-input v-model="customProperty.propertyInfo.contactMan"></el-input>
                                </div>
                                <div>
                                    <label>联系方式：</label>
                                    <el-input v-model="customProperty.propertyInfo.contactInfo"></el-input>
                                </div>
                            </div>
                            <!-- 警车信息 E -->
                             <!-- 警员信息 S -->
                            <div class="pane-row" v-show="editMarkerType === 'jingyuan'">
                                <div>
                                    <label>警号：</label>
                                    <el-input v-model="customProperty.propertyInfo.policeNum"></el-input>
                                </div>
                                <div>
                                    <label>联系方式：</label>
                                    <el-input v-model="customProperty.propertyInfo.contactInfo"></el-input>
                                </div>
                            </div>
                            <div class="pane-row" v-show="editMarkerType === 'jingyuan'">
                                <div>
                                    <label>电台号：</label>
                                    <el-input v-model="customProperty.propertyInfo.stationNum"></el-input>
                                </div>
                                <div>
                                    <label>职级：</label>
                                    <el-input v-model="customProperty.propertyInfo.rank"></el-input>
                                </div>
                            </div>
                            <!-- 警员信息 E -->
                            <!-- 停车场信息 S -->
                            <div class="pane-row" v-show="editMarkerType === 'tingchechang'">
                                <div>
                                    <label>地址：</label>
                                    <el-input v-model="customProperty.propertyInfo.installPlace"></el-input>
                                </div>
                                <div>
                                    <label>联系方式：</label>
                                    <el-input v-model="customProperty.propertyInfo.contactInfo"></el-input>
                                </div>
                            </div>
                            <div class="pane-row" v-show="editMarkerType === 'tingchechang'">
                                <div>
                                    <label>负责单位：</label>
                                    <el-input v-model="customProperty.propertyInfo.department"></el-input>
                                </div>
                                <div>
                                    <label>车位(余/总)：</label>
                                    <el-input placeholder="100/300" v-model="customProperty.propertyInfo.parkingNum"></el-input>
                                </div>
                            </div>
                            <div class="pane-row" v-show="editMarkerType === 'tingchechang'">
                                <div>
                                    <label>收费时段：</label>
                                    <el-input v-model="customProperty.propertyInfo.chargingTime"></el-input>
                                </div>
                                <div>
                                    <label>收费标准：</label>
                                    <el-input v-model="customProperty.propertyInfo.chargingStandard"></el-input>
                                </div>
                            </div>
                            <!-- 停车场信息 E -->
                            <div class="pane-row">
                                <label>经度：</label>
                                <el-input v-model="customProperty.propertyInfo.longitude"></el-input>
                                <label>纬度：</label>
                                <el-input v-model="customProperty.propertyInfo.latitude"></el-input>
                            </div>
                            <div class="pane-row">
                                <label>高程：</label>
                                <el-input v-model="customProperty.propertyInfo.altitude"></el-input>
                            </div>
                            <div class="pane-row pane-desc">
                                <label>描述：</label>
                                <el-input v-model="markRemark" type="textarea"></el-input>
                            </div>
                        </el-main>
                        <!-- <el-aside>
                            <img :src="selectedImage" width="36"/>
                            <img v-for="(img, index) in images" width="36" :src="img" :key="index"
                                :class="selectedImageIndex === index ? 'selected' : 'not-selected'"
                                @click="changeHandler(img, index)" />
                            <a href="#" id="imageC" @click="selectPanel = true">更换</a>
                        </el-aside> -->
                    </el-container>
                    <el-footer>
                        <!-- <el-button type="danger" id="cancelbtn" size="default" @click="cancelMark">删除</el-button> -->
                        <el-button type="primary" size="default" id="submitbtn" @click="update">确定</el-button>
                    </el-footer>
                </el-container>
            </el-container>
            <el-container v-show="selectPanel" class="image-list-class">
                <!-- <img :src="noImage" @click="changeHandler(undefined)"> -->
                <img v-for="(img, index) in images" :src="img" :key="index"
                    :class="selectedImageIndex === index ? 'selected' : 'not-selected'"
                    @click="changeHandler(img, index)" />
            </el-container>
        </div>
        <div id="createModelPanel"  v-if="markMode === 'model' || markMode === 'MODEL'"
            v-show="visible">
            <label style="color :#fff;">名称：</label>
            <el-input v-model="markName" @keypress.enter="update" ref="nameinput"></el-input>
            <el-button size="small" type="primary" @click="update" style="margin-left: 20px;">确定</el-button>
        </div>
        <div id="createLabelPanel"  v-if="markMode === 'label' || markMode === 'LABEL'"
            v-show="visible">
            <el-input v-model="markName" @keypress.enter="update" ref="nameinput"></el-input>
            <el-button size="small" @click="update" style="margin-left: 20px;">确定</el-button>
        </div>
        </div>
        <input type="file" v-show="false" @change="importMarks" id="uploadhandler" accept=".json" />
    </div>
</template>

<script>
import MarkerManager from "@/core/MarkerManager";
import utils from "@/js/utils";
import {
    checkComponent,
    checkViewer
} from "@/js/utils";
export default {
    name: "cesiumMarkerViewer",
    data() {
        return {
            visible: false,
            selectPanel: false,
            markName: "",
            markRemark: "",
            images: [],
            markMode: "",
            winPos: {
                x: 0,
                y: 0
            },
            dialogVisible: false,
            fileList: [],
            selectedImageIndex: "",
            customProperty: {
                        "points": '',
                        "type": "", // 标注资产类型
                        "iconUrl": '', // 标注图标名称 shuimadun
                        "textColor": "",
                        "propertyInfo": {
                            "actplanId": "1", // 预案 id
                            "name": this.markName,
                            "desc": this.markRemark,
                            "longitude": "",
                            "latitude": "",
                            "altitude": "",
                            "textColor": "",
                            "policeMan": "",
                            "policeNum": "",
                            "contactInfo": "",
                            "contactMan": "",
                            "stationNum": "",
                            "department": "",
                            "rank": "",
                            "installPlace": "",
                            "parkingNum": "",
                            "chargingTime": "",
                            "chargingStandard": "",
                            "polygon": "",
                            "isDel": "",
                        } 
            }, //编辑新增删除时的自定义属性信息
            addPosition: [],
            addId: '', //添加时的id,使用生成后的id覆盖掉,feiqi
            editMarkerType: "jingyuan",
            selectedMarkerIcon: "jingyuan", //当前选中的图标名称
            isAdd: '1', //新增
            entityType: "Marker", //标记类型
            entityTypeCode: 0, //标记类型编码 0:Marker 4:Model
            entityMoveEndPosition: null, //标记移动结束时的位置
            curSelectedEntityId: null, //当前选中的实体Id
        };
    },
    computed: {},
    components: {},
    props: {
        actplanId: {
            type: String,
            default: "1"
        },
        extendImage: {
            type: Array,
            default: function () {
                return [];
            }
        },
        attachment: {
            default: function () {
                return {
                    enabled: false,
                    method: ""
                };
            }
        }
    },
    directives: {
        focus: {
            bind: function (el) {
                el.focus();
            },
            updated: function (el) {
                el.focus();
            },
            inserted: function (el) {
                el.focus();
            }
        }
    },
    mounted() {
        const self = this;
        window.addEventListener("marker-edit", e => {
            console.log(e, '========编辑self=');
            const type = e.detail.type;
            self.markMode = type;
            self.curSelectedEntityId = e.detail.CustomProperty.id;
            self.selectedMarkerIcon = e.detail.CustomProperty.iconUrl;
            self.visible = true;
            self.editMarkerType = e.detail.CustomProperty.type;
            self.markName = e.detail.CustomProperty.propertyInfo.name;
            self.markRemark = e.detail.CustomProperty.propertyInfo.desc;
            
            self.customProperty = e.detail.CustomProperty ? e.detail.CustomProperty : null;
            self.entityMoveEndPosition = self.customProperty.points
            self.winPos = {
                ...e.detail.pos
            };
            self.isAdd = '2';
            self.entityType = e.detail.type;

            let  entityObj = this.markerManager.get(this.curSelectedEntityId) 
            let pos = self.customProperty.points
            if(entityObj){
                //更新实体的位置
                entityObj.graphic.position = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2])
            }
            self.$emit("editEvent", type, self.customProperty);
        });
        window.addEventListener("marker-add", e => {
            console.log(e, '========新增self===========');
            this.curSelectedEntityId = e.detail.id;
            self.entityTypeCode = e.detail.type;
            self.selectedMarkerIcon = 'jingyuan'
            self.winPos = self.markerManager.panelPosition();
            self.visible = true;
            //self.markName = e.detail.name;
            //self.markRemark = e.detail.remark;
            self.addId = e.detail.id;
            self.isAdd = '1';
            self.addPosition = [e.detail.position.lon, e.detail.position.lat, e.detail.position.height]
            self.entityMoveEndPosition = [e.detail.position.lon, e.detail.position.lat, e.detail.position.height]
            self.customProperty = {
                        "isAdd": '1', //新增
                        "id": this.addId, //当前marker的id
                        "points": this.addPosition,
                        "type": 'jingyuan', // 标注资产类型
                        "iconUrl": '', // 标注图标名称 shuimadun
                        "textColor": "",
                        "propertyInfo": {
                            "actplanId": "1", // 预案 id
                            "name": '',
                            "desc": '',
                            "longitude": "",
                            "latitude": "",
                            "altitude": "",
                            "textColor": "",
                            "policeMan": "",
                            "policeNum": "",
                            "contactInfo": "",
                            "contactMan": "",
                            "stationNum": "",
                            "department": "",
                            "rank": "",
                            "installPlace": "",
                            "parkingNum": "",
                            "chargingTime": "",
                            "chargingStandard": "",
                            "polygon": "",
                            "isDel": "",
                        }
                    }
            self.customProperty.propertyInfo.longitude = e.detail.position.lon;
            self.customProperty.propertyInfo.latitude = e.detail.position.lat;
            self.customProperty.propertyInfo.altitude = e.detail.position.height;
            e.detail.CustomProperty = self.customProperty ;
            self.$emit("addEvent", e.detail.id, e.detail.name, e.detail.type, e.detail.CustomProperty);
        });
        window.addEventListener("marker-delete", e => {
            self.visible = false;
            self.$emit("deleteEvent", e.detail.id);
            self.markName = "";
            self.markRemark = "";
        });
        window.addEventListener("marker-update", e => {
            console.log(e, '========更新self=');
            this.curSelectedEntityId = e.detail.id;
            self.$emit("updateEvent", e.detail.id, e.detail.name,e.detail.CustomProperty);
            self.markName = "";
            self.markRemark = "";
        });
        
        
        this.$nextTick(() => {
          //  utils.moveDiv("markerContainer");
        });
    },
    methods: {
        markerMove(){
            if (this.markerManager) {
                this.markerManager.move(this.curSelectedEntityId);
            }
            window.addEventListener("marker-move-end", e => {
                console.log(e.detail.activeMarkerMoveEndPostion, '========移动结束self=activeMarkerMoveEndPostion');
                this.entityMoveEndPosition = [e.detail.activeMarkerMoveEndPostion.lon, e.detail.activeMarkerMoveEndPostion.lat, e.detail.activeMarkerMoveEndPostion.height]
                this.customProperty.propertyInfo.longitude = e.detail.activeMarkerMoveEndPostion.lon;
                this.customProperty.propertyInfo.latitude =e.detail.activeMarkerMoveEndPostion.lat;
                this.customProperty.propertyInfo.altitude = e.detail.activeMarkerMoveEndPostion.height; 
                this.customProperty.position = [e.detail.activeMarkerMoveEndPostion.lon, e.detail.activeMarkerMoveEndPostion.lat, e.detail.activeMarkerMoveEndPostion.height]
            });
        },
        init(viewer) {
            if (this._viewer) {
                return
            }
            checkViewer(viewer)
            this._viewer = viewer;
            !this.markerManager && (this.markerManager = new MarkerManager(viewer));
            this.images = [
                "/static/images/jingche.png",
                "/static/images/jingyuan.png",
                "/static/images/kongzhidian.png",
                "/static/images/guankongdian.png",
                "/static/images/tingchechang.png",
                "/static/images/tingchechang-in.png",
                "/static/images/tingchechang-out.png"
            ];
            this.selectedImage = this.markerManager.defaultImage;
        },
        pick(type = "marker", mode = "single") {
            checkComponent(this)
            if (this.markerManager) {
                this.markMode = type;
                return this.markerManager.pick(type, mode);
            }
        },
        createMarker(cartesian) {
            if (this.markerManager) {
                return this.markerManager.createMarker(cartesian);
            }
        },
        panelPosition() {
            if (this.markerManager) {
                return this.markerManager.panelPosition();
            }
        },
        createLabel(cartesian) {
            if (this.markerManager) {
                return this.markerManager.createLabel(cartesian);
            }
        },
        createModel(cartesian) {
            if (this.markerManager) {
                return this.markerManager.createLabel(cartesian);
            }
        },
        removeEventListener() {
            if (this.markerManager) {
                return this.markerManager.removeEventListener();
            }
        },
        stopPick() {
            if (this.markerManager) {
                this.markerManager.stopPick();
            }
        },
        zoomTo(id) {
            if (this.markerManager) {
                this.markerManager.zoomTo(id);
            }
        },
        edit(id) {
            if (this.markerManager) {
                this.markerManager.edit(id);
            }
        },
        drop(id) {
            if (this.markerManager) {
                this.markerManager.drop(id);
            }
        },
        rename(id, name) {
            if (this.markerManager) {
                this.markerManager.rename(id, name);
            }
        },
        //更新实体的位置
        updateEntityPosition(id, customProperty){
            if (this.markerManager) {
                this.markerManager.updateEntityPosition(id, customProperty);
            }
        },
        // 给marker 添加自定义属性
        setCustomProperty(id, customProperty) {
            if (this.markerManager) {
                this.markerManager.addCustomProperty(id, customProperty);
            }
        },
        // 给marker 移除自定义属性
        select(type, id, status) {
            if (this.markerManager) {
                this.markerManager.select(type, id, status);
            }
        },
        destroyPopPanle() {
            if (this.markerManager) {
                this.markerManager.destroyPopPanle();
            }
        },
        createPopPanel() {
            if (this.markerManager) {
                this.markerManager.createPopPanel();
            }
        },
        import(feat) {
            if (this.markerManager) {
                this.markerManager.createPopPanel();
                this.markerManager.import(feat)
            }
        },
        export(type) {
            if (this.markerManager) {
                this.markerManager.export(type);
            }
        },
        setFont(font) {
            if (this.markerManager) {
                this.markerManager.font = font;
            }
        },
        getFont() {
            if (this.activeMarker) {
                return this.markerManager.font;
            }
            return undefined;
        },
        setColor(color) {
            if (this.markerManager) {
                this.markerManager.color = color;
            }
        },
        setLabel(option) {
            if (this.markerManager) {
                this.markerManager.label = option;
            }
        },
        setModel(options) {
            if (this.markerManager) {
                this.markerManager.model = options;
            }
        },
        removeAll() {
            if (this.markerManager) {
                this.markerManager.removeAll();
            }
        },
        cancelMark() {
            if (this.markerManager) {
                // 取消后执行
                this.markerManager.cancelMark();
            }
        },
        update() {
            let self = this;
            if (this.markerManager) {
                // this.markerManager.update(this.markName, this.markRemark);
                //             this.visible = false;
                //确定后执行
                let customProperty = this.customProperty ? this.customProperty : null;
                if (customProperty&& self.isAdd == '2') {
                    //编辑
                    self.customProperty.isAdd = '2', //编辑
                    self.customProperty.type = this.editMarkerType,
                    self.customProperty.iconUrl = this.selectedMarkerIcon,
                    self.customProperty.propertyInfo.name = this.markName;
                    self.customProperty.propertyInfo.desc = this.markRemark;
                    self.customProperty.propertyInfo.altitude = Number(self.customProperty.propertyInfo.altitude)
                    self.customProperty.propertyInfo.longitude = Number(self.customProperty.propertyInfo.longitude)
                    self.customProperty.propertyInfo.latitude = Number(self.customProperty.propertyInfo.latitude)
                    self.customProperty.position = [self.customProperty.propertyInfo.longitude ,self.customProperty.propertyInfo.latitude,self.customProperty.propertyInfo.altitude]
                    self.customProperty.points = [self.customProperty.propertyInfo.longitude ,self.customProperty.propertyInfo.latitude,self.customProperty.propertyInfo.altitude]
                    if (self.entityType == "MODEL") { //模型
                        self.customProperty.iconUrl = 'shuimadun'
                        self.customProperty.type = 'shuimadun'
                    } else if (self.entityType == 'MARKER') {//marker
                        self.customProperty.type = this.editMarkerType
                        if (self.customProperty.type == 'jingyuan') { //警员
                            self.customProperty.propertyInfo.policeMan = this.markName
                        } else if (self.customProperty.type == 'jingche') {//警车

                        } else if (self.customProperty.type == 'tingchechang') {//停车场

                        } else if (self.customProperty.type == 'kongzhidian') {//控制点 

                        }
                    } else if(self.entityType == 'LABEL'){
                        self.customProperty.type = 'label'
                        self.customProperty.iconUrl = ''
                    }
                } else {
                    //新增
                    self.customProperty.type = this.editMarkerType,
                    self.customProperty.iconUrl = this.selectedMarkerIcon,
                    self.customProperty.propertyInfo.name = this.markName;
                    self.customProperty.propertyInfo.desc = this.markRemark;
                    // self.customProperty.propertyInfo.longitude = self.entityMoveEndPosition[0];
                    // self.customProperty.propertyInfo.latitude =self.entityMoveEndPosition[1];
                    // self.customProperty.propertyInfo.altitude = self.entityMoveEndPosition[2]; 
                    // self.customProperty.position = self.entityMoveEndPosition
                    // self.customProperty.points = self.entityMoveEndPosition
                    self.customProperty.propertyInfo.altitude = Number(self.customProperty.propertyInfo.altitude)
                    self.customProperty.propertyInfo.longitude = Number(self.customProperty.propertyInfo.longitude)
                    self.customProperty.propertyInfo.latitude = Number(self.customProperty.propertyInfo.latitude)
                    self.customProperty.position = [self.customProperty.propertyInfo.longitude ,self.customProperty.propertyInfo.latitude,self.customProperty.propertyInfo.altitude]
                    self.customProperty.points = [self.customProperty.propertyInfo.longitude ,self.customProperty.propertyInfo.latitude,self.customProperty.propertyInfo.altitude]
                    self.customProperty.propertyInfo.actplanId = this.actplanId ? this.actplanId : "1" //预案id
                    if (self.entityTypeCode == 4) { //模型
                        self.customProperty.iconUrl = 'shuimadun'
                        self.customProperty.type = 'shuimadun'
                    } else if (self.entityTypeCode == 0) {//marker
                        self.customProperty.type = this.editMarkerType
                        if (self.customProperty.type == 'jingyuan') { //警员
                            self.customProperty.propertyInfo.policeMan = this.markName
                            console.log(self.customProperty, '=====警员');

                        } else if (self.customProperty.type == 'jingche') {//警车
                            
                        } else if (self.customProperty.type == 'tingchechang') {//停车场
                            
                        } else if (self.customProperty.type == 'kongzhidian') {//控制点 
                            
                        }
                    } else if(self.entityTypeCode == '3'){ //label
                        self.customProperty.type = 'label'
                        self.customProperty.iconUrl = ''
                    }
                }
                console.log(this.customProperty, '======传参');
            }
        },
        changeHandler(img, index) {
            if (this.markerManager) {
                this.markerManager.changeHandler(img);
                this.selectedImage = img;
                this.selectedImageIndex = index;
                this.editMarkerType = img.substring(img.lastIndexOf('/') + 1, img.lastIndexOf('.'))
            }
            this.selectPanel = false;
        },
        selectChangeHandler(iconType) {
            if (this.markerManager) {
                let img = '/static/images/' + iconType + '.png';
                this.markerManager.changeHandler(img);
                this.selectedImage = img;
                this.selectedMarkerIcon = iconType
                this.editMarkerType = iconType.split('-')[0]
            }
        },
        generateId() {
            if (this.markerManager) {
                return this.markerManager.generateId();
            }
        },
        getById(id) {
            if (this.has(id)) {
                return this.markerManager.get(id);
            }
        },
        has(id) {
            if (this.markerManager) {
                return this.markerManager.has(id)
            }
            return false
        },
        /**
         * 初始话加载点数据
         */
        initDataLayer(data) {
            if (this.markerManager) {
                this.markerManager.loadDataLayer(data);
            }
        },
        importMarks() { }
    },
    watch: {
        visible(val) {
            if (val) {
                this.$nextTick(() => {
                    this.markerMove()
                    //this.$refs.nameinput.focus();
                })
            }else{
                // 移除 marker-move-end 监听
                window.removeEventListener("marker-move-end", e => {
                    console.log(e, '========移除监听self=');
                });
                
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.panel-info-container{
    position: absolute;
    top: 180px;
    left: 20px;
    z-index: 10000;
}
#markerContainer {
    position: fixed;
    z-index: 2;
    top: 200px;
    left: 100%;
    transform: translateX(-636px);
    font-size: $font-size;

    * {
        font-size: $font-size;
    }
}

#msg1,
.msg {
    width: 150px;
    height: 30px;
    position: fixed;
}

#submit1,
.submit {
    position: fixed;
    height: 34px;
    width: 34px;
}


.marker-main-class {
    color: $color;
}

.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: $font-size;
    font-weight: normal;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 0px;
}

#menu {
    position: fixed;
    width: 100px;
    height: 70px;
    border: 2px solid #b7b1a3;
    background-color: $bg-color;
    text-align: left;
}



#menu>div {
    width: 80px;
    height: 30px;
    line-height: 30px;
    vertical-align: center;
    padding-left: 20px;
    padding-top: 0px;
}

#menu>div:hover {
    background-color: #e5e5e5;
}

.no-image-class {
    width: 24px;
    height: 24px;
    line-height: 24px;
}

#createMerkerPanel {
    left: 0px;
    top: 0px;
    width: 600px;
    height: auto;
    position: absolute;
    border: 0px solid #b7b1a3;
    background-color: $bg-color;
    color: $color;
    border-radius: 4px;

    .image-list-class {
        display: block;
        padding: 10px;

        >img {
            width: 32px;
            margin: 8px;
            cursor: pointer;
        }
    }

    :deep(.el-input__wrapper) {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .pane-row {
        display: flex;
        align-items: center;
        flex-direction: row;
        height: 40px;
        padding-bottom:8px;
        label{
            width: 90px;
            display: inline-block;
        }
        .el-select{
            width: 200px;
        }
        
    }

    .pane-desc {
        height: 80px;
    }
}

#createMerkerPanel .el-input {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    margin-top: 0px;
    width: 200px;
    margin-left: 0px !important;
    position: relative;
}

#createMerkerPanel .el-button {
    display: inline-block;
    margin-top: 8px;
    margin-right: 20px;
    float: right;
}

#createMerkerPanel .el-header {
    height: 45px !important;
    line-height: 30px;
    color: $color;
    padding: $padding;

    span,
    i {
        margin: $item-margin;
        color: $color;
    }
}

#createMerkerPanel .el-footer {
    padding-right: 40%;
}

#createMerkerPanel .el-textarea {
    width: 82%;
}

#createMerkerPanel .el-aside {
    width: 28% !important;
    // padding-left: 10px;
    text-align: center;
    line-height: 20px;

    img {
        width: 30px;
        margin: 4px;
        padding: 2px;
        border-radius: 2px;

        cursor: pointer;
    }

    .selected {
        border: 1px solid #409eff;
    }

    .not-selected {
        border: 1px solid #e5e5e5;
    }

    a {
        display: inline-block;
        width: 32px;
    }
}

#createMerkerPanel .el-main {
    width: 70%;
    padding-left: 10px !important;
}

#createMerkerPanel .el-main {
    padding: 0px 0px 0px 0px;
}

#createMerkerPanel img {
    margin-top: 8px;
    // width:32px;
    // height:32px;
    // margin-left: 5px;
}

.crusor-tip {
    width: 200px;
    height: 30px;
    line-height: 30px;
    vertical-align: center;
    border: 1px solid #e5e5e5;
    color: white;
    background-color: #00000099;
    position: fixed;
}

#createLabelPanel ,#createModelPanel{
    right: 16px;
    top: 400px;
    position: fixed;
    z-index: 999;
    height: 80px;
    width: 320px;
    background: rgba(0, 0, 0, 0.55);
    border-radius: 4px;
    padding: 20px 10px 10px;

    .el-input {
        display: inline-block;
        width: 180px;
        margin: 0 10px;
        vertical-align: middle;
        height: 40px;
    }

    :v-deep(.el-input__wrapper) {
        height: 100%;
        width: 100%;
        background-color: #fff;
    }

    .el-button {
        display: inline-block;
        // width:60px;
        margin: 0 2px;
        width: 92px;
        height: 36px;
        background-color: $bg-color;
        border: none;
        color: $color;
        border-radius: $b-radius;
        vertical-align: middle;
    }

    :v-deep(.el-dialog__footer) {
        text-align: center;
    }

    :v-deep(.el-dialog__body) {
        padding: 0 20px;
    }

    .upload-class {
        min-height: 200px;
    }
}
</style>
