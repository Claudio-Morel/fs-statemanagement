import {useAnecdotes, useAnecdotesActions} from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { addVote } = useAnecdotesActions()

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => { addVote(anecdote.id); console.log(anecdote.id) }}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
