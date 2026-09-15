import { create } from 'zustand'

export const useStatisticStore = create(set => ({
  statistic: {
    good: 0,
    neutral: 0,
    bad: 0,
  },
  actions: {
    voteGood: () => set(state => ({
      statistic:
      {
        ...state.statistic,
        good: state.statistic.good + 1
      }
    })),
    voteNeutral: () => set(state => ({
      statistic: {
        ...state.statistic,
        neutral: state.statistic.neutral + 1
      }
    })),
    voteBad: () => set(state => ({
      statistic: {
        ...state.statistic,
        bad: state.statistic.bad + 1
      }
    })),
  }
}))

export const useStatistic = () => useStatisticStore(state => state.statistic)
export const useStatisticControl = () => useStatisticStore(state => state.actions)
