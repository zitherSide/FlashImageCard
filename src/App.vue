<template>
  <ion-app>
    <ion-toolbar>
      <ion-title>Flash Image Card</ion-title>
      <ion-buttons slot="primary">
        <ion-button router-link="Home">Cards</ion-button>
      </ion-buttons>
      <ion-buttons slot="primary">
        <ion-button router-link="Deck">Deck</ion-button>
      </ion-buttons>
    </ion-toolbar>
    
    <ion-router-outlet main/>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, IonButton, IonButtons, IonMenuButton,
  IonToolbar, IonTitle, IonItemDivider } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonButton, IonButtons,// IonMenuButton,
    IonToolbar, IonTitle, //IonItemDivider,
  },
});
</script>

<style>
  :root {
    --ion-safe-area-top: 20px;
    --ion-safe-area-bottom: 22px; 
  }
</style>

<style scoped>
  ion-header ion-toolbar {
    margin: 10px;
  }
</style>