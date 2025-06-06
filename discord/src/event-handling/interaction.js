const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    
    if (interaction.isAutocomplete()) {
       console.log(`Received autocomplete for: ${interaction.commandName}`);
      const command = interaction.client.commands.get(interaction.commandName);
        console.log([...interaction.client.commands.values()].map(c => c.data?.name));

       if (!command || !command.autocomplete) {
        return interaction.respond([]);
       }

       try {
        await command.autocomplete(interaction);
        console.log('Autocomplete handled successfully.');
      } catch (error) {
        console.error(`[AUTOCOMPLETE ERROR] ${error}`);
      }
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`No command matching ${interaction.commandName}`);
      return;
    }

    try {
      console.log(`Running command: ${interaction.commandName}`);
      console.log('Command object:', command);
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      const response = { content: 'Loose lug nut, return to garage', flags: MessageFlags.Ephemeral };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(response);
      } else {
        await interaction.reply(response);
      }
    }
  },
}; 