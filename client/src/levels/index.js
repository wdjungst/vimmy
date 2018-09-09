const levels = {
  1: {
    objective: { text: 'Drink 10 beers', beers: 10 },
    mechanics: [],
  },
  2: {
    objective: { text: 'Drink 25 beers', beers: 25 },
    mechanics: [],
  },
  3: { 
    objective: { text: 'Drink 50 beers', beers: 50 },
    mechanics: [
      'TimedPowerUp',
    ],
  }
}

export const getObjectives = (level) => {
  return levels[level]
}
