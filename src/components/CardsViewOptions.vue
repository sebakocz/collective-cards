<template>
    <div class="flex flex-wrap justify-center gap-x-12">
        <div class="flex flex-wrap items-center justify-center">
            <ChipItem
                label="Standard"
                value="standard"
                :is-active="format === 'standard'"
                @click="updateFormat"
            />
            <ChipItem
                label="Legacy"
                value="legacy"
                :is-active="format === 'legacy'"
                @click="updateFormat"
            />
        </div>
        <div class="flex flex-wrap items-center justify-center">
            <ChipItem
                label="by Cost"
                value="cost"
                :is-active="sortBy === 'cost'"
                @click="updateSortBy"
            />
            <ChipItem
                label="by Name"
                value="name"
                :is-active="sortBy === 'name'"
                @click="updateSortBy"
            />
            <ChipItem
                label="by Release"
                value="release"
                :is-active="sortBy === 'release'"
                @click="updateSortBy"
            />
            <ArrowUpIcon
                class="h-5 w-5 hover:cursor-pointer"
                :class="{
                    'rotate-180': sortDirection === -1,
                }"
                @click="updateSortDirection"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import ChipItem from '@src/components/ChipItem.vue'
import { useCards } from '@src/stores/cardsStore'
import { storeToRefs } from 'pinia'
import ArrowUpIcon from '@src/assets/icons/ArrowUpIcon.vue'

const { format, sortBy, sortDirection } = storeToRefs(useCards())

const updateFormat = (newFormat: typeof format.value) => {
    format.value = newFormat
}

const updateSortBy = (newSort: typeof sortBy.value) => {
    sortBy.value = newSort
}

const updateSortDirection = () => {
    // flip the sort direction, 1 to -1 and vice versa
    sortDirection.value = sortDirection.value * -1
}
</script>
