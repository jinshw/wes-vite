<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";

const props = defineProps({
  collapse: Boolean
});

const { title,titleShort } = useNav();
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapses: props.collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="props.collapse"
        key="props.collapse"
        :title="titleShort"
        class="sidebar-logo-link"
        to="/"
      >
        <FontIcon icon="team-iconlogo" svg style="width: 35px; height: 35px" />
        <span class="sidebar-title">{{ titleShort }}</span>
      </router-link>
      <router-link
        v-else
        key="expand"
        :title="titleShort"
        class="sidebar-logo-link"
        to="/"
      >
        <FontIcon icon="team-iconlogo" svg style="width: 35px; height: 35px" />
        <span class="sidebar-title">{{ titleShort }}</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 48px;
  text-align: center;
  overflow: hidden;

  .sidebar-logo-link {
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 5px;

    .sidebar-title {
      display: block;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      color: #1890ff;
      font-weight: 600;
      font-size: 16px;
      margin-top: 10px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    }
  }

  .collapses {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
