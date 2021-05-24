<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Flash Image Card</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Decks</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-menu-toggle>
        menu
      </ion-menu-toggle>

      <ion-card>
        <ion-card-header>
          <ion-card-title>{{word}}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-buttons>
            <ion-button>Image</ion-button>
            <ion-button>Text</ion-button>
            <ion-button>Video</ion-button>
          </ion-buttons>
          <ion-buttons>
            <ion-button color="danger"><ion-icon name="close"></ion-icon></ion-button>
            <ion-button color="success"><ion-icon name="add"></ion-icon></ion-button>
            <ion-button color="success">easy</ion-button>
          </ion-buttons>
        </ion-card-content>
      </ion-card>

      <ion-fab vertical="bottom" horizontal="end">
        <ion-fab-button><ion-icon name="close"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonCol, IonRow, 
  IonFab, IonFabButton, IonIcon,
  IonCard } from '@ionic/vue';
import { add, close, checkmark } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    //IonGrid,
    //IonCol,
    //IonRow,
    IonFab,
    IonFabButton,
    IonIcon,
    IonCard
  },
  setup() {
    return {
      close,
    }
  },
  data () {
    return {
      word: "cat"
    }
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  align-content: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}

</style>