import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    erase: vi.fn(),
  },
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, {
  useAnecdote,
  useAnecdoteActions,
} from './store'

describe('anecdote store', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
  })

  it('initializes state with anecdotes returned by the backend', async () => {
    const mockAnecdotes = [
      { id: '3', content: 'Most voted', votes: 8 },
      { id: '2', content: 'Middle voted', votes: 3 },
      { id: '1', content: 'Least voted', votes: 0 },
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    expect(anecdoteService.getAll).toHaveBeenCalledTimes(1)
    expect(useAnecdoteStore.getState().anecdotes).toEqual(mockAnecdotes)
  })

  it('provides anecdotes sorted by votes to the list hook', async () => {
    const mockAnecdotes = [
      { id: '1', content: 'Least voted', votes: 0 },
      { id: '3', content: 'Most voted', votes: 8 },
      { id: '2', content: 'Middle voted', votes: 3 },
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result: anecdotes } = renderHook(() => useAnecdote())
    const { result: actions } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await actions.current.initialize()
    })

    expect(anecdotes.current.map((anecdote) => anecdote.votes)).toEqual([8, 3, 0])
  })

  it('provides only anecdotes matching the active filter', () => {
    const anecdotesInStore = [
      { id: '3', content: 'React makes state easier', votes: 8 },
      { id: '2', content: 'JavaScript is everywhere', votes: 3 },
      { id: '1', content: 'React hooks are useful', votes: 0 },
    ]
    useAnecdoteStore.setState({ anecdotes: anecdotesInStore })

    const { result: anecdotes } = renderHook(() => useAnecdote())
    const { result: actions } = renderHook(() => useAnecdoteActions())

    act(() => {
      actions.current.setFilter('react')
    })

    expect(anecdotes.current).toEqual([
      anecdotesInStore[0],
      anecdotesInStore[2],
    ])
  })

  it('increases an anecdote vote', async () => {
    const target = { id: '1', content: 'Vote for this', votes: 0 }
    const unaffected = { id: '2', content: 'Leave this unchanged', votes: 2 }
    const updated = { ...target, votes: 1 }
    useAnecdoteStore.setState({ anecdotes: [unaffected, target] })
    anecdoteService.update.mockResolvedValue(updated)

    const { result: anecdotes } = renderHook(() => useAnecdote())
    const { result: actions } = renderHook(() => useAnecdoteActions())

    await act(async ()  => {
      await actions.current.addVote(target.id)
    })

    expect(anecdoteService.update).toHaveBeenCalledWith(target.id, updated)
    expect(anecdotes.current.find((anecdote) => anecdote.id === target.id)).toEqual(updated)
    expect(anecdotes.current.find((anecdote) => anecdote.id === unaffected.id)).toEqual(unaffected)
  })
})
