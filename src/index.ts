import fetch from 'node-fetch';
import { Telegraf } from 'telegraf';
import { Keyboard } from 'telegram-keyboard';
import dotenv from 'dotenv';

dotenv.config({
  path: require('path').resolve(
    process.cwd(),
    process.env.NODE_ENV === 'prod' ? '.env' : '.env.dev'
  ),
});

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.command('/menu', async ({ reply }) => {
  const keyboard = Keyboard.make([
    ['фразу', 'шутку'], // First row
    ['привет', 'пока'], // Second row
  ]);

  reply('Пацанское меню', keyboard.reply());
  // await reply('Simple inline keyboard', keyboard.inline());
});

bot.hears('фразу', (ctx) => {
  const array = ['Я не ожидал от тебя брат'];

  const randomNum = Math.floor(Math.random() * array?.length);

  ctx.reply(array[randomNum]);
});

bot.hears('шутку', (ctx) => {
  const array = [
    'Аскар тащит в доту',
    'Архат, сядь на котак',
    'Э, иди нах',
    'Апай, можно пятерку. Ну, апай !!!',
    'Россия ждет',
  ];
  const randomNum = Math.floor(Math.random() * array?.length);

  ctx.reply(array[randomNum]);
});

bot.hears(/привет|ку|как дела|калай/i, (ctx) => {
  ctx.reply('Че тааааам!!!');
});

bot.hears(/росси/i, (ctx) => {
  ctx.reply('Россия россия!!!');
});

bot.hears(/^пока$/i, (ctx) => {
  ctx.reply('Давай до свидания');
});

bot.command('/go', (ctx) => {
  ctx.reply('get out');
});

bot.start((ctx) => {
  ctx.reply('Welcome');
});

bot.command('/quote', async (ctx) => {
  const res = await fetch('https://type.fit/api/quotes');
  const data = await res.json();
  const randomNum = Math.floor(Math.random() * data?.length);
  const quote = `
    ${data[randomNum]?.text} ${data[randomNum]?.author}
  `;

  ctx.reply(quote);
});

bot.hears(/^hi$/i, (ctx) => ctx.reply('Hey there'));

bot.launch();