<template>
    <div class="h-[90%] overflow-y-scroll p-2 will-change-transform">
        <div v-if="deckStore.deckCount === 0" class="mt-20 text-xl">
            No cards in deck. :( <br />
            Try adding some cards.
        </div>
        <div class="flex flex-wrap content-start justify-center">
            <TransitionGroup name="smooth-resize">
                <CardDisplay
                    v-for="{ card } in deckStore.deckCards"
                    :key="card.id"
                    :card="card"
                    class="duration-200 hover:scale-105"
                >
                    <CardDisplayButtons :card="card" />
                </CardDisplay>
            </TransitionGroup>
        </div>
    </div>
</template>
<script setup lang="ts">
import CardDisplay from '@src/components/CardDisplay.vue'
import CardDisplayButtons from '@src/components/CardDisplayButtons.vue'
import { useDeck } from '@src/stores/deckStore'

const deckStore = useDeck()
</script>

<style lang="scss" scoped>
/* Vue Transition Component - smooth-resize */
/* added *-move and pos:absolute to prevent 'jumping' */
/* https://vuejs.org/guide/built-ins/transition-group.html#move-transitions */
.smooth-resize-move,
.smooth-resize-enter-active,
.smooth-resize-leave-active {
    transition: all 0.4s ease;
}

.smooth-resize-leave-active {
    position: absolute;
}

.smooth-resize-enter-from,
.smooth-resize-leave-to {
    opacity: 0;
    transform: scale(0.1);
}
</style>
