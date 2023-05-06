<template>
    <div class="flex h-16 w-full gap-2">
        <div
            v-for="route in navRoutes"
            :key="route.name"
            class="flex w-full items-center justify-center rounded-t bg-main-200 p-3 text-xl dark:bg-main-800 sm:duration-200"
            :class="{
                'bg-main-50 mt-auto h-14 cursor-pointer hover:h-16 hover:bg-main-300 dark:hover:bg-main-700':
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
        </div>
    </div>
    <div class="flex-grow overflow-hidden bg-main-200 dark:bg-main-800">
        <CardsView v-if="currentRouteIndex === 0" />
        <FilterView v-else-if="currentRouteIndex === 1" />
        <!--        <DeckView v-else-if="currentRouteIndex === 2" />-->
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
const collectiveApi = useCollectiveApi()
const cardsStore = useCards()
const { isMobile } = useMobileCheck()
const currentRouteIndex = ref(0)

onMounted(async () => {
    await collectiveApi.loadCards()
})
</script>

<style scoped></style>
