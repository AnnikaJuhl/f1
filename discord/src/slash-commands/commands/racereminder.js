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

            function toTitleCase(str) {
                return str
                    .toLowerCase()
                    .split(' ')
                    .map(word => {
                        if (word.length === 0) return '';
                        return word[0].toUpperCase() + word.slice(1);
                    })
                    .join(' ');
            }

            if (!next) {
                return interaction.reply('No sessions upcoming')
            }

            const fullName = next.event_name;
            const [grandPrixPart, sessionPartRaw] = fullName.split(' - ');
            const sessionPart = sessionPartRaw
                ? sessionPartRaw.charAt(0).toUpperCase() + sessionPartRaw?.slice(1).toLowerCase()
                : 'Session';

            const cleanedName = grandPrixPart
                .replace(/^FORMULA 1\s+/i, '')
                .replace(/\b20\d{2}\b/g, '')
                .trim();
            const grandPrixName = toTitleCase(cleanedName);

            const startTime = new Date(next.start_time);
            const nowTime = new Date();
            const reminderDelay = startTime.getTime() - nowTime.getTime() - (10 * 60 * 1000);

            if (selectedValue.includes('remind')) {

                if (reminderDelay <= 0) {
                    await interaction.reply(`**Hurry**, ${grandPrixName} starts in less than 10 minutes!`);
                    return;
                }
                await interaction.reply(`I'll remind you 10 minutes before ${grandPrixName} - ${sessionPart} starts`)

                setTimeout(async () => {
                    try {
                        await interaction.user.send(`${interaction.user.username} buckle up, **${grandPrixName}** - **${sessionPart}** starts in 10 minutes!`)
                    } catch (err) {
                        console.error('Could not send remind')
                    }
                }, reminderDelay);
                return;
            }

            const unix = Math.floor(startTime.getTime() / 1000);

            const countEmbed = new EmbedBuilder()
                .setTitle(`Countdown to ${grandPrixName}`)
                .setThumbnail(logo)
                .setDescription(
                    iscount
                        ? `**${grandPrixName}** starts <t:${unix}:R> on <t:${unix}:F>`
                        : `**${grandPrixName}**  is scheduled on <t:${unix}:F>`
                )
                .setColor(0x8b0000)
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

