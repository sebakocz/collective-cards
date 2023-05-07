<template>
    <div v-if="!isLoading" class="flex w-[90%] flex-col items-center gap-4">
        <textarea
            v-model="deckList"
            class="h-96 w-full resize-none rounded-md border-2 border-gray-300 p-2"
            :placeholder="exampleDeckList"
        ></textarea>
        <p v-for="error in errors" :key="error" class="text-red-500">
            {{ error }}
        </p>
        <button
            class="mt-2 rounded-md border-2 border-gray-300 p-2"
            @click="importCards(deckList)"
        >
            Import Custom Cards
        </button>
    </div>
    <LoadingSpinner v-else />
</template>
<script setup lang="ts">
import { exampleDeckList } from '@src/constants/import.js'
import { useCardImporter } from '@src/libs/api/cardImporter'
import LoadingSpinner from '@src/components/LoadingSpinner.vue'
import { ref } from 'vue'

const deckList = ref('')

const { isLoading, importCards, errors } = useCardImporter()
</script>
