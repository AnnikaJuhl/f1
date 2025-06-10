const { SlashCommandBuilder, AutocompleteInteraction } = require('discord.js')
// const { autocomplete } = require('./championships');
const driverinfo = require('../data/f1_driver_descriptions')
const drivername = require('../data/driversByYearFull.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('driver-history')
        .setDescription('Current and historic information on drivers!')
        .addStringOption(option =>
            option
                .setName('driver')
                .setDescription('select what driver you want to learn about!')
                .setAutocomplete(true)
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('Select what category you want to learn about!')
                .setRequired(true)
                .addChoices(
                    { name: 'info', value: 'drivers-info' },
                    { name: 'stats', value: 'team-info' },
                    { name: 'championships', value: 'championship-info' },
                    { name: 'wins', value: 'wins-info' },
                    { name: 'seasons', value: 'seasons-info' },
                    { name: 'teams', value: 'teams-info' }
                )),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const focusedValue = interaction.options.getFocused(true);
        console.log('Focused Option:', focusedValue);
        const allDrivers = Array.from(new Set(drivername.map(d => d.name)));

        if (focusedName === 'year') {
            const allYears = Array.from(new Set(drivername.map(d => d.year))).sort((a, b) => b - a);
            const filteredYears = allYears
                .map(String)
                .filter(year => year.startsWith(focusedValue))
                .slice(0, 25)
                .map(year => ({ name: year, value: year }));

            return interaction.respond(filteredYears);
        }
        if (focusedName === 'driver') {
            const selectedYear = interaction.options.getString('year');
            if (!selectedYear) return interaction.respond([]);

            const filteredDrivers = drivername
                .filter(d => d.year.toString() === selectedYear)
                .map(d => d.name);

            const driver = Array.from(new Set(filteredDrivers));

            const filtered = driver 
            .filter(name => name.toLowerCase().startsWith(focusedValue.value.toLowerCase()))
            .slice(0,25)
            .map(name => ({
                name, 
                value: name
        }));

        await interaction.respond(filtered);

        }
    }
}



//     async execute(interaction) {
//         const ynameear = parseInt(interaction.options.getString('year'));
//         const type = interaction.options.getString('type');
//         let result, message;

//         if (type === 'driver') {
//             result = driverinfo.find(d => d.year === name);
//             message = result?.info
//                 ? `**${year}** Driver Champion: **${result.champion} (${result.country})**`
//                 : result?.note || 'No data found.';

//         } else if (type === 'name') {
//             result = constructors.find(c => c.year === year);
//             message = result?.name
//                 ? `**${year}** Constructor Champion: **${result.name}**`
//                 : result?.note || 'No data found.';
//         }
//         await interaction.reply({ content: message });
//     }
// };