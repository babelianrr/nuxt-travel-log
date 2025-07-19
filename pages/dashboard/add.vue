<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

import { CENTER_SGP } from "~/lib/constants";

import { InsertLocation } from "../../lib/db/schema";

const mapStore = useMapStore();
const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
    validationSchema: toTypedSchema(InsertLocation),
    initialValues: {
        name: "",
        description: "",
        long: (CENTER_SGP as [number, number])[0],
        lat: (CENTER_SGP as [number, number])[1],
    },
});

const onSubmit = handleSubmit(async (values) => {
    try {
        submitError.value = "";
        loading.value = true;
        await $csrfFetch("/api/locations", {
            method: "post",
            body: values,
        });
        submitted.value = true;
        navigateTo("/dashboard");
    }
    catch (e) {
        const error = e as FetchError;
        if (error.data?.data) {
            setErrors(error.data?.data);
        }
        submitError.value = error.statusMessage || "An unknown error occurred.";
    }
    loading.value = false;
});

function formatNumber(value?: number) {
    if (!value)
        return 0;
    return value.toFixed(5);
}

effect(() => {
    if (mapStore.addedPoint) {
        setFieldValue("long", mapStore.addedPoint.long);
        setFieldValue("lat", mapStore.addedPoint.lat);
    }
});

onMounted(() => {
    mapStore.addedPoint = {
        id: 1,
        name: "Added Point",
        description: "",
        long: (CENTER_SGP as [number, number])[0],
        lat: (CENTER_SGP as [number, number])[1],
    };
});

onBeforeRouteLeave(() => {
    if (!submitted.value && meta.value.dirty) {
        // eslint-disable-next-line no-alert
        const confirm = window.confirm("Are you sure you want to leave? All changes will not be saved");
        if (!confirm) {
            return false;
        }
    }
    mapStore.addedPoint = null;
    return true;
});
</script>

<template>
    <div class="container max-w-md mx-auto p-4">
        <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-2">
                <h1 class="text-lg">
                    Add Location
                </h1>
                <p class="text-sm">
                    A location is a place you have traveled or will travel to. It can be a city, country, state, or point of interest. You can add specific times you visited this location after adding it.
                </p>
                <div
                    v-if="submitError"
                    role="alert"
                    class="alert alert-error"
                >
                    <Icon name="tabler:alert-triangle-filled" size="24" />
                    <span>{{ submitError }}</span>
                </div>
            </div>
            <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
                <AppFormField
                    label="Name"
                    name="name"
                    type="text"
                    :error="errors.name"
                    :disabled="loading"
                />
                <AppFormField
                    as="textarea"
                    label="Description"
                    name="description"
                    type="textarea"
                    :error="errors.description"
                    :disabled="loading"
                />
                <p>Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker to your desired location.</p>
                <p>Or double click on the map</p>
                <p class="text-xs text-gray-400">
                    Current location: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
                </p>
                <div class="flex justify-end gap-2">
                    <button
                        :disabled="loading"
                        type="button"
                        class="btn btn-outline"
                        @click="router.back()"
                    >
                        <Icon name="tabler:arrow-left" size="24" />
                        Cancel
                    </button>
                    <button
                        :disabled="loading"
                        type="submit"
                        class="btn btn-primary"
                    >
                        <span v-if="loading" class="loading loading-spinner loading-md" />
                        <Icon
                            v-else
                            name="tabler:circle-plus-filled"
                            size="24"
                        />
                        Add
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
