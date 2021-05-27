<template>
    <ion-page>
        <ion-content>
            <ion-title>Deck</ion-title>
            <ion-list>
                <ion-item v-for="(word, i) in words" :key=i>
                    <ion-card class="ion-margin" color="light">
                        <ion-card-header class="ion-padding">
                            <ion-card-title>
                                <ion-input v-model="word.word" 
                                    @ion-change="OnWordChange(word.word, keys[i], word.expiration, word.lastTerm)">
                                </ion-input>
                            </ion-card-title>
                        </ion-card-header>

                        <ion-card-content>
                            <span>
                                Review Data: 
                                <ion-datetime v-model="word.expiration" @ionChange="OnExpirationChange(word.word, word.expiration, word.lastTerm)"></ion-datetime>    
                            </span>

                            <span>
                                Interval: <ion-input v-model="word.lastTerm" @ion-change="OnExpirationChange(word.word, word.expiration, word.lastTerm)"></ion-input> days
                            </span>
                        </ion-card-content>
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
    IonDatetime, IonInput, IonContent } from '@ionic/vue'
import { defineComponent } from 'vue'
import { Storage } from '@capacitor/storage'

interface WordData {
    word: string;
    expiration: string;
    lastTerm: number;
}

const saveWord = (word: string, expiration: string, lastTerm: number) => 
{
    alert('save: ' + word + expiration + lastTerm)
}

const eraseWord = (word: string) => {
    alert('erase: ' + word)
}

export default defineComponent({
    name: 'Deck',
    components: {
        IonList, IonItem,
        IonPage,
        IonCard, IonCardTitle, IonCardHeader, IonCardContent,
        IonTitle,
        //IonGrid, IonRow, IonCol,
        IonDatetime, IonInput, IonContent
    },
    // setup() {
    // },
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
                expiration: new Date(exp.expiration).toISOString(),
                lastTerm: exp.lastTerm as number
            })
            this.keys.push(key)
        })
    },
    methods: {
        OnWordChange(newWord: string, oldWord: string, exp: string, lastTerm: number){
            saveWord(newWord, exp, lastTerm)
            eraseWord(oldWord)
        },
        OnExpirationChange(word: string, exp: string, lastTerm: number){
            saveWord(word, exp, lastTerm)
        }
    }
})
</script>
