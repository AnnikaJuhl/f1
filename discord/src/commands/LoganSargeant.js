  const { SlashCommandBuilder } = require("discord.js")
module.exports = {
  data: new SlashCommandBuilder()
  .setName('logan-sargeant')
  .setDescription('Information on Logan Sargeant'),
  async execute(interaction) {
    console.log('hi');
  await interaction.reply('AMERICA!!!!!!!!! WTF IS A KILOMETER')}

  }