const { SlashCommandBuilder } = require('discord.js')
const drivers = require('../data/DRIVERc.json');
const constructors = require('../data/CONSTRUCTORc.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('championships')
    .setDescription('Information on championships per year and type!')
    .addStringOption(option =>
      option
        .setName('year')
        .setDescription('Choose a year')
        .setAutocomplete(true)
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('Select championship type')
        .setRequired(true)
        .addChoices(
          { name: 'Driver', value: 'driver' },
          { name: 'Constructor', value: 'constructor' }
        )
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused(true);
    console.log('Focused Option:', focusedValue);
    if (focusedValue.name !== 'year') return;
    const driverYears = drivers.map(d => d.year);
    const constructorYears = constructors.map(c => c.year);
    const allYears = Array.from(new Set([...driverYears, ...constructorYears])).sort();

    const filtered = allYears
      .filter(year => year.toString().startsWith(focusedValue.value)) //object not string, forgot .value
      .slice(0, 25)
      .map(year => ({
        name: year.toString(),
        value: year.toString()
      }));

    await interaction.respond(filtered);

  },

  async execute(interaction) {
    const year = parseInt(interaction.options.getString('year'));
    const type = interaction.options.getString('type');
    let result;

    const champEmbed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle(`Championship Results - ${year}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

    if (type === 'driver') {
      result = drivers.find(d => d.year === year);

      if (result?.champion) {
        champEmbed.addFields([
        { name: 'Driver Champion', value: `${result.champion} (${result.country})`, inline: false } 
      ]);
      await interaction.reply({ embeds: [champEmbed] });
      } else {
        await interaction.reply(result?.note || 'No data')
      }

    } else if (type === 'constructor') {
      result = constructors.find(c => c.year === year);

if (result?.champion) {
        champEmbed.addFields([
        { name: 'Constructor Champion', value: `${result.champion} (${result.country})`, inline: false } 
      ]);
      await interaction.reply({ embeds: [champEmbed] });
      } else {
        await interaction.reply(result?.note || 'No data')
      }

      if (result?.champion) {
        champEmbed.addFields([
          { name: `${year} Driver Champion`, value: `${result.champion} (${result.country})`, inline: false },
          { name: 'Team', value: result.team || 'Unknown', inline: true },
        ]);
        message = result?.champion
          ? `** ${year} ** Constructor Champion: ** ${result.constructor} ** `
          : result?.note || 'No data found.';
      }
      await interaction.reply({ embeds: [champEmbed] });
    }
  }
};