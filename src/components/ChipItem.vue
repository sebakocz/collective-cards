<template>
    <div
        class="m-1 flex h-8 w-24 items-center justify-center rounded-full bg-main-300 dark:bg-main-700"
        :class="{
            'bg-main-400 dark:bg-main-600': isActive,
            'cursor-pointer hover:bg-main-400 dark:hover:bg-main-600':
                !isActive,
        }"
        @click="handleClick"
    >
        <span class="text-sm font-semibold text-main-700 dark:text-main-500">
            {{ label }}
        </span>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    label: string
    value: unknown
    isActive?: boolean
}>()

const emit = defineEmits(['click'])

const handleClick = () => {
    emit('click', props.value)
}
</script>
