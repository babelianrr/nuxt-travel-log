<script lang="ts" setup>
import type { SelectLocationLogImage } from "~/lib/db/schema";

const props = defineProps<{
    images: SelectLocationLogImage[];
}>();

const config = useRuntimeConfig();

const visibleRef = ref(false);
const indexRef = ref(0);

const imgs = props.images.map((v) => {
    return `${config.public.s3BucketUrl}/${v.key}`;
});

function showImg(index: number) {
    indexRef.value = index;
    visibleRef.value = true;
}

const onHide = () => (visibleRef.value = false);
</script>

<template>
    <div class="flex gap-2 overflow-auto">
        <div
            v-for="(image, index) in props.images"
            :key="image.id"
            class="card card-compact h-40 w-64 shrink-0 flex items-center justify-center bg-base-300"
            @click="() => showImg(index)"
        >
            <div class="card-body size-full cursor-pointer">
                <img class="size-full object-cover" :src="`${config.public.s3BucketUrl}/${image.key}`">
                <slot :image />
            </div>
        </div>
        <VueEasyLightbox
            :visible="visibleRef"
            :imgs="imgs"
            :index="indexRef"
            @hide="onHide"
        />
    </div>
</template>
