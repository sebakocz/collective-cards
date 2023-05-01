import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CardAffinity, CardType } from '@src/libs/api/collectiveDto'
import { deepCopy } from '@src/libs/misc'

export const useFilter = defineStore('filterStore', () => {
    const searchQuery = ref('')

    const cardFilters = ref({
        ability: undefined as string | undefined,
        affinity: createEnumFilter(CardAffinity),
        artist: undefined as string | undefined,
        atk: undefined as number | undefined,
        cost: undefined as number | undefined,
        creator: undefined as string | undefined,
        exclusive: true,
        hp: undefined as number | undefined,
        name: undefined as string | undefined,
        rarity: deepCopy(startingRarity),
        realm: undefined as string | undefined,
        tribe: undefined as string | undefined,
        type: createEnumFilter(CardType),
    })

    const resetFilters = () => {
        cardFilters.value = {
            ability: undefined,
            affinity: createEnumFilter(CardAffinity),
            artist: undefined,
            atk: undefined,
            cost: undefined,
            creator: undefined,
            exclusive: true,
            hp: undefined,
            name: undefined,
            rarity: deepCopy(startingRarity),
            realm: undefined,
            tribe: undefined,
            type: createEnumFilter(CardType),
        }
    }

    return {
        searchQuery,
        cardFilters,
        resetFilters,
    }
})

function createEnumFilter(enumType: Record<string, string>) {
    const filter: Record<string, boolean> = {}
    for (const key in enumType) {
        filter[key] = true
    }
    return filter
}

const startingRarity = {
    Common: true,
    Uncommon: true,
    Rare: true,
    Legendary: true,
    Undraftable: false,
}
