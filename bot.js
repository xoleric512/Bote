// bot.js
import { Telegraf } from "telegraf";
import axios from "axios";

// ⚠️ TEST UCHUNGINA — ishlab chiqarish uchun emas!
const BOT_TOKEN = "7689583739:AAEjv-It0EICEVYP48lR7toBnvP8Ba2iwOU";
const HF_KEY = "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";
const HF_MODEL = "gpt2"; // istasangiz "microsoft/DialoGPT-medium" yoki "meta-llama/Llama-2-7b-chat-hf" ishlating

const bot = new Telegraf(BOT_TOKEN);

async function queryHF(prompt) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { inputs: prompt, parameters: { max_new_tokens: 150 } },
      {
        headers: { Authorization: `Bearer ${HF_KEY}` },
      }
    );

    const data = response.data;
    if (Array.isArray(data) && data[0]?.generated_text)
      return data[0].generated_text.trim();
    if (data.generated_text) return data.generated_text.trim();
    return JSON.stringify(data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return "❌ Xatolik: AI bilan bog‘lanib bo‘lmadi.";
  }
}

// /start buyrug‘i
bot.start((ctx) =>
  ctx.reply("👋 Salom! Men Xoleric tomonidan yaratilgan AI test botman.")
);

// /stars buyrug‘i
bot.command("stars", (ctx) =>
  ctx.reply("⭐ Bu bot Xoleric tomonidan yaratilgan AI tomonidan boshqariladi.")
);

// Oddiy xabarlarni AI ga yuborish
bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;
  await ctx.sendChatAction("typing");

  const aiResponse = await queryHF(userMessage);
  ctx.reply(aiResponse);
});

bot.launch();
console.log("🚀 Xoleric AI bot ishga tushdi!");