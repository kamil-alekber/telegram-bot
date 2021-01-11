import dotenv from "dotenv";
dotenv.config({
  path: require("path").resolve(
    process.cwd(),
    process.env.NODE_ENV === "prod" ? ".env" : ".env.dev"
  ),
});
import { Telegraf, Context } from "telegraf";
import { Keyboard } from "telegram-keyboard";
import fs, { createReadStream } from "fs";
import https  from "https";


const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.catch((err: any, ctx: Context) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.command("/menu", async ({ reply }) => {
  const keyboard = Keyboard.make([
    ["фразу", "шутку"], // First row
    ["привет", "пока"], // Second row
  ]);

  reply("Пацанское меню", keyboard.reply());
  // await reply('Simple inline keyboard', keyboard.inline());
});

bot.start((ctx) => {
  ctx.reply("Welcome");
});

bot.command("/quote", async (ctx) => {
  const today = new Date();

  const date = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;

  const fileName = `quotes-${date}.json`;

  if (!fs.existsSync(fileName)) {
    console.log("exists");
    return;
  } else {
    const wStream = fs.createWriteStream(fileName, {
      flags: "a",
      autoClose: true,
    });

    const req = https.request(
      { hostname: "type.fit", path: "/api/quotes", port: 443, method: "GET" },
      (res) => {
        res.on("data", (chunk: Buffer) => {
          wStream.write(chunk.toString());
        });
      }
    );

    req.on("error", (error) => {
      console.error(error);
    });

    req.end(() => {
      console.log('ended');
      
      ctx.reply("quote");
    });
  }

  const rSteam = createReadStream(fileName, { autoClose: true });

  rSteam.on("data", (chunk: Buffer) => {
    console.log(chunk.length);
  });
});

bot.launch();
