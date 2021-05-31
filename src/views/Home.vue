<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-item-divider/>
      <ion-item-divider/>
      <ion-card v-if="currentWord">
        <ion-card-header>
          <ion-card-title>{{currentWord ? currentWord.word : ''}}</ion-card-title>
          <ion-card-subtitle>{{currentWord}}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-buttons>
            <ion-button @click="search(currentWord.word, 'isch')">Image</ion-button>
            <ion-button @click="search(currentWord.word)">Text</ion-button>
            <ion-button @click="search(currentWord.word, 'vid')">Video</ion-button>
          </ion-buttons>
          <ion-buttons>
            <ion-button color="danger" @click="wrong(currentWord)"><ion-icon name="close"></ion-icon></ion-button>
            <ion-button color="success" @click="ok(currentWord)">o<ion-icon name="add"></ion-icon></ion-button>
            <ion-button color="success" @click="easy(currentWord)">easy</ion-button>
          </ion-buttons>
        </ion-card-content>
      </ion-card>
      <ion-content v-else>
        Done!
      </ion-content>

      <ion-fab vertical="bottom" horizontal="end">
        <ion-fab-button @click="showWordDlg">+</ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, 
  IonFab, IonFabButton, IonIcon, IonButton, IonButtons,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  IonItemDivider,
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
    //IonGrid,
    //IonCol,
    //IonRow,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton, IonButtons,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
    IonItemDivider
  },
  setup() {
    useStore()
    store.dispatch(ACTIONS.FETCH_WORDS)

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
    currentWord () {
      return store.state.words.filter( elem => elem.expiration <= Date.now())[0]
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
      store.commit(MUTATIONS.UPDATE_WORD, data)
      store.commit(MUTATIONS.SHIFT_ROTATE) //間違えたやつは最後尾にする
      store.dispatch(ACTIONS.SAVE_WORDS)
    },
    ok(data: Word){
      const term = Math.floor(data.lastTerm * 1.5)
      store.commit(MUTATIONS.UPDATE_WORD, {
        word: data.word,
        expiration: Date.now() + term * DayToMilliSec,
        lastTerm: term
      })
      store.dispatch(ACTIONS.SAVE_WORDS)
    },
    easy(data: Word){
      const term = Math.floor(data.lastTerm * 2.0)
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