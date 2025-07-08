const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const teamInfo = require('../data/af1db-seasons-entrants-drivers.json')
 //use for autocomplete years, shows driver and team, and also which rounds they were in (bit unnecessary for this command)

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
        const allYears = Array.from(
            new Set(teamInfo.map(entry => entry.year))
        ).sort((a,b) => a - b);

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
        let result, message;

       
        await interaction.reply({ content: message });
    }
};