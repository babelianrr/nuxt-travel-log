<script lang="ts" setup>
const route = useRoute();
const mapStore = useMapStore();

const { slug } = route.params;
const { data: location, status, error } = await useFetch(`/api/locations/${slug}`, { lazy: true });

effect(() => {
    if (location.value) {
        mapStore.mapPoints = [location.value];
    }
});
</script>

<template>
    <div class="p-4 min-h-64">
        <div v-if="status === 'pending'">
            <div class="loading" />
        </div>
        <div v-if="location && status !== 'pending'">
            <h2 class="text-xl">
                {{ location?.name }}
            </h2>
            <p class="text-sm">
                {{ location.description }}
            </p>
            <p v-if="!location.locationLogs.length" class="text-sm mt-4 italic">
                Add a location log to get started.
            </p>
            <button class="btn btn-primary mt-2">
                <Icon name="tabler:map-pin-plus" size="24" />
                Add Location
            </button>
        </div>
        <div v-if="error && status !== 'pending'" class="alert alert-error">
            <h2 class="text-lg text-danger">
                {{ error.statusMessage }}
            </h2>
        </div>
    </div>
</template>
