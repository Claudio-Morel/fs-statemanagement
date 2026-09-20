import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const compareAnecdote = (anecdoteA, anecdoteB) => {
  return anecdoteB.votes - anecdoteA.votes
}

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    addVote: async id => {
      const anecdote = get().anecdotes.find(n => n.id === id)
      const updated = { ...anecdote, votes: anecdote.votes + 1 }
      const updatedAnecdote = await anecdoteService.update(id, updated)
      useNotificationStore.getState().actions.showNotification(
        `you voted '${updatedAnecdote.content}'`
      )

      set(state => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === id ? updatedAnecdote : anecdote
        ).toSorted(compareAnecdote)
      }))
    },
    addAnecdote: async content => {
      const newAnecdote = await anecdoteService.createNew(content)
      useNotificationStore.getState().actions.showNotification(
        `you added '${newAnecdote.content}'`
      )
      set(state => ({
        anecdotes: state.anecdotes.concat(newAnecdote).toSorted(compareAnecdote)
      }))
    },
    eraseAnecdote: async id => {
      const anecdote = get().anecdotes.find(n => n.id === id)

      if (!anecdote || anecdote.votes > 0) {
        useNotificationStore.getState().actions.showNotification(
          `Failed to erase anecdote with id: '${anecdote.id}'`
        )
        return
      }

      await anecdoteService.erase(id)
      useNotificationStore.getState().actions.showNotification(
        `you erased '${anecdote.content}'`
      )
      set((state) => ({
        anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id)
      }))
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes: anecdotes.toSorted(compareAnecdote) }))
    },
  }
}))

let notificationTimer

const useNotificationStore = create(set => ({
  notification: null,
  actions: {
    showNotification: (message, type) => {
      clearTimeout(notificationTimer)

      set(() => ({
        notification: { message: message, type: type }
      }))

      notificationTimer = setTimeout(() => {
        clearTimeout(notificationTimer)
        notificationTimer = undefined
        set(() => ({notification: null}))
      }, 5000)
    }
  }
}))


export const useAnecdote = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote
      .content
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  return filteredAnecdotes
}
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
