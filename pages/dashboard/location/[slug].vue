<script lang="ts" setup>
import type { FetchError } from "ofetch";

const route = useRoute();
const locationStore = useLocationStore();
const {
    currentLocation: location,
    currentLocationStatus: status,
    currentLocationError: error,
} = storeToRefs(locationStore);

const isOpen = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(() => status.value === "pending" || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);

function openDialog() {
    isOpen.value = true;
    (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
    try {
        isOpen.value = false;
        deleteError.value = "";
        isDeleting.value = true;
        $fetch(`/api/locations/${route.params.slug}`, {
            method: "DELETE",
        });

        navigateTo("/dashboard");
    }
    catch (e) {
        const error = e as FetchError;
        deleteError.value = getFetchErrorMessage(error);
    }
}

onMounted(() => {
    locationStore.refreshCurrentLocation();
});

onBeforeRouteUpdate((to) => {
    if (to.name === "dashboard-location-slug") {
        locationStore.refreshCurrentLocation();
    }
});
</script>

<template>
    <div class="p-4 min-h-64">
        <div v-if="loading">
            <div class="loading" />
        </div>
        <div v-if="errorMessage && !loading" class="alert alert-error">
            <h2 class="text-lg">
                {{ errorMessage }}
            </h2>
        </div>
        <div v-if="route.name === 'dashboard-location-slug' && location && !loading">
            <h2 class="text-xl">
                {{ location.name }}
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
                            <NuxtLink :to="{ name: 'dashboard-location-slug-edit', params: { slug: route.params.slug } }">
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
                {{ location.description }}
            </p>
            <div v-if="!location.locationLogs.length" class="mt-4">
                <p class="text-sm italic">
                    Add a location log to get started.
                </p>
            </div>
            <button class="btn btn-primary mt-2">
                Add Location Log
                <Icon name="tabler:map-pin-plus" size="24" />
            </button>
        </div>
        <div v-if="route.name !== 'dashboard-location-slug'">
            <NuxtPage />
        </div>
        <AppDialog
            :is-open="isOpen"
            title="Warning!"
            confirm-label="Delete"
            confirm-class="btn-error"
            description="Deleting this location will also delete all of the associated logs. This cannot be undone. Proceed to delete?"
            @on-closed="isOpen = false"
            @on-confirmed="confirmDelete"
        />
    </div>
</template>
