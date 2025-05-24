(async () => {
  require('dotenv').config()

  const discord = require('discord.js');
  const fs = require("fs");
  const path = require('node:path');
  const client = new discord.Client({
    intents: [
      discord.GatewayIntentBits.Guilds,
      discord.GatewayIntentBits.MessageContent,
      discord.GatewayIntentBits.GuildMembers,
      discord.GatewayIntentBits.GuildMessages]
  });

  const commands = [
    {
      name: 'Max Verstappen',
      description: 'replies with the GOAT',
    },
  ];

  const commandFileNames = await fs.readdirSync("src/commands")
  const command = new Map()
  commandFileNames.forEach(async (filename) => {
    command.set(filename.split(".")[0], require(`./commands/${filename}`))
  })
  console.log(commands)


  require('dotenv').config();
  const { REST, Routes } = require('discord.js');
  console.log(process.env.discord_token)
  const rest = new REST({ version: '10'}).setToken(process.env.discord_token);

  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.client_ID,
        process.env.guild_ID),
      { body: commands }
    )

    console.log('Slash commands registered correctly');
  } catch (error) {
    console.log(`Flat tire!: ${error}`);
  }
})();