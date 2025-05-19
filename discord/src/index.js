(async () => {
    require('dotenv').config()

const discord = require('discord.js')
const fs = require("fs")
const client = new discord.Client({intents: [discord.GatewayIntentBits.Guilds, discord.GatewayIntentBits.MessageContent]});

const commandFileNames = await fs.readdirSync("src/commands")
const commands = new Map()
commandFileNames.forEach(async (filename) => {
    commands.set(filename.split(".")[0],require(`./commands/${filename}`))
})
console.log(commands)


client.on('ready', () => {
    console.log("Bot is ready")
})



client.login(process.env.discord_token)
})()

