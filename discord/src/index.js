(async () => {
    require('dotenv').config();
  const { REST, Routes, Collection, Client, GatewayIntentBits, InteractionCollector, Events } = require('discord.js');

  console.log(process.env.TOKEN)
  const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages]
  });

   client.on('ready', () => {
    console.log('Going for the gap');
});

  const fs = require("fs");
  const path = require('node:path');

  client.commands = new Collection()
  const commandsPath = path.join(__dirname, 'commands');
  const commandFolder = fs.readdirSync(commandsPath);
  for (const file of commandFolder) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
  }

  const slashCommand = []
  const commandFileNames = await fs.readdirSync("src/commands")
  commandFileNames.forEach(async (filename) => {
      const commandFile = require('./commands/'+filename)
      client.commands.set(commandFile.data.name, commandFile.execute);
      slashCommand.push(commandFile.data.toJSON())

  })

  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID,
        process.env.GUILD_ID),
      { body: slashCommand }
    )

    console.log('Slash commands registered correctly');
  } catch (error) {
    console.log(`Flat tire!: ${error}`);
  }

  client.on(Events.InteractionCreate, interaction => {
  const response = client.commands.get(interaction.commandName);
  if(response) {
    response(interaction)
  }
  if (!response) {
    console.error('Wrong garage! ${interaction.commandName}');
    return;
  }
})

const { SlashCommandBuilder } = require("discord.js")
client.login(process.env.TOKEN)

})();

  // const promptFileNames = await fs.readdirSync("src/prompts")
  // const prompt = new Map()
  // promptFileNames.forEach(async (filename) => {
  //   const fileData = require(`./prompts/${filename}`)
  //   prompt.set(fileData.prompt, fileData.execute)
  // }) 


//   if(file.name) -> command
// if(file.prompt) -> prompt