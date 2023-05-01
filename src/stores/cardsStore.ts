import { defineStore, storeToRefs } from 'pinia'
import { Card } from '@src/libs/api/collectiveDto'
import { computed, ref } from 'vue'
import { useFilter } from '@src/stores/filterStore'

export const useCards = defineStore('cardsStore', () => {
    const allCards = ref<Card[]>([])

    const filteredCards = computed(() => {
        const { searchQuery, cardFilters } = storeToRefs(useFilter())

        const searchQueryValue = searchQuery.value.toLowerCase()
        const result = []

        for (let i = 0; i < allCards.value.length; i++) {
            const cardName = allCards.value[i].name.toLowerCase()
            const cardAbility = allCards.value[i].ability?.toLowerCase()
            const cardTribe = allCards.value[i].tribe?.toLowerCase()

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
                !cardFilters.value.affinity[allCards.value[i].affinity]
            ) {
                continue
            }

            // Filter Artist
            const cardArtist = allCards.value[i].artist?.toLowerCase()
            if (
                cardFilters.value.artist &&
                (cardArtist === undefined ||
                    !cardArtist.includes(cardFilters.value.artist))
            ) {
                continue
            }

            // Filter Atk
            const cardAtk = allCards.value[i].atk
            if (cardFilters.value.atk && cardAtk !== cardFilters.value.atk) {
                continue
            }

            // Filter Cost
            const cardCost = allCards.value[i].cost
            if (cardFilters.value.cost && cardCost !== cardFilters.value.cost) {
                continue
            }

            // Filter Creator
            const cardCreator = allCards.value[i].creator?.toLowerCase()
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
                if (allCards.value[i].exclusive) continue
            }

            // Filter Hp
            const cardHp = allCards.value[i].hp
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
                !cardFilters.value.rarity[allCards.value[i].rarity]
            ) {
                continue
            }

            // Filter Realm
            const cardRealm = allCards.value[i].realm?.toLowerCase()
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
                !cardFilters.value.type[allCards.value[i].type]
            ) {
                continue
            }

            // if all filters pass, add to result
            result.push(allCards.value[i])
        }

        // sort by cost, name
        result.sort((a, b) => {
            if (a.cost !== b.cost) return a.cost - b.cost
            return a.name.localeCompare(b.name)
        })

        return result
    })

    return {
        allCards,
        filteredCards,
    }
})
