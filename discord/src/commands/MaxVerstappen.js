const { REST, Routes } = require('discord.js');
const commands = [
  {
    name: 'Max Verstappen',
    description: 'replies with the GOAT',
  },
];

const rest = new REST ({version:'10'}).setToken(process.env.discord_token);

(async () => {
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