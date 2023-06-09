<template>
    <div class="slider bg-primary-400 dark:bg-primary-700">
        <label
            class="option"
            :class="[selectedOption === 'unit' ? 'selected text-shadow' : '']"
            @click="handleClick('unit')"
        >
            Unit
        </label>
        <label
            class="option"
            :class="[selectedOption === 'both' ? 'selected text-shadow' : '']"
            @click="handleClick('both')"
        >
            Both
        </label>
        <label
            class="option"
            :class="[selectedOption === 'action' ? 'selected text-shadow' : '']"
            @click="handleClick('action')"
        >
            Action
        </label>
        <div
            class="slider-highlight bg-primary-500 dark:bg-primary-600"
            :style="{ left: highlightPosition }"
        ></div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFilter } from '@src/stores/filterStore'
import { CardType } from '@src/libs/api/collectiveDto'

const setOption = () => {
    const unit = filterStore.cardFilters.type[CardType.Unit]
    const action = filterStore.cardFilters.type[CardType.Action]
    if (unit && action) {
        return 'both'
    } else if (unit) {
        return 'unit'
    } else {
        return 'action'
    }
}

const filterStore = useFilter()
const selectedOption = ref(setOption())

watch(
    () => filterStore.cardFilters.type,
    () => {
        selectedOption.value = setOption()
    },
    { deep: true }
)

const handleClick = (option: string) => {
    selectedOption.value = option

    filterStore.cardFilters.type = {
        [CardType.Unit]: option === 'unit' || option === 'both',
        [CardType.Action]: option === 'action' || option === 'both',
    }
}
const highlightPosition = computed(() => {
    if (selectedOption.value === 'unit') {
        return '0%'
    } else if (selectedOption.value === 'both') {
        return '33.33%'
    } else {
        return '66.66%'
    }
})
</script>
<style>
:root {
    --slider-width: 300px;
    --slider-height: 40px;
}

.slider {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: var(--slider-width);
    height: var(--slider-height);
    border-radius: 20px;
    overflow: hidden;

    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.13));
}

.option {
    z-index: 1;
    flex-grow: 1;
    text-align: center;
    cursor: pointer;
    width: 33%;

    font-family: 'Laila', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 1.2rem;
    line-height: 33px;
}

.option.selected {
    color: whitesmoke;
}

.slider-highlight {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 33.33%;
    border-radius: 20px;
    transition: left 0.3s ease-out;
}
</style>
