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
        <ion-fab-button @click="showWordDlg"><ion-icon name="add"></ion-icon></ion-fab-button>
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
import { Storage } from '@capacitor/storage'
import { DayToMilliSec, FloorDate, MakeExpiration } from '../App.vue'

const SearchURL = 'https://www.google.com/search?q='
const SearchOption = '&tbm='

interface WordData {
  word: string;
  expiration: Date;
  lastTerm: number;
}

const DefaultExpiration = {
  expiration: Date.now(),
  lastTerm: 1
}

const saveWord = (word: string, expiration: object) => {
  Storage.set({
    key: word,
    value: JSON.stringify(expiration)
  })
}

const loadWord = async (result: Array<WordData>) => {
  const keysObj = await Storage.keys()

  keysObj.keys.forEach( async key => {
    const expJson = await Storage.get({ key })
    const exp = JSON.parse(expJson.value || '')

    if(exp.expiration <= Date.now()){
      result.push({
        word: key,
        expiration: new Date(FloorDate(exp.expiration)),
        lastTerm: exp.lastTerm as number
      })
    }
  })
}

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
    return {
      close,
      add
    }
  },
  async mounted() {
    loadWord(this.expiredWords)
  },
  data () {
    return {
      expiredWords: Array<WordData>()
    }
  },
  computed: {
    currentWord (): WordData {
      return this.expiredWords[0]
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
    wrong(data: WordData){
      saveWord(data.word, MakeExpiration(Date.now(), 1))
      
      //間違えたやつは最後尾にする
      const wrongWord = this.expiredWords.shift();
      if(wrongWord){
        this.expiredWords.push(wrongWord)
      }
    },
    ok(data: WordData){
      const term = Math.floor(data.lastTerm * 1.5)
      saveWord(data.word, 
        MakeExpiration(Date.now() + term * DayToMilliSec, term))
      
      this.expiredWords.shift()
    },
    easy(data: WordData){
      const term = Math.floor(data.lastTerm * 2.0)
      saveWord(data.word,
       MakeExpiration(Date.now() + term * DayToMilliSec, term))

      this.expiredWords.shift()
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