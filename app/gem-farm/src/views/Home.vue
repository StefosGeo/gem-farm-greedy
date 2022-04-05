<template>
  <div class="pt-10 px-10 flex justify-center align-middle">
      <img src="../assets/favicon.png" style="width: 25%;"/><br/>
      <!-- <img src="../assets/Greedy_white.png" style="width: 25%;"/><br/> -->
  </div>
  <!-- <ConfigFarm/> -->
  <div class="nes-container flex text-center mb-10 flex-wrap">
  <div class="nes-select is-dark text-center flex-1 mb-10 width100 justify-center">
      <div v-if="choosenFarm==='unknown'">
      <select required id="selectedFarmDropdown" name="selectedFarmeName" class="huVjiU choose-wallet" @change="onChangeFarm($event)">
          <option :value="unknown" :selected="true">Choose Farm..</option>
          <option :value="Fw8hwJXuJR6hNQJdKW2ASrHoV4HnFyHMhmYig1hbDLn4"><div><img src="../assets/greedyHog.png"/><p>Greedy Pigz</p></div></option>
          <option :value="DpYmHC5ZrkQLVDoVKMkUsgpq5FNpvphirTbctzRDtk47">Greedy Hogz</option>
          <option :value="DpYmHC5ZrkQLVDoVKMkUsgpq5FNpvphirTbctzRDtk47">Mutant Zombies</option>
      </select>
      </div>
      <div v-else>
          <div v-if="choosenFarm==='Greedy Pigz'" class="selectedFarm justify-center">
              <img src="../assets/greedyPig.png" width="50" height="50" style="vertical-align:middle">
              <span><b><h1>{{ choosenFarm }}</h1></b></span>
          </div>
          <div v-else class="selectedFarm justify-center"> 
              <img src="../assets/greedyHog.png" width="50" height="50" style="vertical-align:middle">
              <span><b><h1>{{ choosenFarm }}</h1></b></span>
          </div>
          <ConfigPane :farmerAcc="farmerAcc" />
      </div>
      </div>
  </div>
  <div v-if="!wallet" class="text-center"></div>
  <div v-else>
    <div v-if="farmerAcc">  
        <Modal 
          @close="toggleModal" 
          :modalActive="modalActive" 
          :modalBad="modalBad" 
          :modalGood="modalGood"
          :modalNeutral="modalNeutral"
          :modalShowClose="modalShowClosebutton">
        <div class="modal-content">
          <div class="modal-header">
           <h1>{{ModalHeader}}</h1>
          </div>
          <div class="modal-spinner">
            <svg v-show="modalShowWheel" class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle v-show="modalShowWheel" class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
          </div>
          <div class="modal-text">
            <p>{{ModalMessage}}</p>
          </div>
        </div>
      </Modal>   
      <Vault
        :key="farmerAcc"
        class="mb-10"
        :vault="farmerAcc.vault.toBase58()"
        :farmerAcc="farmerAcc"
        @selected-wallet-nft="handleNewSelectedNFT"
        @selected-vault-nft="handleNewSelectedVaultNFT"
        ref= 'VaultRef'
      >
        <div class="left-buttons">
        <!-- <button
          v-if="farmerState === 'staked' && selectedNFTs.length > 0"
          class="nes-btn huVjiU is-primary uxbuttonleft"
          @click="addGems"
        >
          Add NFTs (resets lock timer)
        </button> -->
        <button
          v-if="farmerState === 'unstaked' && !widthdrawNFTs"
          class="enabled-button nes-btn huVjiU is-success uxbuttonleft"
          @click="beginStaking"
        >
          Start Staking
        </button>
        <button
          v-if="farmerState === 'unstaked'  && widthdrawNFTs" 
          class="enabled-button nes-btn huVjiU is-success uxbuttonleft"
          @click="beginStaking"
        >
          Withdraw NFTs
        </button>
        
        <button
          v-if="farmerState === 'staked'"
          class="enabled-button nes-btn huVjiU is-error uxbuttonleft"
          @click="endStaking(true)"
        >
          Stop Staking
        </button>
        <button
          v-if="farmerState === 'pendingCooldown'"
          class="enabled-button nes-btn huVjiU is-error uxbuttonleft"
          @click="endStaking(true)"
        >
          Stop Staking
        </button>
        <div class=""  style="position: relative;fontSize:x-small">
          <p class="mr-10">*Stop Staking to Add more NFT's</p> 
          </div>
        </div>
        <div class="right-buttons">
        <button
          v-if="availableB > -2"
          class="enabled-button nes-btn huVjiU uxbuttonright"
          @click="claim"
        >
        Claim {{ availableB  }} $GRDY
        </button>        
        <!-- <button
          v-if="availableA == 0"
          class="disabled-button nes-btn huVjiU uxbuttonright"
        >
          Withdraw {{ availableB   }} $GRDY
        </button> -->
        </div>
        
        <div class="width100 flex justify-center huVjiU pt-5">          
          <div v-if="fixedRate > 0" class="accrued-reward uxbuttonleft left-buttons" > Vault Deposited Rewards: {{(accruedReward - paidOutReward) / 1000000000}} $GRDY</div>
          <!-- <div v-if="paidOutReward" class="total-earned-reward" > paidOutReward: {{paidOutReward}}</div> -->
          <div v-if="fixedRate > 0" class="currently-earning uxbuttonright right-buttons" > Currently generating: {{fixedRate / 1000000000}} $GRDY per Week</div>
        </div>
        <div class="width100 flex justify-center huVjiU pt-5">          
          <div v-if="fixedRate > 0" class="accrued-reward uxbuttonleft left-buttons" > Estimated Pending Rewards: {{estFixedRate}} $GRDY</div>
          <!-- <div v-if="paidOutReward" class="total-earned-reward" > paidOutReward: {{paidOutReward}}</div> -->
          <div v-if="fixedRate > 0" class="currently-earning uxbuttonright right-buttons" > Staking Status: {{farmerState}}</div>
        </div>
        
<!--         <button class="nes-btn huVjiU mr-5" @click="handleRefreshFarmer">
          Force Refresh Vault
        </button> -->
        <!-- <div v-if="!!accruedReward" class="w-full text-center mb-5">
          Accrued $DAB: {{accruedReward}} Paid out $DAB: {{paidOutReward}}
        </div> -->
      </Vault>
    </div>
    <div v-else>
      <div class="w-full text-center mb-5">
        Staking account not found. Click here to create a new one.
      </div>
      <div class="w-full text-center">
        <button class="nes-btn huVjiU new-staking-account" @click="initFarmer">
          New staking account
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import useWallet from '@/composables/wallet';
import useCluster, { BankAddr } from '@/composables/cluster';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';
import ConfigPane from '@/components/ConfigPane.vue';
import ConfigFarm from '@/components/ConfigFarm.vue';
import FarmerDisplay from '@/components/gem-farm/FarmerDisplay.vue';
import Vault from '@/components/gem-bank/Vault.vue';
import { INFT } from '@/common/web3/NFTget';
import { findFarmerPDA, stringifyPKsAndBNs } from '@gemworks/gem-farm-ts';
import Modal from "@/components/Modal.vue";
import { createProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';


export default defineComponent({
  components: { Vault, FarmerDisplay, ConfigPane, Modal, ConfigFarm},
  setup(props, ctx) {
    const { wallet, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();
    const widthdrawNFTs = ref(false);
    const modalActive = ref(false);
    const modalGood = ref(false);
    const modalBad = ref(false);
    const modalNeutral = ref(false);
    const modalShowWheel = ref(false);
    const modalShowClosebutton = ref(false);

    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    };

    const showModal = () => {
      modalActive.value = true;
    };

    const hideModal = () => {
      modalActive.value = false;
    };

    const setModalContent = (header:string, content:string, style:string, showClose:boolean, showWheel:boolean) => {
        modalGood.value = false;
        modalBad.value = false;
        modalNeutral.value = false;

        ModalHeader.value = header;
        ModalMessage.value = content; 

        modalShowClosebutton.value = showClose;
        modalShowWheel.value = showWheel;

        if(style == 'modal-good')
                modalGood.value = true
        if(style == 'modal-bad')
                modalBad.value = true
        if(style == 'modal-neutral')
                modalNeutral.value = true


    };

    let gf: any;
    watch([wallet, cluster], async () => {
      await freshStart();
    });

    //needed in case we switch in from another window
    onMounted(async () => {
      await freshStart();
    });

    // --------------------------------------- farmer details
    const farm = ref<string>();
    const farmAcc = ref<any>();
    const ModalMessage  = ref<string>();    
    const ModalHeader  = ref<string>();  
    const accruedReward  = ref<string>();
    const paidOutReward = ref<string>();    
    const fixedRate = ref<number>();    
    const estFixedRate = ref<number>();

    const farmerIdentity = ref<string>();
    const farmerAcc = ref<any>();
    const farmerState = ref<string>();

    const availableA = ref<string>();
    const accruedA = ref<string>();
    const availableB = ref<string>();
    const choosenFarm = ref<string>();
    choosenFarm.value = "unknown";
    // let choosenFarm = "unknown";
    const VaultRef = ref<any>(null);

    //auto loading for when farm changes
    watch(farm, async () => {
      await freshStart();
    });

    const updateAvailableRewards = async () => {
      accruedReward.value = farmerAcc.value.rewardA.accruedReward.toString();
      paidOutReward.value = farmerAcc.value.rewardA.paidOutReward.toString();
      fixedRate.value = (farmerAcc.value.rewardA.fixedRate.promisedSchedule.baseRate * farmerAcc.value.rarityPointsStaked.words[0]);
      estFixedRate.value = Math.floor((Date.now()/1000 - farmerAcc.value.minStakingEndsTs) * (fixedRate.value / 1000000000)/604799);
      
      availableA.value = farmerAcc.value.rewardA.accruedReward
        .sub(farmerAcc.value.rewardA.paidOutReward)
        .toString();
      availableB.value = farmerAcc.value.rewardB.accruedReward
        .sub(farmerAcc.value.rewardB.paidOutReward)
        .toString();   
        console.log ("called updateAvailableRewards method")
    };

    const fetchFarn = async () => {   
      farmAcc.value = await gf.fetchFarmAcc(new PublicKey(farm.value!));  
      console.log(
        `farm found at ${farm.value}:`,
        stringifyPKsAndBNs(farmAcc.value)
      );
    };

    const fetchFarmer = async () => {
      const [farmerPDA] = await findFarmerPDA(
        new PublicKey(farm.value!),
        getWallet()!.publicKey!
      );
      farmerIdentity.value = getWallet()!.publicKey?.toBase58();
      farmerAcc.value = await gf.fetchFarmerAcc(farmerPDA);
      farmerState.value = gf.parseFarmerState(farmerAcc.value);
      await updateAvailableRewards();
      console.log(
        `farmer found at ${farmerIdentity.value}:`,
        stringifyPKsAndBNs(farmerAcc.value)
      );
    };

    //@ts-ignore
    const onChangeFarm = async (e) => {
      choosenFarm.value = e.target.value
      console.log(choosenFarm)
      onChangeFarmVerb()

      }

    const onChangeFarmVerb = async () => {
      console.log(choosenFarm)
    }
    const freshStart = async () => {
      //  setModalContent("Welcome to Lux Metaverse Staking", "We are actively updating this interface/staking solution. But please note before staking to make sure all your NFT's are in the Target Vault before staking. The act of clicking 'Start Staking' will lock this NFT for 7 days in this vault you will not be able to unstake during this time.", "modal-neutral", true, false);     
      //    showModal();
      if (getWallet() && getConnection()) {
        gf = await initGemFarm(getConnection(), getWallet()!);
        farmerIdentity.value = getWallet()!.publicKey?.toBase58();
        farm.value = BankAddr.LUX;

        //reset stuff
        farmAcc.value = undefined;
        farmerAcc.value = undefined;
        farmerState.value = undefined;
        availableA.value = undefined;
        availableB.value = undefined;
        widthdrawNFTs.value = false;
        // choosenFarm.value = undefined;

        try {          
          await fetchFarn();
          await fetchFarmer();
           setInterval(function () {
              updateAvailableRewards()
          }, 20000);
        } catch (e) {
          console.log(`farm with PK ${farm.value} not found :(`);
        }
      }
    };

    const initFarmer = async () => {
      //debugger;
          try
          {           
            setModalContent("Submitting Transaction", "Creating new staking account: Transaction in Progress", "modal-neutral", false, true);    
             showModal();
             const farmObj = {"Greedy Pigz": "Fw8hwJXuJR6hNQJdKW2ASrHoV4HnFyHMhmYig1hbDLn4",
                              "Greedy Hogz": "DpYmHC5ZrkQLVDoVKMkUsgpq5FNpvphirTbctzRDtk47",
                              "Mutant Zombies": "DpYmHC5ZrkQLVDoVKMkUsgpq5FNpvphirTbctzRDtk47"
                             }
             const farmAddress = farmObj["Greedy Pigz"]
              await gf.initFarmerWallet(new PublicKey(farmAddress));  
              await fetchFarmer();
          }
          catch(ex: unknown)
          {      
             let message = 'Unknown Error: Please try again. If the problem continues, please reach out to the site admin'
              if (ex instanceof Error) {
                hideModal();
                message = ex.message;
                if(message.includes("0x1770"))
                {
                message = "Transaction Failed: Compute limit(200000) reached. ";
                }
                if(message.includes("0x1"))
                {
                message = "Please make sure you have at least .05 Sol in your account to cover rental and transaction fees";
                }
                if(message.includes("0x1784"))
                {
                message = "Vault is Locked. Please try again after the minimum staking peroid has completed ";
                }
                
                showModal();
                setModalContent("There was a problem", message , "modal-bad", true, false);
                }
          }          
    };

    // --------------------------------------- staking
    const beginStaking = async () => {

      try
      {
        showModal();
        setModalContent("Submitting Transaction", "Transaction in Progress", "modal-neutral", false, true);     
        debugger;           
          if((VaultRef.value.desiredVaultNFTs.length >= VaultRef.value.currentVaultNFTs.length && VaultRef.value.desiredVaultNFTs.length > 0))
          {
            await VaultRef.value.moveNFTsOnChain();
            console.log("farm.value ", farm.value)
            await gf.stakeWallet(new PublicKey(farm.value!));
            hideModal();
          }
          else
          {
            if((VaultRef.value.desiredVaultNFTs.length - VaultRef.value.currentVaultNFTs.length) >= 0 && VaultRef.value.desiredVaultNFTs.length < 1)
            {
              setModalContent("There was a problem", "You must move at least 1 NFT to the staking wallet. To do so, click the NFT then click the right arrow then hit Start Staking!" , "modal-bad", true, false);
            }
            else
            {
              await VaultRef.value.moveNFTsOnChain();                
              hideModal();
            }             
          }
          await fetchFarmer();        
      }
      catch(ex: unknown)
      {      
        hideModal();
        //debugger;
        let message = 'Unknown Error: Please try again. If the problem continues, please reach out to the site admin'
        if (ex instanceof Error) {
          message = ex.message;
          if(message.includes("0x179a"))
          {
           message = "Minimum staking time not reached. ";
          }
          if(message.includes("0x1785"))
          {
           message = "Must have at least 1 NFT staked in the Vault. ";
          }
          if(message.includes("0x1784"))
          {
           message = "Vault is Locked. Please try again after the minimum staking peroid has completed ";
          }
           
           showModal();
           setModalContent("There was a problem", message , "modal-bad", true, false);
        }
      }
      selectedNFTs.value = [];
    };

    const endStaking = async (finalize:boolean) => {
      try
      {
        showModal();
        setModalContent("Submitting Transactions.", "Please Wait. Transaction in Progress", "modal-neutral", false, true);

          await gf.unstakeWallet(new PublicKey(farm.value!));
          await fetchFarmer();

        hideModal();
      }
      catch(ex: unknown)
      {      
        //debugger;
        let message = 'Unknown Error: Please try again. If the problem continues, please reach out to the site admin'
        if (ex instanceof Error) {
          message = ex.message;
          if(message.includes("0x179a"))
          {
           message = "Minimum staking time not reached. ";
          }
           showModal();
           setModalContent("There was a problem", message , "modal-bad", true, false);
        }
      }
      selectedNFTs.value = [];

      if(finalize)
        endStaking(false);
    };

    

    const claim = async () => {
      await gf.claimWallet(
        new PublicKey(farm.value!),
        new PublicKey(farmAcc.value.rewardA.rewardMint!),
        new PublicKey(farmAcc.value.rewardB.rewardMint!)
      );
      await fetchFarmer();
    };

    const handleRefreshFarmer = async () => {
      await gf.refreshFarmerWallet(
        new PublicKey(farm!),
        new PublicKey(farmerIdentity!)
          );
    };

    // --------------------------------------- adding extra gem
    const selectedNFTs = ref<INFT[]>([]);

    const handleNewSelectedNFT = (newSelectedNFTs: INFT[]) => {
      //debugger
      widthdrawNFTs.value = (VaultRef.value.currentVaultNFTs.length - VaultRef.value.desiredVaultNFTs.length> 0 )
      
      console.log(`selected ${newSelectedNFTs.length} NFTs`);
      selectedNFTs.value = newSelectedNFTs; 
    };

    const handleNewSelectedVaultNFT = (newSelectedNFTs: INFT[]) => {
      //debugger;
      widthdrawNFTs.value = (VaultRef.value.currentVaultNFTs.length - VaultRef.value.desiredVaultNFTs.length> 0 )
      
      console.log(`selected ${newSelectedNFTs.length} NFTs`);
      selectedNFTs.value = newSelectedNFTs;
    };

    const addSingleGem = async (
      gemMint: PublicKey,
      gemSource: PublicKey,
      creator: PublicKey
    ) => {
      await gf.flashDepositWallet(
        new PublicKey(farm.value!),
        '1',
        gemMint,
        gemSource,
        creator
      );
      await fetchFarmer();
    };

    const addGems = async () => {
       try
      {
       showModal();
        setModalContent("Submitting Transactions.", "Please Wait. Transaction in Progress", "modal-neutral", false, true);
      await Promise.all(
        selectedNFTs.value.map((nft) => {
          const creator = new PublicKey(
            //todo currently simply taking the 1st creator
            (nft.onchainMetadata as any).data.creators[0].address
          );
          console.log('creator is', creator.toBase58());

          addSingleGem(nft.mint, nft.pubkey!, creator);
        })
      );
      console.log(
        `added another ${selectedNFTs.value.length} gems into staking vault`
      );
       await VaultRef.value.moveNFTsOnChain();
       hideModal();
      }
      catch(ex: unknown)
      {      
        //debugger;
        let message = 'Unknown Error: Please try again. If the problem continues, please reach out to the site admin'
        if (ex instanceof Error) {
          message = ex.message;
          if(message.includes("0x179a"))
          {
           message = "Minimum staking time not reached. ";
          }
           showModal();
           setModalContent("There was a problem", message , "modal-bad", true, false);
        }
      }     
    };
    

    return {
      wallet,
      farm,
      farmAcc,
      farmer: farmerIdentity,
      farmerAcc,
      farmerState,
      availableA,
      availableB,
      initFarmer,
      beginStaking,
      endStaking,
      claim,
      handleRefreshFarmer,
      selectedNFTs,
      handleNewSelectedNFT,
      handleNewSelectedVaultNFT,
      addGems,
      VaultRef,
      modalActive, 
      toggleModal,
      showModal,
      hideModal,
      setModalContent,
      modalGood,
      modalBad,
      modalNeutral,
      modalShowClosebutton,
      modalShowWheel,
      ModalMessage,
      ModalHeader,
      accruedReward,
      paidOutReward,
      fixedRate,
      estFixedRate,
      widthdrawNFTs,
      choosenFarm,
      onChangeFarm
    };
  },
});
</script>

<style scoped>
.selectedFarm  { 
        align-items: center;
        display: flex;
        vertical-align: middle;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
    }
</style>
