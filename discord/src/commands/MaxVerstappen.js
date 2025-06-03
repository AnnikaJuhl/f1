const { SlashCommandBuilder } = require("discord.js")
module.exports = {
  data: new SlashCommandBuilder()
  .setName('max-verstappen')
  .setDescription('Information on Max Verstappen'),
  async execute(interaction) {
  await interaction.reply('Arriving as Formula 1s youngest ever competitor at just 17 years old, Verstappen pushed his car, his rivals and the sports record books to the limit.')}}