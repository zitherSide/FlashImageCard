import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store, MutationTree, ActionTree } from 'vuex'
import { Storage } from '@capacitor/storage'
import { FloorDate } from '../App.vue'

export interface Word {
    word: string;
    expiration: number;
    lastTerm: number;
}

export interface State {
    words: Word[];
}

export const key: InjectionKey<Store<State>> = Symbol('')
const state: State = {
    words: []
}

export function useStore(){
    return baseUseStore(key)
}

export const enum MUTATIONS {
    ADD_WORD = 'ADD_WORD',
    REMOVE_WORD = 'REMOVE_WORD',
    UPDATE_WORD = 'UPDATE_WORD',
    SHIFT_ROTATE = 'SHITF_ROTATE'
}

export const enum ACTIONS {
    FETCH_WORDS = 'FETCH_WORDS',
    SAVE_WORDS = 'SAVE_WORDS'
}

const mutations: MutationTree<State> = {
    [MUTATIONS.ADD_WORD](state, word: Word){
        state.words.push(word)
    },
    [MUTATIONS.REMOVE_WORD](state, word: string){
        state.words = state.words.filter( elem => elem.word !== word)
        Storage.remove({key: word})
    },
    [MUTATIONS.UPDATE_WORD](state, word: Word){
        const index = state.words.findIndex( elem => elem.word === word.word)
        state.words[index] = word
    },
    [MUTATIONS.SHIFT_ROTATE](state){
        const shifted = state.words.shift()
        if(shifted)
            state.words.push(shifted)
    }
}

const actions: ActionTree<State, any> = {
    [ACTIONS.FETCH_WORDS](store){
        Storage.keys().then( keysRes => {
            keysRes.keys.forEach( async key => {
                const valStr = await Storage.get({key: key})
                const val = JSON.parse(valStr.value || '')
                store.commit(MUTATIONS.ADD_WORD, {
                    word: key,
                    expiration: FloorDate(val.expiration),
                    lastTerm: val.lastTerm as number
                })
            })
        })
    },
    [ACTIONS.SAVE_WORDS](store){
        store.state.words.forEach( word => {
            const key = word.word
            const valObj = {
                expiration: FloorDate(word.expiration),
                lastTerm: word.lastTerm
            }
            const val = JSON.stringify(valObj)

            Storage.set({
                key: key,
                value: val
            })
        })

    }

}
export const store = createStore<State>({state, mutations, actions})