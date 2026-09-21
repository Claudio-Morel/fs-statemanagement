import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAnecdote, getAnecdotes, updateAnecdote } from '../requests'
import useNotify from './useNotify'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`a new anecdote '${newAnecdote.content}' created`)
    },
    onError: () => {
      notify('too short anecdote, must have length 5 or more')
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`you voted '${updatedAnecdote.content}'`)
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate({ content }),
    voteAnecdote: (anecdote) => updateAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  }
}
