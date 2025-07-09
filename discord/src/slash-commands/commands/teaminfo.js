const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const teamInfo = require('../data/af1db-seasons-entrants-drivers.json')
//use for autocomplete years, shows driver and team, and also which rounds they were in (bit unnecessary for this command)
const teamPerYear = require('../data/ateamsperyear.json')
//teams per year, could be useful for filtering?
const constructorActivity = require('../data/f1db-constructors-chronology.json')
//Shows years of activity per team 
const generalConstructor = require('../data/f1db-constructors.json')
//general data on constructors, very useful
const constructors = require('../data/CONSTRUCTORSTANDINGS.json');
//use this to see constructor standings OR maybe this one (../data/af1db-seasons-constructor-standings.json)
const driver = require('../data/driversByYearNames.json')
//use this for driver name or this one ('../data/driversByYearFull.json')

//DATA TO GATHER: Team principal per year, driver numbers per year (useful for driver command too!)

const footer = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/carfooter.jpeg')
const footers = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-AssRaests/refs/heads/main/Landscapetrack.jpeg')
const logo = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/f1-abu-dhabi-gp-2017-f1-logo-6614911-removebg-preview.png')
//used for general images, find new ones soon. So tempted to gather individual team pictures 

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
        const focused = interaction.options.getFocused(true);
        console.log('Focused Option:', focused);
        const focusedName = focused.name;
        const focusedValue = focused.value;

        if (focusedName === 'year') {
            const allYears = Array.from(
                new Set(teamInfo
                    .map(entry => entry.year)))
                .sort((a, b) => a - b);

            const yearsFiltered = allYears
                .filter(year => year
                    .toString()
                    .startsWith(focusedValue))
                .slice(0, 25)
                .map(year => ({
                    name: year.toString(),
                    value: year.toString()
                }));
            return await interaction.respond(yearsFiltered);
        }

        if (focusedName === 'team') {

            const selectedYear = interaction.options.getString('year');

            if (!selectedYear)
                return await interaction.respond([]);

            const teamsForYear = teamInfo
                .filter(entry => entry.year.toString() === selectedYear)
                .map(entry => entry.constructorId);

            const eachTeam = Array.from(new Set(teamsForYear)).sort();

            const filteredTeam = eachTeam
                .filter(team => team.toLowerCase().startsWith(focusedValue.toLowerCase()))
                .slice(0, 25)
                .map(team => ({
                    name: team,
                    value: team
                }));
            return await interaction.respond(filteredTeam);
        }
    },

    async execute(interaction) {
        const year = interaction.options.getString('year');
        const team = interaction.options.getString('team');

        let filtered = teamInfo.filter(entry => entry.year.toString() === year);

        if (team) {
            filtered = filtered.filter(entry => entry.constructorId === team || entry.entrantId === team)
        }

        const drivers = Array.from(new Set(filtered
            .map(entry => entry.driverId)
        ));

        const formattedDriver = drivers
            .map(name => name
                .split('-')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')
            );

        const driverList = formattedDriver.length > 0
            ? formattedDriver.join('\n')
            : 'No drivers'

        const embed = new EmbedBuilder()
            .setThumbnail(logo)
            .setTitle(`Information on ${entry.constructorId}`)
            .setColor('000435')
            .setDescription(`Drivers for (driverList)`)
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setImage(footers)
            .setTimestamp();

       return await interaction.reply({ embeds: [embed] });
    }
}