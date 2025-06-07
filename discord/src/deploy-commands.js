require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commandsPath = path.join(__dirname, 'slash-commands');

function loadCommands(folderPath) {
    const loaded = [];
    const files = fs.readdirSync(folderPath, { withFileTypes: true });

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

    for (const file of files) {
        const fullPath = path.join(folderPath, file.name);
        if (file.isDirectory()) {
            loaded.push(...loadCommands(fullPath));
        } else if (file.name.endsWith('.js')) {
            const command = require(fullPath);
            if (command?.data?.toJSON());
        } else {
            console.warn(`[BLACK FLAG] Skipping file: ${fullPath}`);
        }

        return loaded;
    }
    const slashCommands = loadCommands(commandsPath);
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
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
          { body: slashCommands }
        );
        console.log('Guild commands registered correctly')
      } catch (error) {
        console.error(`Flat tire!: ${error}`);
      }
    })();
    }
}




