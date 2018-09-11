const levels = {
  1: {
    objective: { text: 'Drink 10 beers', beers: 10 },
    mechanics: [],
  },
  2: {
    objective: { text: 'Drink 20 beers', beers: 20 },
    mechanics: ['TimedPowerUp'],
  },
  3: { 
    objective: { text: 'Drink 30 beers', beers: 30 },
    mechanics: ["Boulder"],
  },
  4: {
    objective: { text: 'Dont Die', beers: 1000 },
    mechanics: ["Zombie"],
  }
}

export const getObjectives = (level) => {
  return levels[level]
}
