<script lang="ts" setup>
const authStore = useAuthStore();
const route = useRoute();
</script>

<template>
    <div v-if="!authStore.loading && authStore.user" class="dropdown dropdown-end">
        <div
            tabindex="0"
            role="button"
            class="btn m-1"
        >
            <div v-if="authStore.user.image" class="avatar">
                <div class="w-8 rounded-full">
                    <img :src="authStore.user.image">
                </div>
            </div>
            {{ authStore.user.name }}
        </div>
        <ul tabindex="1" class="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
                <NuxtLink to="/sign-out">
                    <Icon name="tabler:logout-2" size="16" />
                    Sign Out
                </NuxtLink>
            </li>
        </ul>
    </div>
    <NuxtLink
        v-else-if="!authStore.loading && !authStore.user && route.name !== 'sign-in'"
        class="btn btn-accent"
        to="/sign-in"
    >
        <Icon name="tabler:login-2" size="24" />
        Sign In
    </NuxtLink>
</template>
