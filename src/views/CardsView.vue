<template>
    <CardSearchBar />
    <div
        ref="viewContainer"
        class="h-[90%] overflow-y-scroll p-2 will-change-transform"
        @scroll="onScroll"
    >
        <div
            ref="scrollContainer"
            class="flex flex-wrap content-start justify-center"
            :style="containerStyle"
        >
            <LoadingSpinner v-if="!allCards.length" />
            <p
                v-if="!visibleList.length && allCards.length"
                class="mt-20 text-xl"
            >
                No cards found. :( <br />
                Try changing your filters.
            </p>
            <CardDisplay
                v-for="card in visibleList"
                :key="card.uid"
                :card="card"
                class="cursor-pointer duration-200 hover:scale-105"
                @click="openLink(card.link)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCards } from '@src/stores/cardsStore'
import { useVirtualScroll } from '@src/composables/virtualScroll'
import CardDisplay from '@src/components/CardDisplay.vue'
import CardSearchBar from '@src/components/CardSearchBar.vue'
import { storeToRefs } from 'pinia'
import LoadingSpinner from '@src/components/LoadingSpinner.vue'

const { allCards, filteredCards } = storeToRefs(useCards())

const openLink = (link: string) => {
    window.open(link, '_blank')
}

const {
    scrollContainer,
    viewContainer,
    onScroll,
    containerStyle,
    visibleList,
} = useVirtualScroll(filteredCards)
</script>
