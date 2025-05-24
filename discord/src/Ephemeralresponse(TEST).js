client.on(Events.interactionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
         await interaction.reply({content: 'Teehee!', flags:MessageFlag.Ephemeral});
    }
});