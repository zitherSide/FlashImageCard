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
                                            <ion-col><ion-input v-model="word.lastTerm" @ion-change="OnExpirationChange(word.word, word.expiration, word.lastTerm)"></ion-input></ion-col>
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
    IonButton,
    IonDatetime, IonInput, IonContent,
    IonIcon } from '@ionic/vue'
import { trash, close } from 'ionicons/icons'
import { defineComponent } from 'vue'
import { banner } from '../App.vue'
import { store, MUTATIONS, ACTIONS} from '../store'

export default defineComponent({
    name: 'Deck',
    components: {
        IonList, IonItem,
        IonPage,
        IonCard, IonCardTitle, IonCardHeader, IonCardContent,
        IonTitle,
        IonGrid, IonRow, IonCol,
        IonButton,
        IonDatetime, IonInput, IonContent,
        IonIcon
    },
    setup() {
        return {
            close, trash
        }
    },
    computed : {
        words(){
            return store.state.words.map( elem => {
                return {
                    word: elem.word,
                    expiration: new Date(elem.expiration).toISOString(),
                    lastTerm: elem.lastTerm
                }
            })
        }
    },
    async mounted(){
        banner()
    },
    methods: {
        OnWordUnfocused(newWord: string, oldWord: string, exp: string, lastTerm: number){
            if(newWord === oldWord){    //if there's no change, do nothing,
                return
            }
            store.commit(MUTATIONS.UPDATE_WORD, {
                word: newWord,
                expiration: Date.parse(exp),
                lastTerm: lastTerm
            })
            store.commit(MUTATIONS.REMOVE_WORD, oldWord)
            store.dispatch(ACTIONS.SAVE_WORDS)
        },
        OnExpirationChange(word: string, exp: string, lastTerm: number){
            store.commit(MUTATIONS.UPDATE_WORD, {
                word: word,
                expiration: Date.parse(exp),
                lastTerm: lastTerm
            })
            store.dispatch(ACTIONS.SAVE_WORDS)
        },
        OnDelete(word: string){
            store.commit(MUTATIONS.REMOVE_WORD, word)
            store.dispatch(ACTIONS.SAVE_WORDS)
        }
    }
})
</script>
