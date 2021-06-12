<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-item-divider/>
      <ion-item-divider/>

      <ion-list>
        <ion-item v-for="(word, i) in expiredWords" :key="i">
          <ion-card >
            <ion-card-header>
              <ion-card-title>{{word.word}}</ion-card-title>
              <!-- <ion-card-subtitle>{{word}}</ion-card-subtitle> -->
            </ion-card-header>
            <ion-card-content>
              <ion-buttons>
                <ion-button @click="search(word.word, 'isch')">Image</ion-button>
                <ion-button @click="search(word.word)">Text</ion-button>
                <ion-button @click="search(word.word, 'vid')">Video</ion-button>
              </ion-buttons>
              <ion-buttons>
                <ion-button color="danger" @click="wrong(word)"><ion-icon name="close"></ion-icon></ion-button>
                <ion-button color="success" @click="ok(word)">o<ion-icon name="add"></ion-icon></ion-button>
                <ion-button color="success" @click="easy(word)">easy</ion-button>
              </ion-buttons>
            </ion-card-content>
          </ion-card>
        </ion-item>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end">
        <ion-fab-button @click="showWordDlg">+</ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, 
  IonFab, IonFabButton, IonIcon, IonButton, IonButtons,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, //IonCardSubtitle,
  IonItemDivider,
  IonList, IonItem,
  alertController } from '@ionic/vue';
import { add, close } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { useStore, ACTIONS, store, Word, MUTATIONS } from '../store'
import { DayToMilliSec, banner } from '../App.vue'

const SearchURL = 'https://www.google.com/search?q='
const SearchOption = '&tbm='

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton, IonButtons,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, //IonCardSubtitle,
    IonItemDivider,
    IonList, IonItem
  },
  setup() {
    useStore()

    return {
      close,
      add,
      store
    }
  },
  mounted() {
    banner()
  },
  computed: {
    words () {
      return store.state.words
    },
    expiredWords (){
      return store.state.words.filter( elem => elem.expiration <= Date.now())
    },
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
      store.commit(MUTATIONS.ADD_WORD, {
        word: word,
        expiration: Date.now(),
        lastTerm: 1
      })

      store.dispatch(ACTIONS.SAVE_WORDS)
    },
    wrong(data: Word){
      data.lastTerm = 1
      store.commit(MUTATIONS.UPDATE_WORD, data)
      store.commit(MUTATIONS.SHIFT_ROTATE) //間違えたやつは最後尾にする
      store.dispatch(ACTIONS.SAVE_WORDS)
    },
    ok(data: Word){
      const term = Math.max(data.lastTerm, Math.floor(data.lastTerm * 1.5))
      store.commit(MUTATIONS.UPDATE_WORD, {
        word: data.word,
        expiration: Date.now() + term * DayToMilliSec,
        lastTerm: term
      })
      store.dispatch(ACTIONS.SAVE_WORDS)
    },
    easy(data: Word){
      const term = Math.max(data.lastTerm + 1, Math.floor(data.lastTerm * 2.0))
      store.commit(MUTATIONS.UPDATE_WORD, {
        word: data.word,
        expiration: Date.now() + term * DayToMilliSec,
        lastTerm: term
      })
      store.dispatch(ACTIONS.SAVE_WORDS)
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
              this.addWord(data.word)
            }
          },
          {
            text: 'Cancel'
          } 
        ]
      })

      return dlg.present()
    },
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