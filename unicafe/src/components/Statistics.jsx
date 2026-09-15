import { useStatistic } from '../store'

const Statistics = () => {
  const { good, neutral, bad } = useStatistic()

  let all = good + neutral + bad
  let score = good - bad
  let average = 0
  let positive = 0
  if (all !== 0) {
    average = score / all
    positive = good / all * 100
  }

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive} %</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
