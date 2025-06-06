// const { SlashCommandBuilder } = require('discord.js')
// const driverNames = require('../f1db-seasons.json');

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('wiki')
//     .setDescription('Information on all things F1')
//     .addStringOption(option =>
//       option
//         .setName('season')
//         .setDescription('What year are you interested in?')
//         .setAutocomplete(true)
//     ),

//   async autocomplete(interaction) {
//     const focusedValue = interaction.options.getFocused();
//     const seasons = await fetchSeasons();
//     const filtered = seasons
//       // .filter(seasons => seasons.year.toString().startsWith(focusedValue))
//       // .map(seasons => ({ name: seasons.year.toString(), value: seasons.year.toString() }));

//     await interaction.respond(filtered.slice(0, 25).map(seasons => ({ seasons, value:seasons }))
//     ),
//   };

//   async execute(interaction) {
//     const selected = interaction.options.getString('season');
//     console.log(`User selected season: ${selected}`);
//     await interaction.reply(`You selected: ${selected}`);
//   },
// };

//  const choices = 
//     ['Driver: First and last name',
//       'Team: Name and principal',
//     ];
//     const filtered = choices.filter(choice => 
//       choice.toLowerCase().startsWith(focusedValue.toLowerCase())
//     ).slice(0,25);
//     await interaction.respond(
// 			filtered.map(choice => ({ name: choice, value: choice })),
//       console.log('Autocomplete triggered with input:', focusedValue),
//     )
//   }
// async function fetchSeasons() {
//   if (!data) {
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`Data from GitHub could not be fetched: ${response.statusText}`);
//     }
//     data = await response.json();
//   }
//   return data
// }


//    console.log('Autocomplete triggered:', focusedValue);

//     const choices = 
//     ['Driver: First and last name',
//       'Team: Name and principal',
//     ];
//     const filtered = choices.filter(choice => 
//       choice.toLowerCase().startsWith(focusedValue.toLowerCase())
//     ).slice(0,25);
//     await interaction.respond(
// 			filtered.map(choice => ({ name: choice, value: choice })),
//       console.log('Autocomplete triggered with input:', focusedValue),
//     );

  
// 		const driverName = interaction.options.getString('driver-name');
// 		await interaction.reply(`You selected: ${driverName}`);
//       },
//     }; 


//    const filtered = drivers.filter(driver =>
//       driver.toLowerCase().startsWith(focusedValue.toLowerCase())
//     );
//     await interaction.respond(
//       filtered.slice(0,25).map(driver => ({ name: driver, value: driver}) )
//     )
// 	},


// // const { SlashCommandBuilder} = require('discord.js');
// // fetch('https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158')
// //   .then(response => response.json())
// //   .then(jsonContent => console.log(jsonContent));

// //   module.exports = {
// //     data: new SlashCommandBuilder()
// //     .setName("wiki")
// //     .set Description("All the information you could want!")
// //     .addStringOption(option =>
// //         option.setName('driver-name')
// //         .setDescription('Information on all current and past Formula 1 drivers')
// //         .setAutocomplete('Phrase to search for')
// //         .setAutocomplete(true));

// //         option.setName('season')
// //         .setDescription('What year?')
// //         .setRequired(true)
// //         .addChoices(
// //             {name: '2024-season', value:'https://api.openf1.org/v1/drivers?year=2024&csv=true'},
// //             {name: '2023-season', value:'https://api.openf1.org/v1/drivers?year=2023&csv=true'},
// //             {name: '2022-season', value:'https://api.openf1.org/v1/drivers?year=2022&csv=true'},
// //             {name: '2021-season', value:'https://api.openf1.org/v1/drivers?year=2021&csv=true'},
// //             {name: '2020-season', value:'https://api.openf1.org/v1/drivers?year=2020&csv=true'},
// //             {name: '2019-season', value:'https://api.openf1.org/v1/drivers?year=2019&csv=true'},
// //             {name: '2018-season', value:'https://api.openf1.org/v1/drivers?year=2018&csv=true'},
// //             {name: '2017-season', value:'https://api.openf1.org/v1/drivers?year=2017&csv=true'},
// //             {name: '2016-season', value:'https://api.openf1.org/v1/drivers?year=2016&csv=true'},
// //             {name: '2015-season', value:'https://api.openf1.org/v1/drivers?year=2015&csv=true'},
// //             {name: '2014-season', value:'https://api.openf1.org/v1/drivers?year=2014&csv=true'},
// //             {name: '2013-season', value:'https://api.openf1.org/v1/drivers?year=2013&csv=true'},
// //             {name: '2012-season', value:'https://api.openf1.org/v1/drivers?year=2012&csv=true'},
// //             {name: '2011-season', value:'https://api.openf1.org/v1/drivers?year=2011&csv=true'},
// //             {name: '2010-season', value:'https://api.openf1.org/v1/drivers?year=2010&csv=true'},
// //             {name: '2009-season', value:'https://api.openf1.org/v1/drivers?year=2009&csv=true'},
// //             {name: '2008-season', value:'https://api.openf1.org/v1/drivers?year=2008&csv=true'},
// //             {name: '2007-season', value:'https://api.openf1.org/v1/drivers?year=2007&csv=true'},
// //             {name: '2006-season', value:'https://api.openf1.org/v1/drivers?year=2006&csv=true'},
// //             {name: '2005-season', value:'https://api.openf1.org/v1/drivers?year=2005&csv=true'},
// //             {name: '2004-season', value:'https://api.openf1.org/v1/drivers?year=2004&csv=true'},
// //             {name: '2003-season', value:'https://api.openf1.org/v1/drivers?year=2003&csv=true'},
// //             {name: '2002-season', value:'https://api.openf1.org/v1/drivers?year=2002&csv=true'},
// //             {name: '2001-season', value:'https://api.openf1.org/v1/drivers?year=2001&csv=true'},
// //             {name: '2000-season', value:'https://api.openf1.org/v1/drivers?year=2000&csv=true'},
// //         )),

// //     execute: (interaction) => {
// //         interaction.options.getString("wiki")



// //         const { SlashCommandBuilder } = require("discord.js")
// // module.exports = {
// //   data: new SlashCommandBuilder()
// //   .setName('daniel-riccardo')
// //   .setDescription('Information on Daniel Riccardo'),
// //   async execute(interaction) {
// //   await interaction.reply('kikira.')}}
  