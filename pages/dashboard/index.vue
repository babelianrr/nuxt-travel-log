<script lang="ts" setup>
const isSidebarOpen = ref(true);

onMounted(() => {
    isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
    localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
    <div class="flex flex-1">
        <div class="bg-base-100 transition-all duration-300" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
            <div class="flex hover:cursor-pointer hover:bg-base-200" :class="{ 'justify-end': isSidebarOpen, 'justify-center': !isSidebarOpen }" @click="toggleSidebar">
                <Icon v-if="isSidebarOpen" name="tabler:chevron-left" size="36" />
                <Icon v-else name="tabler:chevron-right" size="36" />
            </div>
            <div class="flex flex-col gap-2">
                <SidebarButton :show-label="isSidebarOpen" label="Locations" icon="tabler:map" href="/dashboard" />
                <SidebarButton :show-label="isSidebarOpen" label="Add Location" icon="tabler:circle-plus-filled" href="/dashboard/add" />
                <div class="divider" />
                <SidebarButton :show-label="isSidebarOpen" label="Sign Out" icon="tabler:logout-2" href="/sign-out" />
            </div>
        </div>
        <div class="flex-1">
            <!--  -->
        </div>
    </div>
</template>
