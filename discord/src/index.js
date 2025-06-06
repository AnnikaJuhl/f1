require('dotenv').config();

const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const slashCommands = [];

const eventsPath = path.join(__dirname, 'event-handling');
const commandsPath = path.join(__dirname, 'slash-commands');

client.on('ready', () => {
  console.log('Going for the gap!');
});

function loadFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    const commandFiles = []
    const folderFiles = fs.readdirSync(folderPath)
    for (const file in folderFiles) {
      if (fs.lstatSync(path.join(folderPath, folderFiles[file])).isDirectory()) {
        commandFiles.push(loadFolder(path.join(folderPath, folderFiles[file])))
      } else {
        commandFiles.push(path.join(folderPath, folderFiles[file]))
      }
    }
    return commandFiles.flat()

  } else throw new Error("No path " + path)
}

const commandFiles = loadFolder(commandsPath);

commandFiles.forEach(file => {
  const commandFile = require(file);

  if (!commandFile || !commandFile.data || !commandFile.data.name || typeof commandFile.execute !== 'function') {
    console.warn(`[BLACK FLAG] Skipping invalid command file: ${file}`);
    return;
  }

  // console.log(commandFile)
  // console.log(commandFile.data)

  client.commands.set(commandFile.data.name, commandFile);
  slashCommands.push(commandFile.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    // await rest.put(
    //   Routes.applicationCommands(process.env.CLIENT_ID), //This is global deployment!!
    await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: [] } // Clears global commands, remove once done with deving
);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] }
    ); 
      console.log('Clearing old commands...');
    
      console.log('Registering new guild commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: slashCommands }
    );
    console.log('Guild commands registered correctly')
  } catch (error) {
    console.error(`Flat tire!: ${error}`);
  }
})();

if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  // console.log(eventFiles)
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (!event.name || typeof event.execute !== 'function') {
      console.log(`[BLACK FLAG] Event at ${filePath} is missing requirements`);
    } else {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }
}

client.login(process.env.TOKEN);