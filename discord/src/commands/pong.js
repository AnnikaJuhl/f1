new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    
    async function execute(interaction) {
        await interaction.reply('Pong!')
    }
    