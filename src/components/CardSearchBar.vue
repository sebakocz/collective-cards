<template>
    <div
        class="relative mx-auto w-full bg-main-200 p-3 dark:bg-main-800 lg:w-10/12"
    >
        <SearchIcon class="pointer-events-none absolute left-5 top-5" />
        <input
            type="text"
            class="w-full rounded p-2 pl-10 shadow"
            :placeholder="
                isMobile
                    ? 'Search...'
                    : 'Search for names, tribes and abilities...'
            "
            :value="filterStore.searchQuery"
            @input="onInput"
        />
    </div>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
import { useMobileCheck } from '@src/composables/mobileCheck'
import { useFilter } from '@src/stores/filterStore'
import SearchIcon from '@src/assets/icons/SearchIcon.vue'

const filterStore = useFilter()
const { isMobile } = useMobileCheck()

const onInput = debounce((event) => {
    filterStore.searchQuery = event.target.value
}, 300)
</script>
