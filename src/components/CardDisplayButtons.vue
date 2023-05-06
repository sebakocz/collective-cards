<template>
    <div
        class="absolute top-24 left-2 flex flex-col text-main-700 dark:text-main-400"
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
        <ButtonItem
            v-if="deckStore.getCardCount(card) > 0"
            class="pointer-events-none text-2xl"
        >
            {{ deckStore.getCardCount(card) }}
        </ButtonItem>
        <ButtonItem
            v-if="deckStore.getCardCount(card) > 0"
            class="text-2xl"
            @click="deckStore.removeCard(card)"
        >
            -
        </ButtonItem>
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
