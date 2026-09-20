import {useAnecdote, useAnecdoteActions} from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdote()
  const { addVote, eraseAnecdote} = useAnecdoteActions()

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => { addVote(anecdote.id); console.log(anecdote.id) }}>vote</button>
            {(anecdote.votes === 0) ?
              <button
                onClick={() => {
                    eraseAnecdote(anecdote.id)
                }}>
                delete
              </button> :
              null
            }
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
