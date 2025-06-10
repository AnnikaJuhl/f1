const { SlashCommandBuilder, AutocompleteInteraction } = require('discord.js')
// const { autocomplete } = require('./championships');
// const driverinfo = require('../data/f1_driver_descriptions')
const years = require('../data/driversByYearNames.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team-info')
        .setDescription('Current and historic information on teams')
        .addStringOption(option =>
            option
                .setName('year')
                .setDescription('Select a year you want to learn about')
                .setAutocomplete(true)
                .setRequired(true))
                .addStringOption(option =>
            option
                .setName('team')
                .setDescription('Select what team you want to learn about!')
                .setAutocomplete(true)
                .setRequired(true)),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused(true);
        console.log('Focused Option:', focusedValue);
        if (focusedValue.name !== 'year') return;
        const driverYears = years.map(d => d.year);
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
        let result, message;

        if (type === 'driver') {
            result = drivers.find(d => d.year === year);
            message = result?.champion
                ? `**${year}** Driver Champion: **${result.champion} (${result.country})**`
                : result?.note || 'No data found.';

        } else if (type === 'constructor') {
            result = constructors.find(c => c.year === year);
            message = result?.constructor
                ? `**${year}** Constructor Champion: **${result.constructor}**`
                : result?.note || 'No data found.';
        }
        await interaction.reply({ content: message });
    }
};