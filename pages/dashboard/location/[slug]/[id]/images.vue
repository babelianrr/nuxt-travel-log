<script lang="ts" setup>
import { FetchError } from "ofetch";

import type { SelectLocationLogImage } from "../../../../../lib/db/schema";

const route = useRoute();
const locationStore = useLocationStore();
const {
    currentLocationLog: locationLog,
} = storeToRefs(locationStore);

const { $csrfFetch } = useNuxtApp();

const image = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const imageInput = useTemplateRef("imageInput");
const isOpen = ref(false);
const isDeleting = ref(false);
const deleteError = ref("");
const deletingImage = ref<SelectLocationLogImage | null>(null);

function onDialogClose() {
    deletingImage.value = null;
    isOpen.value = false;
}

function deleteImage(image: SelectLocationLogImage) {
    deletingImage.value = image;
    isOpen.value = true;
}

async function confirmDelete() {
    if (!deletingImage.value) {
        return;
    }
    isOpen.value = false;
    try {
        isDeleting.value = true;
        deleteError.value = "";
        await $fetch(`/api/locations/${route.params.slug}/${route.params.id}/image/${deletingImage.value.id}`, {
            method: "DELETE",
        });
        await locationStore.refreshCurrentLocationLog();
    }
    catch (e) {
        const error = e as FetchError;
        deleteError.value = getFetchErrorMessage(error);
    }
    isDeleting.value = false;
    deletingImage.value = null;
}

function selectImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
        image.value = file;
        previewUrl.value = URL.createObjectURL(file);
    }
}

async function getChecksum(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

async function uploadImage() {
    if (!image.value || !previewUrl.value)
        return;

    loading.value = true;
    errorMessage.value = "";
    const previewImage = new Image();
    previewImage.addEventListener("load", async () => {
        const resizedWidth = Math.min(1000, previewImage.width);
        const resizedImage = await createImageBitmap(previewImage, {
            resizeWidth: resizedWidth,
        });
        const canvas = new OffscreenCanvas(resizedWidth, resizedImage.height);
        canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resizedImage);
        const blob = await canvas.convertToBlob({
            type: "image/jpeg",
            quality: 0.9,
        });

        const checksum = await getChecksum(blob);

        try {
            const { fields, key, url } = await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/sign-image`, {
                method: "POST",
                body: {
                    contentLength: blob.size,
                    checksum,
                },
            });

            const formData = new FormData();

            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            formData.append("file", blob);

            await $fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                    "x-amz-checksum-algorithm": "SHA256",
                },
            });

            await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/image`, {
                method: "POST",
                body: {
                    key,
                },
            });

            await locationStore.refreshCurrentLocationLog();
            image.value = null;
            previewUrl.value = null;
            if (imageInput.value) {
                imageInput.value.value = "";
            }
        }
        catch (e) {
            if (e instanceof FetchError) {
                errorMessage.value = (e as FetchError).statusMessage || "Unknown error occurred.";
            }
            else if (e instanceof Error) {
                errorMessage.value = (e as Error).message;
            }
            else {
                errorMessage.value = "Unknown error occurred.";
            }
        }

        loading.value = false;
    });
    previewImage.src = previewUrl.value;
}
</script>

<template>
    <div class="">
        <h2 class="text-xl mb-2">
            Manage {{ `"${locationLog?.name}"` || "" }} Images
        </h2>
        <div class="flex gap-4">
            <div class="flex flex-col gap-2 w-72">
                <div class="relative bg-gray-500 h-28 w-full flex justify-center items-center p-1">
                    <p v-if="!previewUrl" class="text-center text-white">
                        Select an image
                    </p>
                    <img
                        v-else
                        :src="previewUrl"
                        alt="upload-preview"
                        class="h-full object-cover"
                    >
                    <div v-if="loading || errorMessage" class="size-full absolute flex justify-center items-center bg-black opacity-50">
                        <div v-if="loading" class="loading loading-lg" />
                        <div v-else-if="errorMessage" class="error">
                            {{ errorMessage }}
                        </div>
                    </div>
                </div>
                <input
                    ref="imageInput"
                    type="file"
                    class="file-input"
                    :disavled="loading"
                    @change="selectImage"
                >
                <button
                    class="btn btn-primary"
                    :disabled="!image || loading"
                    @click="uploadImage"
                >
                    <Icon name="tabler:photo-share" size="24" />
                    Upload
                </button>
            </div>
            <ImageList :images="locationLog?.images || []">
                <template #default="{ image: item }">
                    <button
                        :disabled="deletingImage === image && isDeleting"
                        class="btn btn-error btn-xs"
                        @click="deleteImage(item)"
                    >
                        <div v-if="deletingImage === image && isDeleting" class="loading loading-xs" />
                        <Icon
                            v-else
                            name="tabler:trash-x-filled"
                            size="18"
                        />
                        Delete
                    </button>
                </template>
            </ImageList>
        </div>
        <AppDialog
            :is-open="isOpen"
            title="Warning!"
            confirm-label="Delete"
            confirm-class="btn-error"
            description="Deleting this image cannot be undone. Proceed to delete?"
            @on-closed="onDialogClose"
            @on-confirmed="confirmDelete"
        />
    </div>
</template>
