<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Flash Image Card</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{words}}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-buttons>
            <ion-button @click="search(word, 'isch')">Image</ion-button>
            <ion-button @click="search(word)">Text</ion-button>
            <ion-button @click="search(word, 'vid')">Video</ion-button>
          </ion-buttons>
          <ion-buttons>
            <ion-button color="danger"><ion-icon name="close"></ion-icon></ion-button>
            <ion-button color="success">o<ion-icon name="add"></ion-icon></ion-button>
            <ion-button color="success">easy</ion-button>
          </ion-buttons>
        </ion-card-content>
      </ion-card>

      <ion-fab vertical="bottom" horizontal="end">
        <ion-fab-button @click="showWordDlg"><ion-icon name="add"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonCol, IonRow, 
  IonFab, IonFabButton, IonIcon, IonButton, IonButtons,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle,
  alertController } from '@ionic/vue';
import { add, close, checkmark } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { Storage } from '@capacitor/storage'

const SearchURL = 'https://www.google.com/search?q='
const SearchOption = '&tbm='

const DefaultExpiration = {
  expiration: Date.now(),
  lastTerm: 1
}

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
    IonButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle
  },
  setup() {
    return {
      close,
      add
    }
  },
  mounted() {
    const expiration = {
      expiration: Date.now(),
      lastTerm: 1
    }

    Storage.set({
      key: 'cat',
      value: JSON.stringify(expiration)
    })

    Storage.keys().then( res => this.words = res.keys)
  },
  data () {
    return {
      words: ['']
    }
  },
  methods: {
    search(query: string, option: string){
      let url = SearchURL + '"' + query + '"';
      if(option){
        url += SearchOption + option
      }

      InAppBrowser.create(url)
    },
    addWord(word: string){
      Storage.set({
        key: word,
        value: JSON.stringify(DefaultExpiration)
      })
    },
    async showWordDlg() {
      const dlg = await alertController.create({
        header: 'New Word',
        inputs: [
          {
            name: 'word',
            placeholder: 'new word'
          }
        ],
        buttons: [
          {
            text: 'OK',
            handler: data => {
              Storage.set({
                key: data.word,
                value: JSON.stringify(DefaultExpiration)
              })
            }
          },
          {
            text: 'Cancel'
          } 
        ]
      })

      return dlg.present()
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