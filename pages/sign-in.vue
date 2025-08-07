<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
    <div class="hero bg-base-300 container mx-auto mt-4">
        <div class="hero-content text-center min-h-96">
            <div class="flex flex-col gap-2 max-w-md">
                <h1 class="text-5xl font-bold">
                    Sign In
                </h1>
                <p class="py-6">
                    Use one of your desired sign in options to sign in (or sign up) automatically.
                </p>
                <div>
                    <button
                        :disabled="authStore.loading"
                        class="btn btn-accent"
                        @click="authStore.signInGitHub"
                    >
                        <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
                        <Icon
                            v-else
                            name="tabler:brand-github"
                            size="24"
                        />
                        Sign In with GitHub
                    </button>
                </div>
                <div>
                    <button
                        :disabled="authStore.loading"
                        class="btn btn-accent"
                        @click="authStore.signInGoogle"
                    >
                        <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
                        <Icon
                            v-else
                            name="tabler:brand-google"
                            size="24"
                        />
                        Sign In with Google
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
