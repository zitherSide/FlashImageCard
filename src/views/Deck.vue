<template>
    <ion-page>
        <ion-content>
            <ion-title>Deck</ion-title>
            <ion-item-divider></ion-item-divider>

            <ion-grid>
                <ion-row>
                    <ion-col><h2>Word</h2></ion-col>
                    <ion-col><h2>Review Date</h2></ion-col>
                    <ion-col><h2>Interval(days)</h2></ion-col>
                    <ion-col><h2>Actions</h2></ion-col>
                </ion-row>
                <ion-row></ion-row>
                <ion-item-divider sticky></ion-item-divider>

                <ion-row v-for="(word, i) in words" :key="i">
                    <ion-col>
                        <ion-input v-model="word.word"
                            @ionBlur="OnWordUnfocused(word.word, storedWords[i].word, word.expiration, word.lastTerm)">
                        </ion-input>
                    </ion-col>
                    
                    <ion-col>
                        <ion-datetime v-model="word.expiration" @ionChange="OnExpirationChange(word.word, word.expiration, word.lastTerm)"></ion-datetime>    
                    </ion-col>

                    <ion-col>
                        <ion-input v-model="word.lastTerm" @ionChange="OnExpirationChange(word.word, word.expiration, word.lastTerm)"></ion-input>    
                    </ion-col>

                    <ion-col>
                        <ion-button @click="OnDelete(word.word)" color="danger"><ion-icon name="close"></ion-icon></ion-button>
                    </ion-col>

                    <ion-item-divider></ion-item-divider>

                </ion-row>
            </ion-grid>

        </ion-content>
    </ion-page>
</template>

<script lang='ts'>
import { //IonList, IonItem, IonPage,
// IonCard, IonCardTitle, IonCardContent, IonCardHeader,
    IonTitle, IonPage,
    IonGrid, IonRow, IonCol,
    IonButton,
    IonDatetime, IonInput, IonContent,
    IonItemDivider,
    IonIcon } from '@ionic/vue'
import { trash, close } from 'ionicons/icons'
import { defineComponent } from 'vue'
import { banner } from '../App.vue'
import { store, MUTATIONS, ACTIONS} from '../store'

export default defineComponent({
    name: 'Deck',
    components: {
        //IonList, IonItem,
        IonPage,
        //IonCard, IonCardTitle, IonCardHeader, IonCardContent,
        IonTitle,
        IonGrid, IonRow, IonCol,
        IonButton,
        IonDatetime, IonInput, IonContent,
        IonIcon,
        IonItemDivider
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
        },
        storedWords(){
            return store.state.words
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
