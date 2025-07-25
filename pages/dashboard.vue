<script lang="ts" setup>
const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const locationsStore = useLocationStore();
const mapStore = useMapStore();

onMounted(() => {
    isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
    if (route.path !== "/dashboard") {
        locationsStore.refresh();
    }
});

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
    localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
    <div class="flex flex-1">
        <div class="bg-base-100 transition-all duration-300 shrink-0" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
            <div
                class="flex hover:cursor-pointer hover:bg-base-200"
                :class="{ 'justify-end': isSidebarOpen, 'justify-center': !isSidebarOpen }"
                @click="toggleSidebar"
            >
                <Icon
                    v-if="isSidebarOpen"
                    name="tabler:chevron-left"
                    size="36"
                />
                <Icon
                    v-else
                    name="tabler:chevron-right"
                    size="36"
                />
            </div>
            <div class="flex flex-col gap-2">
                <SidebarButton
                    :show-label="isSidebarOpen"
                    label="Locations"
                    icon="tabler:map"
                    href="/dashboard"
                />
                <SidebarButton
                    :show-label="isSidebarOpen"
                    label="Add Location"
                    icon="tabler:circle-plus-filled"
                    href="/dashboard/add"
                />
                <div v-if="sidebarStore.sidebarItems.length" class="divider" />
                <div v-if="sidebarStore.loading" class="px-4">
                    <div class="skeleton h-4 w-full" />
                </div>
                <div v-else class="flex flex-col">
                    <SidebarButton
                        v-for="item in sidebarStore.sidebarItems"
                        :key="item.id"
                        :show-label="isSidebarOpen"
                        :label="item.label"
                        :icon="item.icon"
                        :to="item.to"
                        :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
                        @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
                        @mouseleave="mapStore.selectedPoint = null"
                    />
                </div>
                <div class="divider" />
                <SidebarButton
                    :show-label="isSidebarOpen"
                    label="Sign Out"
                    icon="tabler:logout-2"
                    href="/sign-out"
                />
            </div>
        </div>
        <div class="flex-1 overflow-auto bg-base-200">
            <div class="flex size-full" :class="{ 'flex-col': route.path !== '/dashboard/add' }">
                <NuxtPage />
                <AppMap class="flex-1" />
            </div>
        </div>
    </div>
</template>
