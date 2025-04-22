<script setup>
window.electronAPI.onTest((value) => {
    window.electronAPI.testValue(value);
})
</script>

<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
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