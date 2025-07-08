<script lang="ts" setup>
import { CENTER_JKT } from "../../lib/constants";

const colorMode = useColorMode();

const style = computed(() =>
    colorMode.value === "dark"
        ? "/styles/dark.json"
        : "https://tiles.openfreemap.org/styles/liberty");
const center = CENTER_JKT;
const zoom = 8;
</script>

<template>
    <MglMap
        :map-style="style"
        :center="center"
        :zoom="zoom"
    >
        <MglNavigationControl />
    </MglMap>
</template>
