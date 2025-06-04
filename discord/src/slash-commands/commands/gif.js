const axios = require('axios')
const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Random driver moment")
    .addStringOption(option =>
        option.setName('driver')
        .setDescription('your choice')
        .setRequired(true)
        .addChoices(
            {name: 'Max-Verstappen', value:'gif_maxverstappenf1'},
            {name: 'Logan-Sargeant', value:'gif_logansargeantf1'},
            {name: 'Oscar-Piastri', value:'gif_oscarpiastrif1'},
            {name: 'Lewis-Hamilton', value:'gif_lewishamiltonf1'},
        )),
   
execute: (interaction) => {
        interaction.options.getString("Gif")
        axios.get(`https://g.tenor.com/v1/search?q=${interaction.options.getString("driver")}&key=LIVDSRZULELA&limit=10`).then(res =>
             {
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