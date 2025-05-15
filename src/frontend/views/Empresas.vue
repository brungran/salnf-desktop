<script setup>
    import { ref, onMounted } from 'vue'
    let id = ref('')
    let nome = ref('')
    let vencimento = ref('')
    let acesso = ref('')
    let observ = ref('')
    let empresas = ref([])

    function fillFields(data){
      id.value = data.id
      nome.value = data.nome
      vencimento.value = data.vencimento
      acesso.value = data.acesso
      observ.value = data.observ
    }

    function cleanEmptyFields(obj) {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      )
    }

    function clearSearch(){
      empresas.value = empresas.clearedSearch
      delete empresas.clearedSearch
      nome = ""
      vencimento = ""
      acesso = ""
      observ = ""
    }
    
    onMounted(async () => {
      empresas.value = await window.db.empresas.all
    })

    async function insert(data){
      const result = await window.db.empresas.insert(data)
      if(result){
        data.id = result.lastInsertRowid;
        empresas.value.push(data)
      }
    }
    async function search(data, where){
      const result = await window.db.empresas.select(data, cleanEmptyFields(where))
      if(result){
        // empresas.clearedSearch = empresas.value
        empresas.value = result
      }
    }
    async function update(data, where){
      const result = await window.db.empresas.update(cleanEmptyFields(data), where)
      if(result){
        data.id = where.id
        const index = empresas.value.findIndex(e => e.id === data.id)
        empresas.value.splice(index, 1, data)
      }
    }
    async function remove(where){
      const result = await window.db.empresas.remove(where)
      //{changes, lastInsertRowid}
      if(result){
        empresas.value = empresas.value.filter(e => e.id !== where.id)
      }
    }
</script>

<template>
    <input type="hidden" id="id" v-model="id">
    <label for="nome">Nome</label>
    <input type="text" id="nome" v-model="nome"> <br> <!-- @keyup.enter="insert" -->
    <label for="nome">Vencimento </label>
    <input type="text" id="vencimento" v-model="vencimento"> <br> <!-- @keyup.enter="insert" -->
    <label for="nome">Acesso </label>
    <input type="text" id="acesso" v-model="acesso"> <br> <!-- @keyup.enter="insert" -->
    <label for="nome">Observações </label>
    <input type="text" id="observ" v-model="observ"> <br> <!-- @keyup.enter="insert" -->
    <br>
    <button @click="insert({
      'nome': nome,
      'vencimento': vencimento,
      'acesso': acesso,
      'observações': observ
    })">
    Adicionar 
    </button>
    <button @click="update({
      'nome': nome,
      'vencimento': vencimento,
      'acesso': acesso,
      'observações': observ
    },
    {
      'id': id
    })">
    Atualizar 
    </button>
    <button @click="search([
      'id',
      'nome',
      'vencimento',
      'acesso',
      'observações'
    ],
    {
      'nome': `%${nome}%`,
      'vencimento': vencimento,
      'acesso': acesso,
      'observações': observ
    })">
    Pesquisar 
    </button>
    <!-- <button @click="clearSearch">Limpar Pesquisa</button> -->

    <div>
    <h1>Empresas</h1>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Vencimento</th>
          <th>Acesso</th>
          <th>Observações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empresa in empresas" :key="empresa.id">
          <td>{{ empresa.id }}</td>
          <td>{{ empresa.nome }}</td>
          <td>{{ empresa.vencimento }}</td>
          <td>{{ empresa.acesso }}</td>
          <td>{{ empresa.observações }}</td>
          <td><button @click="remove({id: empresa.id})">Delete</button></td>
          <td><button @click="fillFields(empresa)">Editar</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>