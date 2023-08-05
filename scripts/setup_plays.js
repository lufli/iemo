/* eslint-disable object-curly-newline */
const { kv } = require('@vercel/kv');

const powerballPlays = [
  { type: 'powerball', N1: 4, N2: 9, N3: 22, N4: 41, N5: 55, NS: 11, power: true },
  { type: 'powerball', N1: 18, N2: 25, N3: 47, N4: 52, N5: 66, NS: 16, power: true },
  { type: 'powerball', N1: 7, N2: 13, N3: 15, N4: 24, N5: 34, NS: 18, power: true },
];

const megaPlays = [
  { type: 'mega', N1: 15, N2: 27, N3: 42, N4: 56, N5: 69, NS: 17, power: true },
  { type: 'mega', N1: 3, N2: 18, N3: 31, N4: 47, N5: 62, NS: 9, power: true },
  { type: 'mega', N1: 5, N2: 10, N3: 23, N4: 37, N5: 56, NS: 17, power: true },
  { type: 'mega', N1: 7, N2: 16, N3: 25, N4: 42, N5: 49, NS: 8, power: true },
];

async function main() {
  let response = await kv.set('powerball_plays', powerballPlays);
  console.log(response);

  response = await kv.set('mega_plays', megaPlays);
  console.log(response);
}

main();
