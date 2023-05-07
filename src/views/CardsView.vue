<template>
    <CardSearchBar />
    <div
        ref="viewContainer"
        class="h-[90%] overflow-y-scroll p-2 will-change-transform"
        @scroll="onScroll"
    >
        <CardsViewOptions />
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
                v-for="card in visibleList as Card[]"
                :key="card.id"
                :card="card"
                class="duration-200 hover:scale-105"
            >
                <CardDisplayButtons :card="card" />
            </CardDisplay>
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
import CardsViewOptions from '@src/components/CardsViewOptions.vue'
import CardDisplayButtons from '@src/components/CardDisplayButtons.vue'
import { Card } from '@src/libs/api/collectiveDto'
const { allCards, sortedCards } = storeToRefs(useCards())

const {
    scrollContainer,
    viewContainer,
    onScroll,
    containerStyle,
    visibleList,
} = useVirtualScroll(sortedCards)
</script>
