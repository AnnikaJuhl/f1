const { SlashCommandBuilder } = require("discord.js")
module.exports = {
  data: new SlashCommandBuilder()
  .setName('lewis-hamilton')
  .setDescription('Information on Lewis Hamilton'),
  async execute(interaction) {
  await interaction.reply('British driver who formerly raced with Mercedes AMG Petronas but has now switched to Ferrari alongside Charles Leclerc.')}}