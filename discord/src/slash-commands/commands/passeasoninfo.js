const { SlashCommandBuilder } = require('discord.js')
const { EmbedBuilder } = require('discord.js');
const info = require('../data/af1db-races.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('past-season-info')
        .setDescription('Information on past seasons from 1950 to 2024!')
        .addStringOption(option =>
            option
                .setName('year')
                .setDescription('Choose a year')
                .setAutocomplete(true)
                .setRequired(true)),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused(true);
        if (focusedValue.name !== 'year') return;
        const allYears = [...new Set(info.map(name => name.year))].sort((a, b) => b - a); 
        const filtered = allYears
            .filter(year => year.toString().startsWith(focusedValue.value)) 
            .slice(0, 25)
            .map(year => ({
                name: year.toString(),
                value: year.toString()
            }));

        await interaction.respond(filtered);

    },
}