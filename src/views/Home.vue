<script setup>
window.electronAPI.onTest((value) => {
    window.electronAPI.testValue(value);
})
</script>

<template>
    <h1>Home</h1>
    <nav>
        <RouterLink to="/home">Home</RouterLink>
        <br>
        <RouterLink to="/empresas">Empresas</RouterLink>
    </nav>
    <RouterView />
</template>

<style scoped>
    body{
        background-color: black;
    }
</style>