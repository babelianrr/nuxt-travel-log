<script lang="ts" setup>
import type { FetchError } from "ofetch";

const route = useRoute();
const locationStore = useLocationStore();
const {
    currentLocationLog: locationLog,
    currentLocationLogError: error,
    currentLocationLogStatus: status,
} = storeToRefs(locationStore);

const isOpen = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(() => isDeleting.value || status.value === "pending");
const errorMessage = computed(() => deleteError.value || error.value?.statusMessage);

function openDialog() {
    isOpen.value = true;
    (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
    try {
        isOpen.value = false;
        deleteError.value = "";
        isDeleting.value = true;
        $fetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
            method: "DELETE",
        });

        navigateTo({
            name: "dashboard-location-slug",
            params: {
                slug: route.params.slug,
            },
        });
    }
    catch (e) {
        const error = e as FetchError;
        deleteError.value = getFetchErrorMessage(error);
    }
}

onMounted(() => {
    locationStore.refreshCurrentLocationLog();
});

onBeforeRouteUpdate((to) => {
    if (to.name === "dashboard-location-slug-id") {
        locationStore.refreshCurrentLocationLog();
    }
});
</script>

<template>
    <div class="page-content-top">
        <div v-if="loading">
            <div class="loading" />
        </div>
        <div v-if="errorMessage && !loading" class="alert alert-error">
            <h2 class="text-lg">
                {{ errorMessage }}
            </h2>
        </div>
        <div v-if="route.name === 'dashboard-location-slug-id' && locationLog && !loading">
            <p class="text-sm italic text-gray-500">
                <span v-if="locationLog.startedAt !== locationLog.endedAt">
                    {{ formatDate(locationLog.startedAt) }} / {{ formatDate(locationLog.endedAt) }}
                </span>
                <span v-else>
                    {{ formatDate(locationLog.startedAt) }}
                </span>
            </p>
            <h2 class="text-xl">
                {{ locationLog.name }}
                <div class="dropdown dropdown-bottom">
                    <div
                        tabindex="0"
                        role="button"
                        class="btn btn-sm m-1 p-0"
                    >
                        <Icon name="tabler:dots-vertical" size="20" />
                    </div>
                    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li>
                            <NuxtLink :to="{ name: 'dashboard-location-slug-id-edit', params: { id: route.params.id, slug: route.params.slug } }">
                                <Icon name="tabler:map-pin-cog" size="16" />
                                Edit
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink class="text-error" @click="openDialog">
                                <Icon name="tabler:trash-x-filled" size="16" />
                                Delete
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </h2>
            <p class="text-sm">
                {{ locationLog.description }}
            </p>
        </div>
        <div v-else>
            <NuxtPage />
        </div>
        <AppDialog
            :is-open="isOpen"
            title="Warning!"
            confirm-label="Delete"
            confirm-class="btn-error"
            description="Deleting this location log cannot be undone. Proceed to delete?"
            @on-closed="isOpen = false"
            @on-confirmed="confirmDelete"
        />
    </div>
</template>
