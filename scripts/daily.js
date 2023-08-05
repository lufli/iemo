const { kv } = require('@vercel/kv');
const { sendMessageToChannel } = require('../lib/slack/message');
const powerball = require('../lib/lottery/powerball');
const doublePlay = require('../lib/lottery/double-play');
const mega = require('../lib/lottery/mega');

async function main() {
  // Script runs every hour.
  // For everyday 0:00 (EST), might need to check winning number:
  // Mon ->
  // Tue -> Powerball, Double Play
  // Wed -> Mega
  // Thu -> Powerball, Double Play
  // Fri -> Report
  // Sat -> Mega
  // Sun -> Reset Prize, Powerball, Double Play
  const day = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: 'America/New_York',
  });

  let powerballWinningNumbers = null;
  let doublePlayWinningNumbers = null;
  let megaWinningNumbers = null;
  const updates = [];
  const errors = [];

  try {
    if (day === 'Tue') {
      powerballWinningNumbers = await powerball.getWinningNumbers();
      doublePlayWinningNumbers = await doublePlay.getWinningNumbers();
    } else if (day === 'Wed') {
      megaWinningNumbers = await mega.getWinningNumbers();
    } else if (day === 'Thu') {
      powerballWinningNumbers = await powerball.getWinningNumbers();
      doublePlayWinningNumbers = await doublePlay.getWinningNumbers();
    } else if (day === 'Fri') {
      // Fri send a weekly report
      const powerballPrize = await kv.get('powerball_prize');
      const doublePlayPrize = await kv.get('double_play_prize');
      const megaPrize = await kv.get('mega_prize');

      const text = `
Weekly Report

Powerball Prize: ${powerballPrize}
Double Play Prize: ${doublePlayPrize}
Mega Millions Prize: ${megaPrize}

Total: ${powerballPrize + doublePlayPrize + megaPrize}`;

      const response = await sendMessageToChannel({
        channel: '#billionaire-monitor',
        text,
        link: 'https://www.iemo.io/weekly_report',
      });

      if (response !== 'ok') {
        return response;
      }

      updates.push('Weekly Report');
    } else if (day === 'Sat') {
      megaWinningNumbers = await mega.getWinningNumbers();
    } else if (day === 'Sun') {
      await kv.set('powerball_prize', 0);
      await kv.set('double_play_prize', 0);
      await kv.set('mega_prize', 0);

      powerballWinningNumbers = await powerball.getWinningNumbers();
      doublePlayWinningNumbers = await doublePlay.getWinningNumbers();
    }

    if (powerballWinningNumbers) {
      // update powerball winning numbers
      const response = await kv.set('powerball', powerballWinningNumbers);
      if (response !== 'OK') {
        errors.push('Error on updating Powerball winning numbers');
      } else {
        updates.push('Powerball');
      }
      // incr powerball prize this week
      const powerballPlays = await kv.get('powerball_plays');
      const prize = powerballPlays.reduce((sum, play) => (
        sum + powerball.checkNumbersForPrize(powerballWinningNumbers, play).prize
      ), 0);
      await kv.incrby('powerball_prize', prize);
    }

    if (doublePlayWinningNumbers) {
      // update double play winning numbers
      const response = await kv.set('double_play', doublePlayWinningNumbers);
      if (response !== 'OK') {
        errors.push('Error on updating Double Play winning numbers');
      } else {
        updates.push('Double Play');
      }
      // incr double play prize this week
      const doublePlayPlays = await kv.get('powerball_plays');
      const prize = doublePlayPlays.reduce((sum, play) => (
        sum + powerball.checkNumbersForPrize(doublePlayWinningNumbers, play).prize
      ), 0);
      await kv.incrby('double_play_prize', prize);
    }

    if (megaWinningNumbers) {
      // update mega millions winning number
      const response = await kv.set('mega', megaWinningNumbers);
      if (response !== 'OK') {
        errors.push('Error on updating Mega Millions winning numbers');
      } else {
        updates.push('Mega Millions');
      }
      // incr mega millions prize this week
      const megaPlays = await kv.get('mega_plays');
      const prize = megaPlays.reduce((sum, play) => (
        sum + powerball.checkNumbersForPrize(megaWinningNumbers, play).prize
      ), 0);
      await kv.incrby('mega_prize', prize);
    }

    if (errors.length !== 0) {
      const response = await sendMessageToChannel({
        channel: '#billionaire-monitor',
        level: 'danger',
        text: errors.join('\n'),
        link: 'https://www.iemo.io',
      });

      if (response !== 'ok') {
        return response;
      }
    } else if (updates.length === 0) {
      const response = await sendMessageToChannel({
        channel: '#billionaire-monitor',
        text: 'Cron job run, but did nothing.',
        link: 'https://www.iemo.io',
      });

      if (response !== 'ok') {
        return response;
      }
    } else {
      const response = await sendMessageToChannel({
        channel: '#billionaire-monitor',
        level: 'good',
        text: `${updates.join(', ')} updated!`,
        link: 'https://www.iemo.io',
      });

      if (response !== 'ok') {
        return response;
      }
    }
  } catch (error) {
    const response = await sendMessageToChannel({
      channel: '#billionaire-monitor',
      level: 'danger',
      text: error.message,
      link: 'https://www.iemo.io',
    });

    if (response !== 'ok') {
      return response;
    }
  }
  return { message: 'Ok' };
  // Nothing to check now.
}

module.exports = { main };
