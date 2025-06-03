const { SlashCommandBuilder } = require("discord.js")
module.exports = {
  data: new SlashCommandBuilder()
  .setName('oscar-piastri')
  .setDescription('Information on Oscar Piastri'),
  async execute(interaction) {
  await interaction.reply('Australian F1 driver who currently races for McLaren with several wins and poles under his belt.')}}