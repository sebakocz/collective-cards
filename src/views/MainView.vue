<template>
    <div class="flex h-16 w-full gap-2">
        <div
            v-for="route in navRoutes"
            :key="route.name"
            class="flex w-full items-center justify-center rounded-t bg-secondary-200 p-3 text-xl dark:bg-secondary-900 sm:duration-200"
            :class="{
                'mt-auto h-14 cursor-pointer bg-secondary-100 hover:h-16 hover:bg-secondary-300 dark:hover:bg-secondary-800':
                    currentRouteIndex !== navRoutes.indexOf(route),
                'h-16': currentRouteIndex === navRoutes.indexOf(route),
            }"
            @click="currentRouteIndex = navRoutes.indexOf(route)"
        >
            {{
                route.name === 'Cards' &&
                !isMobile &&
                cardsStore.allCards.length
                    ? `Cards (${cardsStore.filteredCards.length}/${cardsStore.formatCards.length})`
                    : route.name
            }}
            <transition name="fade">
                <div
                    v-if="route.name === 'Deck' && deckStore.deckCount"
                    class="text-shadow ml-1 rounded-full bg-primary-600 px-1.5 py-0.5 text-xs font-semibold text-white shadow duration-200"
                >
                    {{ deckStore.deckCount }}
                </div>
            </transition>
        </div>
    </div>
    <div
        class="flex-grow overflow-hidden bg-secondary-200 dark:bg-secondary-900"
    >
        <CardsView v-if="currentRouteIndex === 0" />
        <FilterView v-else-if="currentRouteIndex === 1" />
        <DeckView v-else-if="currentRouteIndex === 2" />
    </div>
</template>

<script setup lang="ts">
import { useCollectiveApi } from '@src/libs/api/collectiveApi'
import { onMounted, ref } from 'vue'
import { navRoutes } from '@src/constants/nav'
import { useCards } from '@src/stores/cardsStore'
import { useMobileCheck } from '@src/composables/mobileCheck'
import CardsView from '@src/views/CardsView.vue'
import FilterView from '@src/views/FilterView.vue'
import DeckView from '@src/views/DeckView.vue'
import { useDeck } from '@src/stores/deckStore'
const collectiveApi = useCollectiveApi()
const cardsStore = useCards()
const { isMobile } = useMobileCheck()
const currentRouteIndex = ref(0)

const deckStore = useDeck()

onMounted(async () => {
    await collectiveApi.loadCards()
})
</script>

<style scoped></style>
