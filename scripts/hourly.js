const { kv } = require('@vercel/kv');
const { sendMessageToChannel } = require('../lib/slack/message');
const getPowerballWinningNumbers = require('../lib/lottery/powerball').getWinningNumbers;
const getDoublePlayWinningNumbers = require('../lib/lottery/double-play').getWinningNumbers;
const getMegaWinningNumbers = require('../lib/lottery/mega').getWinningNumbers;

async function main() {
  // Script runs every hour.
  // For everyday 0:00 (EST), might need to check winning number:
  // Mon ->
  // Tue -> Powerball, Double Play
  // Wed -> Mega
  // Thu -> Powerball, Double Play
  // Fri ->
  // Sat -> Mega
  // Sun -> Powerball, Double Play
  const hour = parseInt(new Date().toLocaleString('en-US', {
    hour12: false,
    timeZone: 'America/New_York',
  }).split(',')[1].split(':')[0].trim(), 10);

  const day = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: 'America/New_York',
  });

  let powerballWinningNumbers = null;
  let doublePlayWinningNumbers = null;
  let megaWinningNumbers = null;

  if (hour === 0) {
    try {
      if (day === 'Tue') {
        powerballWinningNumbers = await getPowerballWinningNumbers();
        doublePlayWinningNumbers = await getDoublePlayWinningNumbers();
      } else if (day === 'Wed') {
        megaWinningNumbers = await getMegaWinningNumbers();
      } else if (day === 'Thu') {
        powerballWinningNumbers = await getPowerballWinningNumbers();
        doublePlayWinningNumbers = await getDoublePlayWinningNumbers();
      } else if (day === 'Sat') {
        megaWinningNumbers = await getMegaWinningNumbers();
      } else if (day === 'Sun') {
        powerballWinningNumbers = await getPowerballWinningNumbers();
        doublePlayWinningNumbers = await getDoublePlayWinningNumbers();
      }

      const updates = [];

      if (powerballWinningNumbers) {
        await kv.set('powerball', powerballWinningNumbers);
        updates.push('Powerball');
      }
      if (doublePlayWinningNumbers) {
        await kv.set('double-play', doublePlayWinningNumbers);
        updates.push('Double Play');
      }
      if (megaWinningNumbers) {
        await kv.set('mega', megaWinningNumbers);
        updates.push('Mega Millions');
      }

      sendMessageToChannel({
        channel: '#billionaire-monitor',
        level: 'good',
        text: `${updates.join(', ')} updated!`,
      });
    } catch (error) {
      sendMessageToChannel({
        channel: '#billionaire-monitor',
        level: 'danger',
        text: error.message,
      });
    }
  }

  if (hour !== 0) {
    // Nothing to check now.
    sendMessageToChannel({
      channel: '#billionaire-monitor',
      text: 'Cron job run, but did nothing.',
    });
  }
}

module.exports = { main };
