<script lang="ts" setup>
import type { InsertLocationLog } from "~/lib/db/schema";

const route = useRoute();
const locationStore = useLocationStore();
const {
    currentLocationLog: locationLog,
} = storeToRefs(locationStore);
const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocationLog) {
    await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
        method: "put",
        body: values,
    });
}

function submitComplete() {
    navigateTo({
        name: "dashboard-location-slug-id",
        params: {
            id: route.params.id,
            slug: route.params.slug,
        },
    });
}
</script>

<template>
    <h2 class="text-xl">
        Edit Location Log
    </h2>
    <!-- eslint-disable vue/no-multiple-template-root -->
    <LocationLogForm
        v-if="locationLog"
        submit-label="Save"
        submit-icon="tabler:map-pin-up"
        :on-submit="onSubmit"
        :on-submit-complete="submitComplete"
        :initial-values="locationLog"
    />
</template>
