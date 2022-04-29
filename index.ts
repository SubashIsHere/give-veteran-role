import { Client, Intents } from "discord.js";
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});
import config from "./config";
import { GuildMember } from "discord.js";

client.on("ready", async () => {
  let whenMembersJoined = []; //placeholder

  let guild = client.guilds.cache.get(config.guildId);
  let allMembers = await guild.members.fetch();

  //get all the members and their join date
  allMembers.forEach((member) => {
    whenMembersJoined.push({
      member: member,
      joinedAt: member.joinedTimestamp,
    });
  });
  //sort the member in the join order
  whenMembersJoined.sort(function (a, b) {
    return a.joinedAt - b.joinedAt;
  });

  let configRolesKeys = Object.keys(config.roles);
  //give role to the members.
  for (let roleToGive = 0; roleToGive < configRolesKeys.length; roleToGive++) {
    for (
      let i = parseInt(configRolesKeys[roleToGive - 1]) || 0;
      i < parseInt(configRolesKeys[roleToGive]);
      i++
    ) {
      let role = guild.roles.cache.get(
        config.roles[configRolesKeys[roleToGive]]
      );
      if (whenMembersJoined[i] === undefined) {
        throw new Error(
          `There is no more member who can receive the role: '${role.name}'`
        );
      }
      let member = whenMembersJoined[i].member as GuildMember;

      member.roles.add(role);
      console.log(
        `\x1b[32m${member.user.tag}\x1b[0m got \x1b[32m${role.name}\x1b[0m`
      );
    }
  }
});

client.login(config.botToken);
