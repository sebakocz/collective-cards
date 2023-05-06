<template>
    <div class="w-52 p-2 text-white">
        <div class="relative mx-auto h-card-sm w-card-sm">
            <!-- Art -->
            <img
                :src="card.image"
                alt="Card Art"
                class="absolute top-[28.5%] left-1/2 -z-10 h-[120px] w-[150px] -translate-x-1/2 -translate-y-1/2 transform"
            />

            <!-- Background Unit/Action -->
            <img
                class="absolute top-0 left-0"
                :src="backgroundImg"
                alt="Background Frame"
            />

            <!-- Mana Cost + Affinity + Exclusivity -->
            <div class="absolute top-3.5 right-3.5 h-[37px] w-[37px]">
                <img :src="affinitySymbol" alt="Affinity Symbol" />
                <div class="absolute -top-1 -left-1 h-[45px] w-[45px]">
                    <img
                        src="/builder/tickring.png"
                        alt="Mana Cost"
                        class="absolute"
                    />
                    <span class="card-display-text-stats">
                        {{ card.cost }}
                    </span>
                </div>
                <img
                    v-if="card.exclusive"
                    src="/builder/exclusive-star.png"
                    class="absolute right-0.5 top-8 h-[25px] w-[25px]"
                    alt="Exclusive Star"
                />
            </div>

            <!-- Attack -->
            <span
                v-if="card.type === CardType.Unit"
                class="card-display-text-stats absolute bottom-2.5 left-[14%] w-2"
            >
                {{ card.atk }}
            </span>

            <!-- Health -->
            <span
                v-if="card.type === CardType.Unit"
                class="card-display-text-stats absolute bottom-2.5 right-[15%] w-2"
            >
                {{ card.hp }}
            </span>

            <!-- Ability -->
            <div
                class="card-display-text-ability absolute top-[60%] w-full"
                :style="{
                    'font-size': `${abilityFontSize}px`,
                }"
            >
                <div class="w-[60%] text-center">
                    {{ card.ability }}
                </div>
            </div>

            <!-- Creator -->
            <span
                v-if="card.creator"
                class="card-display-text-normal absolute bottom-[9.3%] left-[30%]"
            >
                {{ card.creator }}
            </span>

            <!-- Artist -->
            <span
                v-if="card.artist"
                class="card-display-text-normal absolute bottom-[6.4%] left-[30%]"
            >
                {{ card.artist }}
            </span>

            <!-- Name -->
            <span
                class="card-display-text-normal absolute top-[47.2%] w-[100%] text-center"
            >
                <span class="text-xs">
                    {{ card.name }}
                </span>
            </span>

            <!-- Tribe & Realm -->
            <span
                v-if="card.tribe"
                class="card-display-text-normal absolute top-[51.3%] w-[100%] text-center text-xs"
            >
                {{ card.tribe }}
                <span v-if="card.realm !== ''">
                    &nbsp;from {{ card.realm }}
                </span>
            </span>

            <!-- Rarity -->
            <img
                v-if="card.rarity !== CardRarity.Undraftable"
                :src="raritySymbol"
                class="absolute top-[55.5%] left-[46.5%] h-[15px] w-[15px]"
                alt="Rarity Symbol"
            />

            <!-- Space for buttons etc -->
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Card,
    CardAffinity,
    CardRarity,
    CardType,
} from '@src/libs/api/collectiveDto'
import { computed } from 'vue'
import RarityCommon from '../../public/builder/common.png'
import RarityUncommon from '../../public/builder/uncommon.png'
import RarityRare from '../../public/builder/rare.png'
import RarityLegendary from '../../public/builder/legendary.png'
import RarityUndraftable from '../../public/builder/undraftable.png'
import BackgroundUnit from '../../public/builder/cardbackground-unit-small.png'
import BackgroundAction from '../../public/builder/cardbackground-small.png'
import AffinityStrength from '../../public/builder/redmanacircle.png'
import AffinityMind from '../../public/builder/bluemanacircle.png'
import AffinitySpirit from '../../public/builder/greenmanacircle.png'
import AffinityNeutral from '../../public/builder/greymanacircle.png'

const props = defineProps<{
    card: Card
}>()

const backgroundImg = computed(() =>
    props.card.type === CardType.Unit ? BackgroundUnit : BackgroundAction
)

const affinitySymbol = computed(() => {
    switch (props.card.affinity) {
        case CardAffinity.Strength:
            return AffinityStrength
        case CardAffinity.Mind:
            return AffinityMind
        case CardAffinity.Spirit:
            return AffinitySpirit
        default:
            return AffinityNeutral
    }
})

const abilityFontSize = computed(() => {
    switch (props.card.rarity) {
        case CardRarity.Common:
            return 11
        case CardRarity.Uncommon:
            return 9
        case CardRarity.Rare:
            return 8
        case CardRarity.Legendary:
            return 8
        default:
            return 10
    }
})

const raritySymbol = computed(() => {
    switch (props.card.rarity) {
        case CardRarity.Common:
            return RarityCommon
        case CardRarity.Uncommon:
            return RarityUncommon
        case CardRarity.Rare:
            return RarityRare
        case CardRarity.Legendary:
            return RarityLegendary
        default:
            return RarityUndraftable
    }
})
</script>

<style scoped>
.card-display-text-stats {
    font-family: 'Acme', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;

    -webkit-text-stroke: 0.5px black;
    -webkit-font-smoothing: antialiased;
}

.card-display-text-ability {
    font-family: 'Laila', sans-serif;
    font-style: normal;
    font-weight: 400;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
}

.card-display-text-normal {
    font-family: 'Laila', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 8px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
}
</style>
