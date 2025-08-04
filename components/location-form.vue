<script lang="ts" setup>
import { CENTER_JKT } from "../lib/constants";
import { InsertLocation } from "../lib/db/schema";

const props = defineProps<{
    initialValues?: InsertLocation;
    onSubmit: (location: InsertLocation) => Promise<any>;
    onSubmitComplete: () => void;
    submitLabel: string;
    submitIcon: string;
    zoom?: number;
}>();
</script>

<template>
    <LocationBaseForm
        v-slot="{ errors, loading }"
        :schema="InsertLocation"
        :zoom="props.zoom || 8"
        :initial-values="props.initialValues || {
            name: '',
            description: '',
            long: (CENTER_JKT as [number, number])[0],
            lat: (CENTER_JKT as [number, number])[1],
        }"
        :on-submit
        :on-submit-complete
        :submit-label
        :submit-icon
    >
        <AppFormField
            name="name"
            label="Name"
            :error="errors.name"
            :disabled="loading"
        />
        <AppFormField
            name="description"
            label="Description"
            type="textarea"
            :error="errors.description"
            :disabled="loading"
        />
    </LocationBaseForm>
</template>
