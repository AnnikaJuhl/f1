const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const driverinfo = require('../data/driverInfo')
const drivername = require('../data/driversByYearNames.json')
const driverstats = require('../data/driversByYearFull.json')
const driverc = require('../data/DRIVERc.json')
const wininfo = require('../data/driverwins.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('driver-history')
        .setDescription('Current and historic information on drivers!')
        .addStringOption(option =>
            option
                .setName('year')
                .setDescription('Select the year you want to learn about')
                .setAutocomplete(true)
                .setRequired(true))
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
                    { name: 'stats', value: 'stats-driver' },
                    { name: 'championships', value: 'championship-info' },
                    { name: 'wins', value: 'wins-info' },
                    { name: 'seasons', value: 'seasons-info' },
                    { name: 'teams', value: 'teams-info' }
                )),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const focusedName = focusedOption.name;
        const focusedValue = focusedOption.value;
        console.log('Focused Option:', focusedOption);

        if (focusedName === 'year') {
            const allYears = Object.keys(drivername).sort((a, b) => b - a);
            const filteredYears = allYears
                .filter(year => year.startsWith(focusedValue))
                .slice(0, 25)
                .map(year => ({ name: year, value: year }));
            return interaction.respond(filteredYears);
        }

        if (focusedName === 'driver') {

            const selectedYear = interaction.options.getString('year');
            if (!selectedYear || !drivername[selectedYear]) {
                return interaction.respond([]);
            }

            const newdriver = Array.from(new Set(drivername[selectedYear]));
            const filtered = newdriver
                .filter(name => name.toLowerCase().startsWith(focusedValue.toLowerCase()))
                .slice(0, 25)
                .map(name => ({
                    name,
                    value: name
                }));

            await interaction.respond(filtered);
            }

    },

    async execute(interaction) {
        const year = interaction.options.getString('year');
        const driver = interaction.options.getString('driver');
        const category = interaction.options.getString('category');
        const driversForYear = drivername[year] || [];

        const driverInfo = new EmbedBuilder()
        .setTitle(`Driver Information for ${drivername}`)
        .setColor(191954)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        if (!driversForYear || !driversForYear.includes(driver)) {
            return await interaction.reply({ content: 'No data found' });
        }
        console.log(category)
        if (category === 'drivers-info') {
            let driveinformation = driverinfo[interaction.options.getString('driver')]
            if (driveinformation.length > 2000) {
                driveinformation = driveinformation.split("\n")
                driveinformation.pop()
                driveinformation = driveinformation.join("\n")
            }
            driverInfo
            .setDescription(`${result.driver} won the Drivers Championship in ${result.year}`)
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

        if (category === 'stats-driver') {
            const driverstat = driverstats[interaction.options.getString('year')].filter(driver => driver.name == interaction.options.getString('driver'))[0]
            return interaction.reply(`${driver} is from ${driverstat.placeOfBirth} racing under nationality ${driverstat.nationalityCountryId.split('-').map(a => {
                return a[0].toUpperCase() + a.slice(1)
            }).join(" ")}. Their highest starting grid position was ${driverstat.bestStartingGridPosition} and had a highest race finish of ${driverstat.bestRaceResult}. `)
        }
        if (category === 'championship-info') {
            const champinfo = driverstats[interaction.options.getString('year')].filter(driver => driver.name == interaction.options.getString('driver'))[0]
            interaction.reply((champinfo.totalChampionshipWins > 0) ? `${interaction.options.getString('driver')} has won ${champinfo.totalChampionshipWins} championship${(champinfo.totalChampionshipWins > 1) ? "s" : ""} in the year${(champinfo.totalChampionshipWins > 1) ? "s" : ""}:\n${driverc.filter(drivercyear => drivercyear.champion == interaction.options.getString("driver")).map(drivercyear => drivercyear.year).join("\n")}`
                : `No wins, but a highest finish of ${champinfo.bestChampionshipPosition} with a total of ${champinfo.totalChampionshipPoints} championship points`) // ${champinfo.totalChampionshipPoints>1 ? "s" : ""}
        // } else {
        //     const message = `**${driver}** in **${year}**: data not implemented yet`;
        //     await interaction.reply({ content: message }
            // );
        }
        if (category === 'wins-info') {
            const driverName = interaction.options.getString('driver');
            const winsinfo = wininfo.find(d => d.driver === driverName);
            
            if(!winsinfo) {
                return interaction.repy('no data')
            }
            if (winsinfo.wins > 0) {
                return interaction.reply(`${driverName} has won ${winsinfo.wins} race${winsinfo.wins > 1 ? 's' : ''}`);
            } else {
                return interaction.reply(`${driverName}  has not won a race`);
            }

        }
    }
};