const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const webhookUrl = process.env.WEBHOOK_URL;
const botToken = process.env.BOT_TOKEN;

if (!webhookUrl) {
  console.error("Missing WEBHOOK_URL environment variable");
  process.exit(1);
}

if (!botToken) {
  console.error("Missing BOT_TOKEN environment variable");
  process.exit(1);
}

client.once("clientReady", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.channelId === newState.channelId) return;

  try {
    await axios.post(webhookUrl, {
      event: "VOICE_STATE_UPDATE",
      data: {
        user_id: newState.id,
        channel_id: newState.channelId,
        channel_name: newState.channel?.name ?? null,
        guild_id: newState.guild.id,
      },
    });
  } catch (err) {
    const message = err?.response?.data ?? err.message;
    console.error("Webhook error:", message);
  }
});

client.login(botToken);
