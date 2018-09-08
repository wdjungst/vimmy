const levels = {
  1: [
    { text: 'Drink 10 beers', beers: 10 },
  ],
  2: [
    { text: 'Drink 25 beers', beers: 25 },
  ],
  3: [
    { text: 'Drink 50 beers', beers: 50 },
  ]
}

export const getObjectives = (level) => {
  return levels[level]
}
