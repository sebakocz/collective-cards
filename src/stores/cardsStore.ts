import { defineStore, storeToRefs } from 'pinia'
import { Card } from '@src/libs/api/collectiveDto'
import { computed, ref } from 'vue'
import { useFilter } from '@src/stores/filterStore'

export const useCards = defineStore('cardsStore', () => {
    const allCards = ref<Card[]>([])

    const format = ref<'standard' | 'legacy'>('standard')

    const formatCards = computed(() => {
        switch (format.value) {
            case 'standard':
                return allCards.value.filter((card) => card.state === 0)
            default:
                return allCards.value
        }
    })

    const sortBy = ref<keyof Card>('cost')
    const sortDirection = ref(1)

    const sortedCards = computed(() => {
        const cards = [...filteredCards.value]

        cards.sort((a, b) => {
            const aVal = a[sortBy.value]
            const bVal = b[sortBy.value]

            if (aVal === bVal) return 0
            if (aVal === undefined) return 1
            if (bVal === undefined) return -1

            if (aVal > bVal) return sortDirection.value
            if (aVal < bVal) return -sortDirection.value
            return 0
        })

        return cards
    })

    const filteredCards = computed(() => {
        const { searchQuery, cardFilters } = storeToRefs(useFilter())

        const searchQueryValue = searchQuery.value.toLowerCase()
        const result = []

        for (let i = 0; i < formatCards.value.length; i++) {
            const cardName = formatCards.value[i].name.toLowerCase()
            const cardAbility = formatCards.value[i].ability?.toLowerCase()
            const cardTribe = formatCards.value[i].tribe?.toLowerCase()

            // Search Bar
            if (
                !cardName.includes(searchQueryValue) &&
                !cardAbility?.includes(searchQueryValue) &&
                !cardTribe?.includes(searchQueryValue)
            ) {
                continue
            }

            // Filter Ability
            if (
                cardFilters.value.ability &&
                (cardAbility === undefined ||
                    !cardAbility.includes(cardFilters.value.ability))
            ) {
                continue
            }

            // Filter Affinity
            if (
                cardFilters.value.affinity &&
                !cardFilters.value.affinity[formatCards.value[i].affinity]
            ) {
                continue
            }

            // Filter Artist
            const cardArtist = formatCards.value[i].artist?.toLowerCase()
            if (
                cardFilters.value.artist &&
                (cardArtist === undefined ||
                    !cardArtist.includes(cardFilters.value.artist))
            ) {
                continue
            }

            // Filter Atk
            const cardAtk = formatCards.value[i].atk
            if (cardFilters.value.atk && cardAtk !== cardFilters.value.atk) {
                continue
            }

            // Filter Cost
            const cardCost = formatCards.value[i].cost
            if (cardFilters.value.cost && cardCost !== cardFilters.value.cost) {
                continue
            }

            // Filter Creator
            const cardCreator = formatCards.value[i].creator?.toLowerCase()
            if (
                cardFilters.value.creator &&
                (cardCreator === undefined ||
                    !cardCreator.includes(cardFilters.value.creator))
            ) {
                continue
            }

            // Filter Exclusive
            // unlike other filters, this one is inverted
            // when star is unchecked, we don't want to show exclusive cards
            // when star is checked, we want to show exclusive cards in addition to non-exclusive cards
            if (!cardFilters.value.exclusive) {
                if (formatCards.value[i].exclusive) continue
            }

            // Filter Hp
            const cardHp = formatCards.value[i].hp
            if (cardFilters.value.hp && cardHp !== cardFilters.value.hp) {
                continue
            }

            // Filter Name
            if (
                cardFilters.value.name &&
                !cardName.includes(cardFilters.value.name)
            ) {
                continue
            }

            // Filter Rarity
            if (
                cardFilters.value.rarity &&
                !cardFilters.value.rarity[formatCards.value[i].rarity]
            ) {
                continue
            }

            // Filter Realm
            const cardRealm = formatCards.value[i].realm?.toLowerCase()
            if (
                cardFilters.value.realm &&
                (cardRealm === undefined ||
                    !cardRealm.includes(cardFilters.value.realm))
            ) {
                continue
            }

            // Filter Tribe
            if (
                cardFilters.value.tribe &&
                (cardTribe === undefined ||
                    !cardTribe.includes(cardFilters.value.tribe))
            ) {
                continue
            }

            // Filter Type
            if (
                cardFilters.value.type &&
                !cardFilters.value.type[formatCards.value[i].type]
            ) {
                continue
            }

            // if all filters pass, add to result
            result.push(formatCards.value[i])
        }

        return result
    })

    return {
        allCards,
        filteredCards,
        sortedCards,
        formatCards,
        format,
        sortBy,
        sortDirection,
    }
})
