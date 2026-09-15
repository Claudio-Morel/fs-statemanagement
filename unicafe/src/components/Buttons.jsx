import { useStatisticControl } from '../store'

const Buttons = () => {
  const { voteGood, voteNeutral, voteBad } = useStatisticControl()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={ voteGood }>good</button>
      <button onClick={ voteNeutral }>neutral</button>
      <button onClick={ voteBad }>bad</button>
    </div>
  )
}

export default Buttons
