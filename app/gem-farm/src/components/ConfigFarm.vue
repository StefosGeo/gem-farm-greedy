<template>
  <div class="nes-container flex text-center mb-10 flex-wrap">
    <div class="nes-select is-dark text-center flex-1 mb-10 width100">
        <div v-if="choosenFarmData==='unknown'">
        <select required id="selectedFarm" name="selectedFarmeName" class="huVjiU choose-wallet" @change="onChange($event)" v-model="selectedFarmValue">
            <option :value="unknown" :selected="true">Choose Farm..</option>
            <option :value="Fw8hwJXuJR6hNQJdKW2ASrHoV4HnFyHMhmYig1hbDLn4"><div><img src="../assets/greedyHog.png"/><p>Greedy Pigz</p></div></option>
            <option :value="DpYmHC5ZrkQLVDoVKMkUsgpq5FNpvphirTbctzRDtk47">Greedy Hogz</option>
            <option :value="DpYmHC5ZrkQLVDoVKMkUsgpq5FNpvphirTbctzRDtk47">Mutant Zombies</option>
        </select>
        </div>
        <div v-else>
            <div v-if="choosenFarmData==='Greedy Pigz'" class="selectedFarm row">
                <img src="../assets/greedyPig.png" width="40" height="40" style="align-items=center"><span><b><h2>   {{ choosenFarmData }}</h2></b></span>
            </div>
            <div v-else class="selectedFarm row"> 
                <img src="../assets/greedyHog.png" width="40" height="40"><span><b><h2>   {{ choosenFarmData }}</h2></b></span>
            </div>
        </div>
        </div>
  </div>
</template>


<script lang="ts">
import {  defineComponent } from 'vue';

export default {
  props: ['choosenFarm'],
  created() {
    // props are exposed on `this`
    console.log(this.choosenFarm)
  },
  data() {
      return {choosenFarmData: "unknown",
              imgSrc : "unknown"
            }
  },
  methods: {
      onChange(event){
          console.log(event.target.value)
          this.choosenFarmData = event.target.value
          if (this.choosenFarmData === "Greedy Hogz") {
              this.imgSrc = "../assets/greedyHog.png"
          }else {
              this.imgSrc = "../assets/greedyPig.png"
          }
          
        //   this.choosenFarm = event.target.value
      }
  }
}
</script>


<style scoped>
    .selectedFarm  { 
        align-items: center;
        display: flex;
        vertical-align: middle;
        margin-left: auto;
        margin-right: auto;
    }
</style>
