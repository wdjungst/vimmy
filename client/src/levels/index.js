const levels = {
  1: {
    objective: { text: 'Drink 10 beers', beers: 10 },
    mechanics: [],
  },
  2: {
    objective: { text: 'Drink 25 beers', beers: 20 },
    mechanics: ['TimedPowerUp'],
  },
  3: { 
    objective: { text: 'Drink 50 beers', beers: 30 },
    mechanics: ["Boulder"],
  }
}

export const getObjectives = (level) => {
  return levels[level]
}
