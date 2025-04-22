<script setup>
window.electronAPI.onTest((value) => {
    window.electronAPI.testValue(value);
})
</script>

<template>
    <h1>💖 Hello World!</h1>
    <p>Aplicação desktop feita com Electron.</p>
</template>

<style scoped>
    body{
        background-color: black;
    }
</style>