<template>
    <div class="h-[90%]">
        <!-- Card Input Window -->
        <div class="relative mx-auto h-[476px] w-[320px] text-white">
            <!-- Background -->
            <img
                src="/builder/cardbackground-unit-small.png"
                alt="Card
            Background"
                class="h-[476px] w-[320px]"
            />

            <!-- Cost / Affinity / Exclusivity -->
            <div class="absolute right-4 top-4">
                <img
                    src="/builder/greymanacircle.png"
                    alt="Affinity Symbol"
                    class="h-[50px] w-[50px]"
                />

                <input
                    v-model.number="filterStore.cardFilters.cost"
                    class="card-cost-ring filter-input card-display-text-stats absolute -left-1 -top-1 h-[58px] w-[58px] text-center"
                    placeholder="-"
                />

                <div class="flex flex-col items-center justify-center">
                    <img
                        v-for="affinity in affinities"
                        :key="affinity"
                        :src="affinity.image"
                        alt="Affinity Symbol"
                        class="filter-input h-[35px] w-[35px]"
                        :class="{
                            'opacity-50':
                                !filterStore.cardFilters.affinity[affinity.key],
                        }"
                        @click="toggleFilter(affinity.key, 'affinity')"
                        @contextmenu.prevent="
                            toggleFilterExclusive(affinity.key, 'affinity')
                        "
                    />
                    <img
                        src="/builder/exclusive-star.png"
                        alt="Exclusive Star"
                        class="filter-input h-[35px] w-[35px]"
                        :class="{
                            'opacity-50': !filterStore.cardFilters.exclusive,
                        }"
                        @click="
                            filterStore.cardFilters.exclusive =
                                !filterStore.cardFilters.exclusive
                        "
                    />
                </div>
            </div>

            <!-- Name -->
            <DebouncedControl
                v-model="filterStore.cardFilters.name"
                class="filter-input background-none card-display-text-name absolute left-[60px] top-[220px] h-[25px] w-[200px] text-center"
                placeholder="(Name)"
            />

            <!-- Tribes -->
            <DebouncedControl
                v-model="filterStore.cardFilters.tribe"
                class="filter-input background-none card-display-text-normal absolute left-[55px] top-[245px] h-[20px] w-[120px] text-center"
                placeholder="(Tribes)"
            />

            <!-- Realm -->
            <DebouncedControl
                v-model="filterStore.cardFilters.realm"
                class="filter-input background-none card-display-text-normal absolute left-[180px] top-[245px] h-[20px] w-[80px] text-center"
                placeholder="(Realm)"
            />

            <!-- Ability -->
            <DebouncedControl
                v-model="filterStore.cardFilters.ability"
                type="textarea"
                class="filter-input background-none card-display-text-ability absolute left-[65px] top-[290px] h-[110px] w-[190px] text-center"
                placeholder="(Ability Text)"
            />

            <!-- Attack -->
            <input
                v-model.number="filterStore.cardFilters.atk"
                class="filter-input background-none card-display-text-stats absolute bottom-[28px] left-[28px] h-[47px] w-[47px] text-center"
                placeholder="-"
            />

            <!-- Health -->
            <input
                v-model.number="filterStore.cardFilters.hp"
                class="filter-input background-none card-display-text-stats absolute bottom-[28px] right-[31px] h-[47px] w-[47px] text-center"
                placeholder="-"
            />

            <!-- Creator -->
            <DebouncedControl
                v-model="filterStore.cardFilters.creator"
                class="filter-input background-none card-display-text-normal absolute bottom-[47px] left-[100px] h-[15px] w-[130px] text-center"
                placeholder="(Creator)"
            />

            <!-- Artist -->
            <DebouncedControl
                v-model="filterStore.cardFilters.artist"
                class="filter-input background-none card-display-text-normal absolute bottom-[33px] left-[100px] h-[15px] w-[130px] text-center"
                placeholder="(Artist)"
            />

            <!-- Rarity -->
            <div
                class="absolute left-[88px] top-[265px] flex h-[25px] w-full gap-1"
            >
                <img
                    v-for="rarity in rarities"
                    :key="rarity"
                    :src="rarity.image"
                    alt="Rarity Symbol"
                    class="filter-input h-[25px] w-[25px]"
                    :class="{
                        'opacity-50':
                            !filterStore.cardFilters.rarity[rarity.key],
                    }"
                    @click="toggleFilter(rarity.key, 'rarity')"
                    @contextmenu.prevent="
                        toggleFilterExclusive(rarity.key, 'rarity')
                    "
                />
            </div>
        </div>

        <ActionUnitPicker class="mx-auto mb-5" />

        <ButtonItem
            class="mx-auto h-10 w-10 bg-alert-400 p-2 hover:bg-alert-500"
            @click="filterStore.resetFilters"
        >
            <TrashIcon />
        </ButtonItem>
    </div>
</template>

<script setup lang="ts">
import DebouncedControl from '@src/components/DebouncedControl.vue'
import { useFilter } from '@src/stores/filterStore'
import ActionUnitPicker from '@src/components/ActionUnitPicker.vue'
import RarityCommon from '../../public/builder/common.png'
import RarityUncommon from '../../public/builder/uncommon.png'
import RarityRare from '../../public/builder/rare.png'
import RarityLegendary from '../../public/builder/legendary.png'
import RarityUndraftable from '../../public/builder/undraftable.png'
import AffinityStrength from '../../public/builder/redmanacircle.png'
import AffinityMind from '../../public/builder/bluemanacircle.png'
import AffinitySpirit from '../../public/builder/greenmanacircle.png'
import AffinityNeutral from '../../public/builder/greymanacircle.png'
import ButtonItem from '@src/components/ButtonItem.vue'
import TrashIcon from '@src/assets/icons/TrashIcon.vue'

const affinities = [
    { key: 'Strength', image: AffinityStrength },
    { key: 'Mind', image: AffinityMind },
    { key: 'Spirit', image: AffinitySpirit },
    { key: 'Neutral', image: AffinityNeutral },
]

const rarities = [
    {
        key: 'Undraftable',
        image: RarityUndraftable,
    },
    {
        key: 'Common',
        image: RarityCommon,
    },
    {
        key: 'Uncommon',
        image: RarityUncommon,
    },
    {
        key: 'Rare',
        image: RarityRare,
    },
    {
        key: 'Legendary',
        image: RarityLegendary,
    },
]

const filterStore = useFilter()

const toggleFilter = (key: string, group: 'rarity' | 'affinity' | 'type') => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    filterStore.cardFilters[group][key] = !filterStore.cardFilters[group][key]
}

const toggleFilterExclusive = (
    key: string,
    group: 'rarity' | 'affinity' | 'type'
) => {
    for (const [entryFilter] of Object.entries(
        filterStore.cardFilters[group]
    )) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterStore.cardFilters[group][entryFilter] = entryFilter === key
    }
}
</script>

<style scoped>
.filter-input:hover {
    box-shadow: 0 0 10px lightblue;
}

.card-cost-ring {
    background: url('/builder/tickring.png');
    background-size: cover;
    background-position: center center;
}

.card-display-text-stats {
    font-family: 'Acme', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 34px;
    line-height: 47px;
    display: flex;
    align-items: center;
    justify-content: center;

    -webkit-text-stroke: 0.5px black;
    -webkit-font-smoothing: antialiased;
}

.background-none {
    background: none;
}
</style>
