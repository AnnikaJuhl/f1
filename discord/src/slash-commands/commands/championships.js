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
    try {
      const year = parseInt(interaction.options.getString('year'));
      const type = interaction.options.getString('type');
      let result;

      const champEmbed = new EmbedBuilder()
        .setTitle(`Championship Results for ${year}`)
        .setColor(0x8b0000)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

      if (type === 'driver') {
        result = drivers.find(d => d.year === year);

        if (result?.champion) {
          champEmbed
            .setDescription(`${result.champion} won the Drivers Championship in ${result.year}`)
            .setThumbnail(result.driverImage || null)
            .setAuthor({
              name: `${result.champion} (${result.country})`,
            })
            .addFields(
              { name: 'Team', value: result.team || 'Unknown', inline: true },
              { name: 'Country', value: result.country || 'Unknown', inline: true }
            );
          await interaction.reply({ embeds: [champEmbed] });
        } else {
          await interaction.reply('No data found.');
        }

      } else if (type === 'constructor') {
        result = constructors.find(c => c.year === year);

        if (!result) {
          await interaction.reply(`No constructor championship data found for ${year}.`);
          return;
        }

        if (!result.team) {
          const noChampEmbed = new EmbedBuilder()
            .setColor(0x8b0000)
            .setTitle(`Constructor Championship - ${result.year}`)
            .setDescription(`The championship structure at the time focused solely on the individual driver standings and championships. No constructor championship existed until 1958.`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

          await interaction.reply({ embeds: [noChampEmbed] });
        }

        champEmbed
          .setThumbnail(result.flag || null)
          .setImage(result.logo)
          .addFields(
            { name: 'Constructor Champion', value: result.team, inline: false },
            { name: 'Country', value: result.country || 'Unknown', inline: false },
            { name: 'Team Principal', value: result.team_principal || 'Unknown', inline: true },
            { name: 'Drivers', value: result.drivers?.join(', ') || 'Unknown', inline: false }
          );
        await interaction.reply({ embeds: [champEmbed] });
      } else {
        await interaction.reply('No data found.');
      }
    } catch (err) {
      console.error('Error executing command:', err);
      if (!interaction.replied) {
        await interaction.reply({ content: 'Something went wrong.', ephemeral: true });
      }
    }
  }
}
