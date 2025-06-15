const { SlashCommandBuilder } = require('discord.js')
const { EmbedBuilder } = require('discord.js');

const info = require('../data/af1db-races.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('season')
        .setDescription('Explore F1 seasons from 1950 to 2024')
        .addSubcommand(subcommand =>
            subcommand
                .setName('calendar')
                .setDescription('View the race calendar for a season')
                .addStringOption(option =>
                    option.setName('year')
                        .setDescription('Select a year')
                        .setAutocomplete(true)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('standings')
                .setDescription('View final standings for a season')
                .addStringOption(option =>
                    option.setName('year')
                        .setDescription('Select a year')
                        .setAutocomplete(true)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('race')
                .setDescription('View detailed info about a specific race')
                .addStringOption(option =>
                    option.setName('year')
                        .setDescription('Select a year')
                        .setAutocomplete(true)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('session')
                        .setDescription('Choose a race')
                        .setAutocomplete(true)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('detail')
                        .setDescription('Pick the type of race detail')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Track Info', value: 'track-info' },
                            { name: 'Race Incidents', value: 'race-incidents' },
                            { name: 'Standings', value: 'standings' }
                        )
                )),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused(true);
        if (focusedValue.name !== 'year') return;
        const allYears = [...new Set(info.map(item => item.year))].sort((a, b) => b - a);
        const filtered = allYears
            .filter(year => year.toString().startsWith(focusedValue.value))
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
            const subcommand = interaction.options.getSubcommand();

            const seasonEmbed = new EmbedBuilder()
                .setTitle(`Season information for ${year}`)
                .setColor(0x8b0000)
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

            if (subcommand === 'calendar') {
                const races = info.filter(d => d.year === year);

                if (races.length === 0) {
                    return await interaction.reply(`No races for ${year}`)
                }

                const raceList = races
                    .sort((a, b) => a.round - b.round)
                    .map(race => {
                        const date = new Date(race.date);
                        const prettyDate = date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                       return `**Race ${race.round}:** ${race.officialName} (${prettyDate})`;
                    })
                    .join('\n\n');

                seasonEmbed.setDescription(raceList);

                return await interaction.reply({ embeds: [seasonEmbed] });
            }

        } catch (err) {
            console.error('Error executing command:', err);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Something went wrong.', ephemeral: true });
            }
        }
    }
}