import Vue from 'vue'
import Vuex from 'vuex'
import {gameSessionRef} from './firebaseConfig';
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: {
          loggedIn: false,
          data: null,
          gameDetails: {
            isGameStarted: false,
            gameId:null
          }
        },
        currentGame: {

        }
      },
      getters: {
        user(state){
          return state.user
        },
        currentGame(state) {
          return state.currentGame
        }
      },
      mutations: {
        SET_LOGGED_IN(state, value) {
          state.user.loggedIn = value;
        },
        SET_USER(state, data) {
          state.user.data = data;
        },
        SET_USERGAME(state,value) {
          state.user.gameDetails = value;
        },
        SET_GAME(state,data) {
          state.currentGame = data;
        }
      },
      actions: {
        fetchUser({ commit }, user) {
          commit("SET_LOGGED_IN", user !== null);
          if (user) {
            commit("SET_USER", {
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
            });
          } else {
            commit("SET_USER", null);
          }
        },
        fetchCurrentGameDetails({commit},details) {
          commit("SET_USERGAME", {
            isGameStarted:details.currentGameId !== null,
            gameId:details.currentGameId
          });
        },
        fetchGame({commit}, data) {
          gameSessionRef.child(data.gameId).on('value',snapshot=> {
            commit("SET_GAME",snapshot.val());
          })
          commit("SET_GAME",data.gameData)
        }
      }
})