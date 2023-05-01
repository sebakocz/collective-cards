<template>
    <RuneSearchBar />
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
            <div class="absolute top-4 right-4">
                <img
                    src="/builder/greymanacircle.png"
                    alt="Affinity Symbol"
                    class="h-[50px] w-[50px]"
                />

                <input
                    v-model.number="cardFilters.cost"
                    class="card-cost-ring filter-input card-display-text-stats absolute -top-1 -left-1 h-[58px] w-[58px] text-center"
                    placeholder="-"
                />

                <div class="flex flex-col items-center justify-center">
                    <img
                        v-for="affinity in affinities"
                        :key="affinity"
                        :src="`/builder/${affinity.image}.png`"
                        alt="Affinity Symbol"
                        class="filter-input h-[35px] w-[35px]"
                        :class="{
                            'opacity-50': !cardFilters.affinity[affinity.key],
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
                            'opacity-50': !cardFilters.exclusive,
                        }"
                        @click="cardFilters.exclusive = !cardFilters.exclusive"
                    />
                </div>
            </div>

            <!-- Name -->
            <DebouncedControl
                v-model="cardFilters.name"
                class="filter-input background-none card-display-text-name absolute top-[220px] left-[60px] h-[25px] w-[200px] text-center"
                placeholder="(Name)"
            />

            <!-- Tribes -->
            <DebouncedControl
                v-model="cardFilters.tribe"
                class="filter-input background-none card-display-text-normal absolute top-[245px] left-[55px] h-[20px] w-[120px] text-center"
                placeholder="(Tribes)"
            />

            <!-- Realm -->
            <DebouncedControl
                v-model="cardFilters.realm"
                class="filter-input background-none card-display-text-normal absolute top-[245px] left-[180px] h-[20px] w-[80px] text-center"
                placeholder="(Realm)"
            />

            <!-- Ability -->
            <DebouncedControl
                v-model="cardFilters.ability"
                type="textarea"
                class="filter-input background-none card-display-text-ability absolute top-[290px] left-[65px] h-[110px] w-[190px] text-center"
                placeholder="(Ability Text)"
            />

            <!-- Attack -->
            <input
                v-model.number="cardFilters.atk"
                class="filter-input background-none card-display-text-stats absolute bottom-[28px] left-[28px] h-[47px] w-[47px] text-center"
                placeholder="-"
            />

            <!-- Health -->
            <input
                v-model.number="cardFilters.hp"
                class="filter-input background-none card-display-text-stats absolute bottom-[28px] right-[31px] h-[47px] w-[47px] text-center"
                placeholder="-"
            />

            <!-- Creator -->
            <DebouncedControl
                v-model="cardFilters.creator"
                class="filter-input background-none card-display-text-normal absolute bottom-[47px] left-[100px] h-[15px] w-[130px] text-center"
                placeholder="(Creator)"
            />

            <!-- Artist -->
            <DebouncedControl
                v-model="cardFilters.artist"
                class="filter-input background-none card-display-text-normal absolute bottom-[33px] left-[100px] h-[15px] w-[130px] text-center"
                placeholder="(Artist)"
            />

            <!-- Rarity -->
            <div
                class="absolute top-[265px] left-[88px] flex h-[25px] w-full gap-1"
            >
                <img
                    v-for="rarity in rarities"
                    :key="rarity"
                    :src="`/builder/${rarity.image}.png`"
                    alt="Rarity Symbol"
                    class="filter-input h-[25px] w-[25px]"
                    :class="{
                        'opacity-50': !cardFilters.rarity[rarity.key],
                    }"
                    @click="toggleFilter(rarity.key, 'rarity')"
                    @contextmenu.prevent="
                        toggleFilterExclusive(rarity.key, 'rarity')
                    "
                />
            </div>
        </div>

        <ActionUnitPicker class="mx-auto mb-5" />
    </div>
    <button
        class="focus:ring-orange-400 sticky bottom-0 w-[99%] rounded bg-blue-600 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2"
        @click="resetFilters"
    >
        Reset Filters
    </button>
</template>

<script setup lang="ts">
import RuneSearchBar from '@src/components/CardSearchBar.vue'
import DebouncedControl from '@src/components/DebouncedControl.vue'
import { useFilter } from '@src/stores/filterStore'
import ActionUnitPicker from '@src/components/ActionUnitPicker.vue'
import { storeToRefs } from 'pinia'

const affinities = [
    { key: 'Strength', image: 'redmanacircle' },
    { key: 'Mind', image: 'bluemanacircle' },
    { key: 'Spirit', image: 'greenmanacircle' },
    { key: 'Neutral', image: 'greymanacircle' },
]

const rarities = [
    {
        key: 'Undraftable',
        image: 'undraftable',
    },
    {
        key: 'Common',
        image: 'common',
    },
    {
        key: 'Uncommon',
        image: 'uncommon',
    },
    {
        key: 'Rare',
        image: 'rare',
    },
    {
        key: 'Legendary',
        image: 'legendary',
    },
]

const { cardFilters } = storeToRefs(useFilter())
const { resetFilters } = useFilter()

const toggleFilter = (key: string, group: 'rarity' | 'affinity' | 'type') => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cardFilters.value[group][key] = !cardFilters.value[group][key]
}

const toggleFilterExclusive = (
    key: string,
    group: 'rarity' | 'affinity' | 'type'
) => {
    for (const [entryFilter] of Object.entries(cardFilters.value[group])) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cardFilters.value[group][entryFilter] = entryFilter === key
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
