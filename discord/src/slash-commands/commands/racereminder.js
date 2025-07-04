const { SlashCommandBuilder, EmbedBuilder, ReactionCollector, Embed } = require('discord.js')

const remind = require('upcoming2025')

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
                    { name: 'remind', value: 'rremind' }))
}

async execute(interaction) {
    try {

        const options = ['practice', 'qualification', 'sprint', 'race'];

        let selectedValue = null;
        for (const opt of options) {
            const val = interaction.options.getString(opt);
            if (val) {
                selectedValue = val;
                break;
            }
        }

        if (!selectedValue) {
            return interaction.reply('Option not valid')
        }


        if (selectedValue.endsWith('count')) {

            const countEmbed = new Embed()
                .setTitle(`Starting countdown for ${val}`)
                .setDescription(`**${next.name}** starts <t:${unix}:R> on <t:${unix}:F>`)
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
                .setImage(footer)

        } else {

        }
        // const option = interaction.options.getString('reminders');

        // const countdown = new EmbedBuilder()
        //     .setTitle('Session countdown!')
        //     .setTimeStamp()
        //     .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })

        // if (option === 'practice') {
        //     const type = interaction.options.getString('countdown')
        //     const upcomingSessions = remind.filter(d => new Date(d.start_time).getTime() > new Date().getTime());


        //     if (upcomingSessions.length === 0) {
        //         return interaction.reply('No upcoming races');
        //     }
        // }


        return interaction.reply(`${event_name} takes place on ${start_time}`);
    } catch (err) {
        console.error(err);
        return interaction.reply('Flat tire! Missing data')
    }
}

