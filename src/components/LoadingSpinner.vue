<template>
    <span class="spinner" />
</template>

<style scoped>
.spinner {
    margin: 100px auto;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top-color: #2452a1;
    animation: spin 0.8s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
