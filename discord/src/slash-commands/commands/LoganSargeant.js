  const { SlashCommandBuilder } = require("discord.js")
module.exports = {
  data: new SlashCommandBuilder()
  .setName('logan-sargeant')
  .setDescription('Information on Logan Sargeant'),
  async execute(interaction) {
  await interaction.reply('Logan Hunter Sargeant is an American who was born and raised in Fort Lauderdale, Florida, who most recently competed in Formula One from 2023 to 2024 for F1 team Williams Racing.')}
  }