<template>
    <div
        class="absolute left-2 top-24 flex flex-col text-main-700 dark:text-main-400"
    >
        <ButtonItem @click="openLink(card.link)">
            <EyeIcon class="h-6 w-6" />
        </ButtonItem>
        <ButtonItem
            class="text-2xl"
            :class="{
                'pointer-events-none': deckStore.getCardCount(card) === 3,
            }"
            @click="deckStore.addCard(card)"
        >
            +
        </ButtonItem>
        <TransitionGroup name="slide-in">
            <ButtonItem
                v-if="deckStore.getCardCount(card) > 0"
                class="pointer-events-none text-2xl"
                :style="{ '--i': 1 }"
            >
                {{ deckStore.getCardCount(card) }}
            </ButtonItem>
            <ButtonItem
                v-if="deckStore.getCardCount(card) > 0"
                class="text-2xl"
                :style="{ '--i': 2 }"
                @click="deckStore.removeCard(card)"
            >
                -
            </ButtonItem>
        </TransitionGroup>
    </div>
</template>
<script setup lang="ts">
import EyeIcon from '@src/assets/icons/EyeIcon.vue'
import ButtonItem from '@src/components/ButtonItem.vue'
import { Card } from '@src/libs/api/collectiveDto'
import { useDeck } from '@src/stores/deckStore'

defineProps<{
    card: Card
}>()

const deckStore = useDeck()

const openLink = (link: string) => {
    window.open(link, '_blank')
}
</script>

<style scoped>
:root {
    --i: 0;
}

.slide-in-enter-active,
.slide-in-leave-active {
    transition: all 0.3s ease-in-out;
    transition-delay: calc(0.2s / var(--i));
}

.slide-in-enter-from,
.slide-in-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
</style>
