const { SlashCommandBuilder } = require("discord.js")
module.exports = {
  data: new SlashCommandBuilder()
  .setName('lando-norris')
  .setDescription('Information on Lando Norris'),
  async execute(interaction) {
  await interaction.reply('British F1 driver who currently races for MacLaren racing alongside second driver Oscar Piastri.')}}
  