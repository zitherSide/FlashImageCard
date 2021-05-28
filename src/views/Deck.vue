<template>
    <ion-page>
        <ion-content>
            <ion-title>Deck</ion-title>
            <ion-list>
                <ion-item v-for="(word, i) in words" :key=i>
                    <ion-card class="ion-margin" color="light">
                        <ion-grid><ion-row>
                            <ion-col size="2">
                                <ion-card-header class="ion-padding">
                                    <ion-card-title>
                                        <ion-input v-model="word.word" 
                                            @ion-blur="OnWordUnfocused(word.word, keys[i], word.expiration, word.lastTerm)">
                                        </ion-input>
                                    </ion-card-title>
                                </ion-card-header>
                            </ion-col>

                            <ion-col size="8">
                                <ion-card-content>
                                    <ion-grid>
                                        <ion-row class="ion-align-items-end">
                                            <ion-col>Review Data:</ion-col>
                                            <ion-col><ion-datetime v-model="word.expiration" @ionChange="OnExpirationChange(word.word, word.expiration, word.lastTerm)"></ion-datetime></ion-col>    
                                        </ion-row>
                                    <span>
                                        <ion-row class="ion-align-items-end">
                                            <ion-col>Interval:</ion-col>
                                            <ion-coL><ion-input v-model="word.lastTerm" @ion-change="OnExpirationChange(word.word, word.expiration, word.lastTerm)"></ion-input></ion-coL>
                                            <ion-col>days</ion-col>
                                        </ion-row>
                                    </span>
                                    </ion-grid>
                                </ion-card-content>
                            </ion-col>

                            <ion-col class="ion-align-self-center" size="1">
                                <ion-button @click="OnDelete(word.word)" color="danger"><ion-icon name="close"></ion-icon></ion-button>
                            </ion-col>
                        </ion-row></ion-grid>
                    </ion-card>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang='ts'>
import { IonList, IonItem, IonPage, IonCard, IonCardTitle, IonCardContent, IonCardHeader,
    IonTitle,
    IonGrid, IonRow, IonCol,
    IonDatetime, IonInput, IonContent,
    IonIcon } from '@ionic/vue'
import { trash, close } from 'ionicons/icons'
import { defineComponent } from 'vue'
import { Storage } from '@capacitor/storage'
import { FloorDate, MakeExpiration } from '../App.vue'

interface WordData {
    word: string;
    expiration: string;
    lastTerm: number;
}

const saveWord = (word: string, expiration: string, lastTerm: number) => 
{
    Storage.set({
        key: word,
        value: JSON.stringify(MakeExpiration(Date.parse(expiration), lastTerm))
    })
    alert('save: ' + word + expiration + lastTerm)
}

const eraseWord = (word: string) => {
    alert('erase: ' + word)
    Storage.remove({ key: word })
}

export default defineComponent({
    name: 'Deck',
    components: {
        IonList, IonItem,
        IonPage,
        IonCard, IonCardTitle, IonCardHeader, IonCardContent,
        IonTitle,
        IonGrid, IonRow, IonCol,
        IonDatetime, IonInput, IonContent,
        IonIcon
    },
    setup() {
        return {
            close, trash
        }
    },
    data () {
        return {
            words: Array<WordData>(),
            keys: Array<string>(),
        }
    },
    async mounted(){
        const keysObj = await Storage.keys()
        keysObj.keys.forEach( async key => {
            const expJson = await Storage.get({ key })
            const exp = JSON.parse(expJson.value || '')

            this.words.push({
                word: key,
                expiration: new Date(FloorDate(exp.expiration)).toISOString(),
                lastTerm: exp.lastTerm as number
            })
            this.keys.push(key)
        })
    },
    methods: {
        OnWordUnfocused(newWord: string, oldWord: string, exp: string, lastTerm: number){
            if(newWord === oldWord){    //if there's no change, do nothing,
                return
            }
            saveWord(newWord, exp, lastTerm)
            eraseWord(oldWord)
        },
        OnExpirationChange(word: string, exp: string, lastTerm: number){
            saveWord(word, exp, lastTerm)
        },
        OnDelete(word: string){
            eraseWord(word)
            this.words = this.words.filter( elem => elem.word !== word)
        }
    }
})
</script>
