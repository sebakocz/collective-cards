<template>
    <component
        :is="controlType"
        :type="type"
        :value="modelValue"
        @input="handleInput"
        @change="handleChange"
    />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash'

const props = defineProps({
    modelValue: { type: String, default: '' },
    type: { type: String, default: 'text' },
    debounceTime: { type: Number, default: 300 },
})

const emit = defineEmits(['update:modelValue', 'change'])

const controlType = ref('input')
if (props.type === 'textarea') {
    controlType.value = 'textarea'
}

const internalValue = ref(props.modelValue)

watch(
    () => props.modelValue,
    (newValue) => {
        internalValue.value = newValue
    }
)

const handleInputDebounced = debounce((value) => {
    emit('update:modelValue', value)
}, props.debounceTime)

const handleInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement
    internalValue.value = target.value
    handleInputDebounced(target.value)
}

const handleChange = (event: InputEvent) => {
    const target = event.target as HTMLInputElement
    emit('change', target.value)
}
</script>
