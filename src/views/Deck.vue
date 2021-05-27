<template>
    <ion-page>
        <ion-content>
            <ion-title>Deck</ion-title>

            <ion-list>
                <ion-item v-for="(word, i) in words" :key=i>
                    <ion-card class="ion-margin">
                        <ion-grid>
                            <ion-row>
                                <ion-col size="9">
                                    <ion-card-header class="ion-padding">
                                        <ion-card-title>
                                            {{i}} : {{word.word}}
                                        <ion-card-subtitle>Review Data: {{word.expiration}}</ion-card-subtitle>
                                        <ion-card-subtitle>Interval: {{word.lastTerm}} days</ion-card-subtitle>
                                        </ion-card-title>
                                    </ion-card-header>
                                </ion-col>

                                <ion-col>
                                    <ion-item>
                                        <ion-button color="success" class="ion-justify-content-center">Edit</ion-button>
                                    </ion-item>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-card>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang='ts'>
import { IonList, IonItem, IonPage, IonCard, IonCardTitle, IonCardContent, IonCardHeader,
    IonGrid, IonRow, IonCol } from '@ionic/vue'
import { defineComponent } from 'vue'
import { Storage } from '@capacitor/storage'

interface WordData {
    word: string;
    expiration: Date;
    lastTerm: number;
}
export default defineComponent({
    name: 'Deck',
    components: {
        IonList, IonItem,
        IonPage,
        IonCard, IonCardTitle, IonCardHeader,
        IonGrid, IonRow, IonCol
    },
    // setup() {
    // },
    data () {
        return {
            words: Array<WordData>()
        }
    },
    async mounted(){
        const keysObj = await Storage.keys()
        keysObj.keys.forEach( async key => {
            const expJson = await Storage.get({ key })
            const exp = JSON.parse(expJson.value || '')

            this.words.push({
                word: key,
                expiration: new Date(exp.expiration),
                lastTerm: exp.lastTerm as number
            })
        })
    }

})
</script>
