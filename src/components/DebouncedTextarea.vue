<template>
    <textarea v-model="inputValue" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { debounce } from 'lodash'

const props = defineProps({
    modelValue: { type: String, default: '' },
    debounceTime: { type: Number, default: 300 },
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const inputValue = computed({
    get: () => props.modelValue,
    set: debounce((value) => {
        emit('update:modelValue', value)
    }, props.debounceTime),
})
</script>
