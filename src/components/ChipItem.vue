<template>
    <div
        class="m-1 flex h-8 w-20 select-none items-center justify-center rounded-full bg-primary-200 shadow transition-colors dark:bg-primary-600 sm:w-24"
        :class="{
            'outline outline-primary-500': isActive,
            'cursor-pointer hover:bg-primary-300 dark:hover:bg-primary-700':
                !isActive,
        }"
        @click="handleClick"
    >
        <span class="text-sm font-semibold">
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
