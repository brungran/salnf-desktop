<script setup>
    import { ref, onMounted } from 'vue'

    const nomeEmpresa = ref('')
    const empresas = ref([])

    async function carregarEmpresas() {
        empresas.value = await window.electronAPI.getEmpresas()
    }
    
    async function salvar() {
        if (nomeEmpresa.value.trim()) {
            window.electronAPI.salvarEmpresa(nomeEmpresa.value)
            nomeEmpresa.value = '' // limpa input
            await carregarEmpresas()
        }
    }

    onMounted(() => {
        carregarEmpresas()
    })
</script>

<template>
    <label for="nomeEmpresa">Nome da empresa </label>
    <input type="text" id="nomeEmpresa" v-model="nomeEmpresa" @keyup.enter="salvar">
    <br>
    <button @click="salvar">Adicionar</button>

    <div>
    <h1>Empresas</h1>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empresa in empresas" :key="empresa.id">
          <td>{{ empresa.id }}</td>
          <td>{{ empresa.nome }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>