require('dotenv').config();
const { REST, Routes } = require('discord.js');
const path = require('node:path');
const { loadFiles } = require('./utils/fileloader');

const commandsPath = path.join(__dirname, 'slash-commands');
const commandFiles = loadFiles(commandsPath);

const slashCommands = [];

for (const file of commandFiles) {
  const command = require(file);
  if (command?.data?.toJSON) {
    slashCommands.push(command.data.toJSON());
  } else {
    console.warn(`[BLACK FLAG] Invalid command structure in: ${file}`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    // Routes.applicationCommands(process.env.CLIENT_ID), //This is global deployment!!
    // Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] });
    // console.log('Clearing old commands...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: slashCommands } //if need to clear []
    );
    console.log('Registering new guild commands...');

    console.log('Guild commands registered correctly')
  } catch (error) {
    console.error(`Flat tire!: ${error}`);
  }
})();

