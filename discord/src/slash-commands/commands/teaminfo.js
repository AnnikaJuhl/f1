const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const teamInfo = require("../data/af1db-seasons-entrants-drivers.json");
//use for autocomplete years, shows driver and team, and also which rounds they were in (bit unnecessary for this command)
const teamPerYear = require("../data/ateamsperyear.json");
//teams per year and team principals
const constructorActivity = require("../data/f1db-constructors-chronology.json");
//Shows years of activity per team
const generalConstructor = require("../data/f1db-constructors.json");
//general data on constructors, very useful
const constructors = require("../data/CONSTRUCTORSTANDINGS.json");
//use this to see constructor standings OR maybe this one (../data/af1db-seasons-constructor-standings.json)
const driver = require("../data/driversByYearNames.json");
//use this for driver name or this one ('../data/driversByYearFull.json')
const principal = require("../data/ateamprincipals.json");

//DATA TO GATHER: Team principal per year, driver numbers per year (useful for driver command too!)

const footer =
  "https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/carfooter.jpeg";
const footers =
  "https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/Landscapetrack.jpeg";
const logo =
  "https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/f1-abu-dhabi-gp-2017-f1-logo-6614911-removebg-preview.png";
//used for general images, find new ones soon. So tempted to gather individual team pictures

module.exports = {
  data: new SlashCommandBuilder()
    .setName("team-info")
    .setDescription("Current and historic information on teams")
    .addStringOption((option) =>
      option
        .setName("year")
        .setDescription("Select a year you want to learn about")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("Select what team you want to learn about!")
        .setAutocomplete(true)
        .setRequired(true)
    ),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused(true);
    console.log("Focused Option:", focused);
    const focusedName = focused.name;
    const focusedValue = focused.value.trim();

    const uniqueYears = [
      ...new Set(teamInfo.map((entry) => entry.year.toString())),
    ].sort((a, b) => b - a);

    if (focusedName === "year") {
      const matches = uniqueYears
        .filter(y => y.startsWith(focusedValue || ''))
        .slice(0, 25)
        .map((y) => ({ name: y, value: y }));

      if (matches.length === 0) {
        return interaction.respond([
          { name: "No matching year", value: focusedValue || "none" },
        ]);
      }
      return interaction.respond(matches);
    }

    if (focusedName === "team") {
      const selectedYear = interaction.options.getString("year");

      if (!selectedYear) return interaction.respond([]);

      const teamsForYear = teamInfo
        .filter((entry) => entry.year.toString() === selectedYear)
        .map((entry) => entry.constructorId);

      const eachTeam = Array.from(new Set(teamsForYear)).sort();

      const filteredTeam = eachTeam
        .filter((team) =>
          team.toLowerCase().startsWith(focusedValue.toLowerCase())
        )
        .slice(0, 25)
        .map((team) => ({
          name: team
            .split("-")
            .map((pteam) => pteam.charAt(0).toUpperCase() + pteam.slice(1))
            .join(" "),
          value: team,
        }));
      return await interaction.respond(filteredTeam);
    }
  },

  async execute(interaction) {
    const year = interaction.options.getString("year");
    const team = interaction.options.getString("team");

    let filtered = teamInfo.filter((entry) => entry.year.toString() === year);

    if (team) {
      filtered = filtered.filter(
        (entry) => entry.constructorId === team || entry.entrantId === team
      );
    }

    const drivers = Array.from(
      new Set(filtered.map((entry) => entry.driverId))
    );
    const formattedDriver = drivers.map((name) =>
      name
        .split("-")
        .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
        .join(" ")
    );

    const driverList =
      formattedDriver.length > 0 ? formattedDriver.join("\n") : "No drivers";

    const formattedTeam = team
      .split("-")
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" ");

    const yearInt = parseInt(year);

    const principalEntry = principal.find((entry) => entry.year === yearInt);
    const teamEntry = principalEntry?.teams?.find(
      (t) => t.team.toLowerCase() === formattedTeam.toLowerCase()
    );

    const principalArray = Array.from(
      new Set(
        principal
          .map((p) => p.principals)
          .filter((p) => typeof p === "string" && p.trim() !== "")
      )
    );

    const formattedPrincipals = teamEntry?.principal;
    teamEntry.principal
      .map((p) => p.split("-").map(capitalize).join(" "))
      .join("\n")
      ? teamEntry.principal.split("-").map(capitalize).join(" ")
      : "Unknown";

    const embed = new EmbedBuilder()
      .setThumbnail(logo)
      .setTitle(`Information on ${formattedTeam} - (${year})`)
      .setColor("000435")
      .addFields(
        { name: "**Drivers:**", value: driverList || "Unknown", inline: true },
        {
          name: "**Team Principal:**",
          value: `${formattedPrincipals}` || "Unknown",
          inline: true,
        }
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setImage(footers)
      .setTimestamp();

    return await interaction.reply({ embeds: [embed] });
  },
};
