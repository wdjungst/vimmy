const levels = {
  1: {
    objective: { text: 'Drink 10 beers', beers: 1 },
    mechanics: [],
  },
  2: {
    objective: { text: 'Drink 25 beers', beers: 2 },
    mechanics: ['TimedPowerUp'],
  },
  3: { 
    objective: { text: 'Drink 50 beers', beers: 3 },
    mechanics: ["Boulder"],
  }
}

export const getObjectives = (level) => {
  return levels[level]
}
