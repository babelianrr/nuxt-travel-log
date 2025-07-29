<script lang="ts" setup>
import type { InsertLocation } from "../../../../lib/db/schema";

const route = useRoute();
const locationStore = useLocationStore();
const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
    await $csrfFetch(`/api/locations/${route.params.slug}`, {
        method: "put",
        body: values,
    });
}

function onSubmitComplete() {
    navigateTo({
        name: "dashboard-location-slug",
        params: {
            slug: route.params.slug,
        },
    });
}
</script>

<template>
    <div>
        <div class="my-4">
            <h1 class="text-lg">
                Edit Location
            </h1>
            <p class="text-sm">
                A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
            </p>
        </div>
        <LocationForm
            v-if="locationStore.currentLocationStatus !== 'pending' && locationStore.currentLocation"
            :zoom="8"
            :on-submit
            :on-submit-complete
            :initial-values="locationStore.currentLocation"
            submit-label="Update"
            submit-icon="tabler:map-pin-up"
        />
    </div>
</template>
