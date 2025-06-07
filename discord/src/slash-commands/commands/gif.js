const axios = require('axios')
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gif")
        .setDescription("Random driver moment")
        .addStringOption(option =>
            option.setName('driver')
                .setDescription('your choice')
                .setRequired(true)
                .addChoices(
                    { name: 'Random', value: 'gif_formula1' },
                    { name: 'Crash', value: 'gif_formula1crash' },
                    { name: 'Funny', value: 'gif_funnyformula1' },
                    { name: 'Victory', value: 'gif_formula1victory' },
                    { name: 'Podium', value: 'gif_formula1podium' },
                )),

    execute: (interaction) => {
        interaction.options.getString("Gif")
        axios.get(`https://g.tenor.com/v1/search?q=${interaction.options.getString("driver")}&key=LIVDSRZULELA&limit=25`).then(res => {
            const results = res.data.results
                const url = results[Math.floor(results.length*Math.random()+1)].url
                interaction.reply(url??"random", {
                    ephemeral: false


                    //              .catch(error => {
                    // console.error("Error fetching data:", error);
                    // interaction.reply("Sorry, something went wrong while fetching the random Formula 1 moment.");
                    //              })
                })
            })

        }
    }