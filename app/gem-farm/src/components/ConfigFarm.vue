<template>
  <div class="nes-container flex text-center mb-10 flex-wrap">
    <div class="nes-select is-dark text-center flex-1 mb-10 width100">
        <div v-if="!selected">
        <select required id="selectedFarm" name="selectedFarmeName" class="huVjiU choose-wallet" @change="selected=true" v-model="selectedFarmValue">
            <option :value="unknown" :selected="true">Choose Farm..</option>
            <option :value="Fw8hwJXuJR6hNQJdKW2ASrHoV4HnFyHMhmYig1hbDLn4">Greedy Pigz</option>
            <option :value="DpYmHC5ZrkQLVDoVKMkUsgpq5FNpvphirTbctzRDtk47">Greedy Hogz</option>
            <option :value="DpYmHC5ZrkQLVDoVKMkUsgpq5FNpvphirTbctzRDtk47">Mutant Zombies</option>
        </select>
        </div>
    <div v-else><span>Selected Farm: {{ selectedFarmValue.name }}</span></div>
    </div>
    
</div>
</template>


<script lang="ts">
export default {
    data(){
        return{
            selected: false,
        }
    }
    
}
</script>


<style scoped></style>
