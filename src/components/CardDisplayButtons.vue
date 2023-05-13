<template>
    <div class="absolute left-2 top-2 flex flex-col">
        <ButtonItem @click.stop="openLink(card.link)">
            <EyeIcon class="h-6 w-6" />
        </ButtonItem>
        <Transition name="fade">
            <ButtonItem
                v-if="deckStore.getCardCount(card) > 0"
                @click.stop="deckStore.removeCard(card)"
            >
                <span class="text-shadow font-bold text-white">
                    {{ deckStore.getCardCount(card) }}x
                </span>
            </ButtonItem>
        </Transition>
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
