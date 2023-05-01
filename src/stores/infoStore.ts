import { defineStore } from 'pinia'
import { Card } from '@src/libs/api/collectiveDto'
import { deepCopy } from '@src/libs/misc'

export const useInfo = defineStore({
    id: 'infoStore',
    state: () => ({
        selectedRune: null as Card | null,
        isDeck: false,
        deckId: undefined as string | undefined,
    }),
    actions: {
        selectRune(rune: Card, isDeck = false, deckId?: string) {
            this.deckId = deckId
            this.isDeck = isDeck
            if (isDeck) {
                this.selectedRune = rune
                return
            }

            this.selectedRune = deepCopy(rune) as Card
        },
        clearSelectedRune() {
            this.selectedRune = null
        },
    },
})
