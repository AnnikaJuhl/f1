const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const info = require('../data/af1db-races.json')
const drivers = require('../data/af1db-seasons-driver-standings')
const constructor = require('../data/af1db-seasons-constructor-standings')
const races = require('../data/aracestandings')

const footer = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/carfooter.jpeg')
const footers = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/Landscapetrack.jpeg')
const logo = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/main/formula1logo.jpg')

const liveSeason = require('./liveseason')

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
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('race')
                        .setDescription('View standings for a specific race')
                        .setAutocomplete(true))
                .addStringOption(option =>
                    option
                        .setName('championship-type')
                        .setDescription('Which championship do you want to see?')
                        .addChoices(
                            { name: 'Constructor', value: 'const-standing' },
                            { name: 'Driver', value: 'driver-stand' }
                        )
                )),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused(true);

        if (focusedValue.name === 'year') {
            const allYears = [...new Set(info
                .map(item => item.year))]
                .filter(year => year !== undefined && year !== null)
                .sort((a, b) => b - a);

            const filtered = allYears
                .filter(year => year.toString().startsWith(focusedValue.value))
                .slice(0, 25)
                .map(year => ({
                    name: year.toString(),
                    value: year.toString()
                }));

            return interaction.respond(filtered);

        } else if (focusedValue.name === 'session') {
            const allRaces = [...new Set(info
                .map(item => item.grandPrixId))]
                .filter(id => id !== undefined && id !== null)
                .sort();

            const filtered = allRaces
                .filter(race => race.toLowerCase().startsWith(focusedValue.value.toLowerCase()))
                .slice(0, 25)
                .map(race => ({
                    name: race,
                    value: race
                }));

            return interaction.respond(filtered);
        }
    },

    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'calendar') {
                const year = parseInt(interaction.options.getString('year'));
                const races = info.filter(d => d.year === year);

                if (races.length === 0) {
                    return interaction.reply(`No races for ${year}`);
                }

                if (year === 2025 ) {
                    return liveSeason.execute(interaction);
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

                const seasonEmbed = new EmbedBuilder()
                    .setThumbnail(logo)
                    .setTitle(`Season calendar for ${year}`)
                    .setColor('000435')
                    .setDescription(raceList)
                    .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                    .setImage(footers)
                    .setTimestamp();

                return await interaction.reply({ embeds: [seasonEmbed] });
            }

            if (subcommand === 'standings') {
                const year = parseInt(interaction.options.getString('year'));
                const type = interaction.options.getString('championship-type');

                if (type === 'driver-stand') {
                    const filteredDriver = drivers
                        .filter(d => d.year === year)
                        .sort((a, b) => a.positionNumber - b.positionNumber);

                    if (filteredDriver.length === 0) {
                        return interaction.reply({ content: `No driver standings found for ${year}.`, ephemeral: true });

                    }

                    const standList = filteredDriver
                        .map(driver => {
                            const prettyName = driver.driverId
                                .split('-')
                                .map(part => part[0].toUpperCase() + part.slice(1))
                                .join(' ');

                            return `**Position ${driver.positionNumber}:** ${prettyName} with ${driver.points} point${(driver.points !== 1) ? "s" : ""}`;
                        })
                        .join('\n\n');

                    const standEmbed = new EmbedBuilder()
                        .setThumbnail(logo)
                        .setTitle(`Standings for ${year}`)
                        .setColor('000435')
                        .setDescription(standList)
                        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                        .setImage(footers)
                        .setTimestamp();

                    await interaction.reply({ embeds: [standEmbed] });
                }

                if (type === 'const-standing') {
                    const filteredConst = constructor
                        .filter(d => d.year === year)
                        .sort((a, b) => a.positionNumber - b.positionNumber);

                    if (filteredConst.length === 0) {
                        return await interaction.reply({ content: `No constructor standings found for ${year}.`, ephemeral: true });
                    }
                    const standList = filteredConst
                        .map(constructors => {
                            const prettyName = constructors.constructorId
                                .split('-')
                                .map(part => part[0].toUpperCase() + part.slice(1))
                                .join(' ');

                            return `**Position ${constructors.positionNumber}:** ${prettyName} with ${constructors.points} point${(constructors.points !== 1) ? "s" : ""}`;
                        })
                        .join('\n\n');

                    standEmbed
                        .setDescription('standList')

                    await interaction.reply({ embeds: [standEmbed] });
                }
            }

            if (type === 'race') {
                // const sessionId = interaction.options.getString('session');
                const year = parseInt(interaction.options.getString('year'));
                const race = info.find(races => races.grandPrixId === sessionId);

                if (!race) {
                    return interaction.reply({ content: `No race found with session ID "${sessionId}".`, ephemeral: true });
                }

                const raceEmbed = new EmbedBuilder()
                    .setTitle(`Season information for ${year}`)
                    .setColor(0x8b0000)
                    .setTimestamp()
                    .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

                return interaction.reply({ embeds: [raceEmbed] });
            }
        } catch (err) {
            console.error('Error executing command:', err);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Something went wrong.', ephemeral: true });
            }
        }
    }
};