<template>
    <div
        class="maptype-bar"
        :class="{ expand: isExpand }"
        @mouseover="mouseover"
        @mouseleave="mouseleave"
    >
        <!-- <div class="maptype-card maptype-2dmap" @click="switchMap('onepic')">
            <span>二维地图</span>
        </div>
        <div class="maptype-card maptype-3dmap" @click="switchMap('minemap')">
            <span>三维地图</span>
        </div> -->
        <div class="maptype-card maptype-jiamusi" @click="switchMap('ditu')">
            <span>底图</span>
        </div>
        <div class="maptype-card maptype-shoufa" @click="switchMap('yingxiang')">
            <span>影像</span>
        </div>
    </div>
</template>
<script>
import map3D from '@/utils/map3D'
export default {
  data () {
    return {
      isExpand: false
    }
  },
  mounted () {
  },
  methods: {
    mouseover () {
      this.isExpand = true
    },
    mouseleave  () {
      this.isExpand = false
    },
    switchMap (type) {
      if (type === 'yingxiang') {
        map3D.map.setLayoutProperty('IMAGERY', 'visibility', 'visible')
      } else if (type === 'ditu') {
        map3D.map.setLayoutProperty('IMAGERY', 'visibility', 'none')
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.maptype-bar {
    z-index: 10000;
    position: absolute;
    bottom: 0;
    right: 0;
    height: 80px;
    cursor: pointer;
    // width: 320px;
    width: 195px;
    transition-property: width, background-color;
    transition-duration: 0.4s;
    background-color: rgba(255, 255, 255, 0);
}
.maptype-bar .maptype-card {
    width: 86px;
    height: 60px;
    line-height: 60px;
    background-color: #eee;
    position: absolute;
    border-radius: 2px;
    top: 10px;
    right: 10px;
    box-sizing: border-box;
    transition-property: right, background-image;
    transition-duration: 0.4s;
    /* box-shadow: 2px 2px 1px 2px #d3d3d3; */
    text-shadow: 2px 2px 2px #000000;
    border: 1px solid #999;
}
.maptype-bar .maptype-card span {
    position: absolute;
    bottom: 0;
    right: 0;
    display: inline-block;
    padding: 3px 3px 2px 4px;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    color: #fff;
    border-top-left-radius: 2px;
}
.maptype-shoufa {
    background-image: url("/static/image/yingxiang.png");
    background-position: 0 0;
}
.maptype-jiamusi {
    background-image: url("/static/image/ditu.png");
    background-position: 0 0;
}
.expand .maptype-shoufa {
    right: 10px;
}
/* 上一个right=right+96px */
.expand .maptype-jiamusi {
    right: 106px;
}
.expand .maptype-3dmap {
    right: 202px;
    background-image: url("/static/images/minemap.png");
}
.expand .maptype-2dmap {
    right: 298px;
    background-image: url("/static/images/maptype.png");
    background-position: 0 0px;
}
</style>
