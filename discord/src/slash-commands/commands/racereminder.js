const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const remind = require('../data/upcoming2025.json')

const footer = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/carfooter.jpeg')
const footers = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/Landscapetrack.jpeg')
const logo = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/f1-abu-dhabi-gp-2017-f1-logo-6614911-removebg-preview.png')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reminders')
        .setDescription('Provides reminders and countdowns for free practices, quali, sprints, and races')
        .addStringOption(option =>
            option
                .setName('practice')
                .setDescription('Countdown and reminder for upcoming free practices')
                .addChoices(
                    { name: 'countdown', value: 'pcount' },
                    { name: 'remind', value: 'premind' }))
        .addStringOption(option =>
            option
                .setName('qualification')
                .setDescription('Countdown and reminder for upcoming quali')
                .addChoices(
                    { name: 'countdown', value: 'qcount' },
                    { name: 'remind', value: 'qremind' }))
        .addStringOption(option =>
            option
                .setName('sprint')
                .setDescription('Countdown and reminder for upcoming sprint')
                .addChoices(
                    { name: 'countdown', value: 'scount' },
                    { name: 'remind', value: 'sremind' }))
        .addStringOption(option =>
            option
                .setName('race')
                .setDescription('Countdown and reminder for upcoming race')
                .addChoices(
                    { name: 'countdown', value: 'rcount' },
                    { name: 'remind', value: 'rremind' })),

    async execute(interaction) {
        try {
            const options = ['practice', 'qualification', 'sprint', 'race'];

            let sessionName = null;
            let selectedValue = null;

            for (const opt of options) {
                const value = interaction.options.getString(opt);
                if (value) {
                    sessionName = opt;
                    selectedValue = value;
                    break;
                }
            }

            if (!selectedValue || !sessionName) {
                return interaction.reply('Option not valid');
            }

            const iscount = selectedValue.includes('count');

            const fuzzynext = {
                race: ['race'],
                sprint: ['sprint'],
                qualification: ['qualifying', 'sprint shootout', 'shootout', 'sprint qualifying'],
                practice: ['practice 1', 'practice 2', 'practice 3', 'free practice', 'practice']
            };

            const keywords = fuzzynext[sessionName];
            const now = new Date();

            const upcoming = remind
                .filter(event => {
                    const name = event.event_name.toLowerCase();
                    const eventTime = new Date(event.start_time);

                    if (eventTime <= now) return false;
                    return keywords.some(keyword => name.includes(keyword));
                })
                .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

            const next = upcoming[0];


            if (!next) {
                return interaction.reply('No sessions upcoming')
            }

            const unix = Math.floor(new Date(next.start_time).getTime() / 1000);

            const countEmbed = new EmbedBuilder()
                .setTitle(`Countdown for ${sessionName.toUpperCase()}`)
                .setDescription(
                    iscount
                        ? `**${next.event_name}** ${sessionName} starts <t:${unix}:R> on <t:${unix}:F>`
                        : `**${next.event_name}** ${sessionName} is scheduled on <t:${unix}:F>`
                )
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
                .setImage(footer);

            return interaction.reply({ embeds: [countEmbed] });

        } catch (err) {
            console.error(err);
            return interaction.reply('Flat tire, missing data!');
        }
    }
}

