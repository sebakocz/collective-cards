<template>
    <div
        class="relative mx-auto flex flex-wrap gap-3 bg-secondary-200 p-3 dark:bg-secondary-900"
    >
        <CardSearchBar />
        <CardsViewOptions />
    </div>
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
                v-if="
                    !visibleList.length &&
                    allCards.length &&
                    format !== 'custom'
                "
                class="mt-20 text-xl"
            >
                No cards found. :( <br />
                Try changing your filters.
            </p>
            <CustomCardsInput
                v-if="format === 'custom' && !formatCards.length"
                class="my-10"
            />
            <CardDisplay
                v-for="card in visibleList as Card[]"
                :key="card.id"
                :card="card"
                class="cursor-pointer duration-200 hover:scale-105"
                @click="deckStore.addCard(card)"
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
import CustomCardsInput from '@src/components/CustomCardsInput.vue'
import { useDeck } from '@src/stores/deckStore'

const { allCards, sortedCards, format, formatCards } = storeToRefs(useCards())
const deckStore = useDeck()

const {
    scrollContainer,
    viewContainer,
    onScroll,
    containerStyle,
    visibleList,
} = useVirtualScroll(sortedCards)
</script>
