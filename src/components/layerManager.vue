<template>
  <div class="layer-manager-box" id="layer-manager-box">
    <div class="layer-manager-header" id="layer-manager-header" style="display:none;">
      <i class="cesiumDrawFont iconclose1"></i>
      <span>标绘清单</span>
      <span class="closebtn cesiumDrawFont iconclose" @click="closeLayerManaer"></span>
    </div>
    <!-- <div class="layer-manager-tools">
      <span class="el-dropdown-link" @click="importHandler">
        <i class="cesiumDrawFont iconimport action-icon-class">
          <span>导入</span>
        </i>
      </span>
      <el-dropdown trigger="click" @command="exportHandler">
        <span class="el-dropdown-link">
          <i class="cesiumDrawFont iconexport action-icon-class">
            <span>导出</span>
          </i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="MARKER"
              class="cesiumDrawFont iconmarker">标记</el-dropdown-item>
            <el-dropdown-item command="POLYLINE"
              class="cesiumDrawFont iconpolyline">线</el-dropdown-item>
            <el-dropdown-item command="POLYGON"
              class="cesiumDrawFont iconpolygon">多边形</el-dropdown-item>
            <el-dropdown-item command="LABEL"
              class="cesiumDrawFont iconlabel">书签</el-dropdown-item>
          </el-dropdown-menu>
        </template>
</el-dropdown>
<i class="cesiumDrawFont iconremove action-icon-last-class" @click="removeAll">
  <span>清空</span>
</i>
</div> -->
    <div id="layerTree" class="graphic-draw-layer-manager-class">
      <el-input
        class="filter-input"
        v-model="filterText"
        placeholder="请输入关键字"
      />
      <el-tree :data="json" show-checkbox node-key="id" ref="tree" @check="checkAction"
      :filter-node-method="filterNode"
        :default-expanded-keys="['marker', 'polyline', 'polygon']">
        <template #default="{ data }">
          <span class="custom-tree-node">
            <i :class="data.icon" class="action-item"></i>
            <el-input v-model="newName" v-if="data.edit" @keypress.enter="renameAction(data)"></el-input>
            <span class="node-name action-item" v-else>{{ data.text }}</span>
            <span v-if="!data.children" class="action-class">
              <i v-for="tool in tools" :key="tool.id" class="cesiumDrawFont action-item" :class="[tool.icon]"
                :title="tool.text" @click="tool.action.call(this, data)"></i>
              <i class="cesiumDrawFont action-item iconremove" @click="editDelete(data)" title="删除"></i>
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script>
function locate(data) {
  this.$emit("locate", data.id);
}
function rename(data, id, text) {
  // data.edit=true;
  if (data) {
    this.$set(data, "edit", true);
    this.newName = data.text;
  } else {
    for (let ls of this.json) {
      for (let l of ls.children) {
        if (l.id === id) {
          l.text = text;
        }
      }
    }
  }
}
function edit(data) {
  this.$emit("edit", data.id);
}

function drop(data) {
  if (!data) return;
  this.$emit("delete", data.id);
  const index = this.checked.indexOf(data.id);
  if (data.id > -1) {
    this.checked.splice(index, 1);
  }
  this.$nextTick(() => {
    this.$refs.tree.setCheckedKeys(this.checked);
  });

  for (let ls of this.json) {
    let i = 0;
    for (let l of ls.children) {
      if (l.id === data.id) {
        ls.children.splice(i, 1);
        break;
      }
      i++;
    }
  }
}
export default {
  data() {
    return {
      markerTree: new Map(),
      polylineTree: new Map(),
      polygonTree: new Map(),
      labelTree: new Map(),
      modelTree: new Map(),
      renameNodeStatus: false,
      checked: [],
      newName: "",
      filterText :'',//过滤关键字
      json: [
        {
          id: "marker",
          text: "标记",
          type: "marker",
          icon: "cesiumDrawFont icon-lujing",
          children: [
            // { 假数据 废弃
            //   id: "1",
            //   text: "huke",
            //   name: "huke",
            //   icon: "el-icon-document",
            //   type: "marker",
            //   position: {
            //     lon: 120.886810,
            //     lat: 31.970442,
            //     height: 6.723
            //   }
            // },{
            //   id: "2",
            //   text: "huke2",
            //   icon: "el-icon-document",
            //   type: "marker",
            //   name: "huke",
            //   position: {
            //     lon: 120.896810,
            //     lat: 31.970442,
            //     height: 6.723
            //   }
            // }
          ]
        },
        {
          id: "polyline",
          text: "线",
          type: "polyline",
          icon: "cesiumDrawFont iconpolyline",
          children: []
        },
        {
          id: "polygon",
          text: "多边形",
          type: "polygon",
          icon: "cesiumDrawFont iconpolygon",
          children: []
        },
        {
          id: "label",
          text: "文字",
          type: "label",
          icon: "cesiumDrawFont iconlabel",
          children: []
        },
        {
          id: "model",
          icon: "cesiumDrawFont iconmodel",
          text: "模型",
          type: "model",
          children: []
        }
      ],
      defaultTools: {
        locate: { text: "定位", icon: "iconlocate", action: this.locate },
        // rename: {
        //   text: "重命名",
        //   icon: "iconrename",
        //   action: this.rename
        // },
        edit: { text: "编辑", icon: "iconedit", action: this.edit },
        // drop: { text: "删除", icon: "iconremove", action: this.drop }
      }
    };
  },
  props: {
    tools: {
      default: function () {
        return {
          locate: { text: "定位", icon: "iconlocate", action: locate },
          // rename: {
          //   text: "重命名",
          //   icon: "iconrename",
          //   action: rename
          // },
          edit: { text: "编辑", icon: "iconedit", action: edit },
          // drop: { text: "删除", icon: "iconremove", action: drop }
        }
      }
    }
  },
  mounted() {
  },
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  computed: {},
  methods: {
    filterNode(value, data) {
        if (!value) return true;
        return data.text.indexOf(value) !== -1;
      },
    editDelete(data) {
      console.log(data, '删除data====================')
      if (!data) return;
      this.$emit("delete", data.id);
      const index = this.checked.indexOf(data.id);
      if (data.id > -1) {
        this.checked.splice(index, 1);
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.checked);
      });

      for (let ls of this.json) {
        let i = 0;
        for (let l of ls.children) {
          if (l.id === data.id) {
            ls.children.splice(i, 1);
            break;
          }
          i++;
        }
      }
    },

    checkAction(data, node) {
      console.log(data, node, 'checkAction=')
      if (node.checkedKeys.includes(data.id)) {
        this.$emit("select", data.id, true);
      } else {
        this.$emit("select", data.id, false);
      }
    },
    locate(data) {
      locate.call(this, data);
    },
    rename(data, id, text) {
      rename.call(this, data, id, text);
    },
    edit(data) {
      edit.call(this, data)
    },
    drop(data) {
      drop.call(this, data);
    },
    renameAction(data) {
      data.edit = false;
      this.$emit("rename", data.id, this.newName);
      data.text = this.newName;
    },
    removeAll() {
      this.$emit("clear");
      for (let ls of this.json) {
        ls.children.splice(0);
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([]);
      });
    },
    initListJsonTemplate(){
      this.json = [
        {
          id: "polygon",
          text: "多边形",
          type: "polygon",
          icon: "cesiumDrawFont iconpolygon",
          children: []
        }
      ]
    },
    initListJson(){
      this.json = [
        {
          id: "marker",
          text: "标记",
          type: "marker",
          icon: "cesiumDrawFont icon-lujing",
          children: []
        },
        {
          id: "polyline",
          text: "线",
          type: "polyline",
          icon: "cesiumDrawFont iconpolyline",
          children: []
        },
        {
          id: "polygon",
          text: "多边形",
          type: "polygon",
          icon: "cesiumDrawFont iconpolygon",
          children: []
        },
        {
          id: "label",
          text: "文字",
          type: "label",
          icon: "cesiumDrawFont iconlabel",
          children: []
        },
        {
          id: "model",
          icon: "cesiumDrawFont iconmodel",
          text: "模型",
          type: "model",
          children: []
        }
      ]
    },
    insertLayer(type, id, name,customProperty) {
      name = name || "未命名";
      this.json[type].children.push({
        id: id,
        text: name,
        icon: "el-icon-document",
        CustomProperty:customProperty
      });
      this.checked.push(id);
      this.$nextTick(() => {
        this.$refs.tree.setChecked(id,true,true)
      });
    },
    exportHandler(cmd) {
      this.$emit("export", cmd);
    },
    importHandler(cmd) {
      this.$emit("import", cmd);
    },
    closeLayerManaer() {
      this.$emit("close");
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-input{
  width: 310px !important;
  margin: 10px 0;
}
.layer-manager-box {
  width: $draw-panel-width;
  background-color: $bg-color;
  color: $color;
  height: 400px;
  border: 1px solid $border-color;
  :v-deep(span) {
    font-size: $font-size;
    display: inline-block;
    vertical-align: top;
  }
}
.el-tree{
  background: transparent !important;
  color: #fff;
}

.graphic-draw-layer-manager-class {
  height: 328px;
  z-index: 99;
  // position: absolute;
  padding: $padding;
  border-radius: $b-radius;
  overflow: auto;
  background-color: transparent ;//$bg-color;
  
  :v-deep(.el-checkbox__inner) {
    border: 1px solid $border-color;
  }

  :v-deep(.action-item) {
    margin: $item-margin;

    &:hover {
      color: $hover-color !important;
    }
  }

  :v-deep(.action-class) {
    right: 20px;
    position: absolute;
  }

  :v-deep(*) {
    color: $color !important;
    background-color: $bg-color !important;
    font-size: $font-size !important;
  }
}

.layer-manager-tools {
  // width: $g-width;
  height: $item-height;
  line-height: $item-height;
  padding: $padding;
  text-align: left;

  .action-icon-class {
    margin: $item-margin;
    cursor: pointer;
    color: $color;


    &:hover {
      color: $hover-color;
    }

    span {
      color: $color;

      &:hover {
        color: $hover-color;
      }
    }
  }

  .el-dropdown {
    color: $color;
    vertical-align: middle;
    margin-top: -5px;
    padding-left: 12px;
  }

  .action-icon-last-class {
    float: right;
    cursor: pointer;
    vertical-align: middle;
    display: inline-block;
    margin-right: 5px;
    color: $color;

    &:hover {
      color: $hover-color;
    }

    span {
      color: $color;

      &:hover {
        color: $hover-color;
      }
    }
  }
}

.layer-manager-header {
  height: $title-height;
  line-height: $title-height;
  border-bottom: 1px solid $border-color;
  background-color: transparent;
  padding: $padding;
  color: $color;

  i {
    margin: $item-margin;
    color: $color;
  }

  span {
    color: $color;
  }
}

.el-input {
  width: 120px;
  display: inline-block;
  vertical-align: middle;
}
</style>
<style lang='scss'>
.layer-manager-handler-class {
  height: $item-height;
  line-height: $item-height;
  margin: 0 8px;
  float: right;
  color: $color;

  &:hover {
    color: $hover-color;
  }
}

.layer-manager-last-item {
  margin-right: 10px;
  color: $color;

  &:hover {
    color: $hover-color;
  }
}

.custom-tree-node {
  display: flex;

  .el-icon-document {
    flex: 0 0 2px;
  }

  .node-name {
    flex: 0 0 180px;
    text-align: left;
  }

  .action-class {
    flex: 0 0 80px;

    .action-item {
      padding: 0 8px;
      color:#84F8FB;
    }

  }
}
</style>
