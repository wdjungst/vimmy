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
    mechanics: ["TimedPowerUp", "Boulder"],
  },
  4: {
    objective: { text: 'Drink 50 beers', beers: 50 },
    mechanics: ["TimedPowerUp", "Boulder", "Boulder", "Zombie"],
  },
  5: {
    objective: { text: "Don't Die", beers: 1000 },
    mechanics: ["TimedPowerUp", "Boulder", "Boulder", "Boulder", "Zombie", "Zombie"],

  }
}

export const getObjectives = (level) => {
  return levels[level]
}
