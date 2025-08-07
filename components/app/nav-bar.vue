<script lang="ts" setup>
const config = useRuntimeConfig();
</script>

<template>
    <div class="navbar bg-primary text-primary-content">
        <div class="navbar-start">
            <NuxtLink to="/" class="btn btn-ghost text-xl">
                <img
                    class="size-full object-cover"
                    :src="`${config.public.s3BucketUrl}/tracking-app.png`"
                    alt="logo"
                >
            </NuxtLink>
        </div>
        <div class="navbar-end">
            <AppThemeToggle />
            <AuthButton />
        </div>
    </div>
</template>
