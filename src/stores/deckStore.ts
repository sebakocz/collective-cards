import { defineStore } from 'pinia'
import { Card } from '@src/libs/api/collectiveDto'
import { computed, ref, watch } from 'vue'

const MAX_CARD_COUNT = 3

export type DeckCard = {
    card: Card
    count: number
}

export const useDeck = defineStore('deckStore', () => {
    const deckCards = ref<DeckCard[]>([])
    const deckCount = computed(() =>
        deckCards.value.reduce((acc, card) => acc + card.count, 0)
    )

    const getCardCount = computed(() => (card: Card) => {
        const deckCard = deckCards.value.find(
            (deckCard) => deckCard.card.id === card.id
        )
        return deckCard?.count ?? 0
    })

    const addCard = (card: Card, count = 1) => {
        const clean_count = Math.min(Math.max(1, count), MAX_CARD_COUNT)

        const existingCard = deckCards.value.find(
            (deckCard) => deckCard.card.id === card.id
        )

        if (existingCard) {
            existingCard.count = Math.min(
                MAX_CARD_COUNT,
                existingCard.count + clean_count
            )
        } else {
            deckCards.value.push({ card, count: clean_count })
        }
    }

    const removeCard = (card: Card, count = 1) => {
        const existingCard = deckCards.value.find(
            (deckCard) => deckCard.card.id === card.id
        )
        if (existingCard) {
            existingCard.count = Math.max(0, existingCard.count - count)
        }

        deckCards.value = deckCards.value.filter(
            (deckCard) => deckCard.count > 0
        )
    }

    const clearDeck = () => {
        deckCards.value = []
    }

    // autosort deck cards
    watch(
        deckCards,
        () => {
            deckCards.value.sort((a, b) => {
                if (a.card.cost === b.card.cost) {
                    return a.card.name.localeCompare(b.card.name)
                }
                return a.card.cost - b.card.cost
            })
        },
        { deep: true }
    )

    return {
        deckCards,
        deckCount,
        getCardCount,
        addCard,
        removeCard,
        clearDeck,
    }
})
