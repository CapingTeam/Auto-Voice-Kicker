const discord = require('discord.js-selfbot-v13')
const client = new discord.Client({checkUpdate: false})

const config = require('./config')

const token = config.token || process.env.token
if (!token) throw new TypeError("Please put your token in the config file")

let prefix = config.prefix || process.env.prefix
if (!prefix) prefix = "+"

const consolecolor = require('gradient-string')

const fs = require('fs')

if (!fs.existsSync("./Data")) fs.mkdirSync("./Data");
if (!fs.existsSync("./Data/list.json")) fs.writeFileSync(`./Data/list.json`, '{\n   "users": []\n}');

const globale = require('./Data/list.json')

function saveglobale() {
    fs.writeFile("./Data/list.json", JSON.stringify(globale), err => {
        if (err) console.log(err);
    });
  }

client.login(token).catch(() => console.log(consolecolor("#0330fc", "#0398fc")("[!] invalid token ! please put a new one in the config file")))


client.on('ready', () => {
    console.clear()
    console.log(consolecolor("#0330fc", "#0398fc")(`
        :::     :::  :::::::: ::::::::::: ::::::::  ::::::::::      :::    ::: ::::::::::: ::::::::  :::    ::: 
        :+:     :+: :+:    :+:    :+:    :+:    :+: :+:             :+:   :+:      :+:    :+:    :+: :+:   :+:  
        +:+     +:+ +:+    +:+    +:+    +:+        +:+             +:+  +:+       +:+    +:+        +:+  +:+   
        +#+     +:+ +#+    +:+    +#+    +#+        +#++:++#        +#++:++        +#+    +#+        +#++:++    
         +#+   +#+  +#+    +#+    +#+    +#+        +#+             +#+  +#+       +#+    +#+        +#+  +#+   
          #+#+#+#   #+#    #+#    #+#    #+#    #+# #+#             #+#   #+#      #+#    #+#    #+# #+#   #+#  
            ###      ######## ########### ########  ##########      ###    ### ########### ########  ###    ###`))
        console.log(consolecolor("#0330fc", "#0398fc", "#0330fc", "#0398fc", "#0330fc")("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))
        console.log(consolecolor("#0330fc", "#0398fc")(`
                                        [+] Username: ${client.user.username}
                                        [+] Prefix:   ${prefix}
                                        [+] Bio:      ${client.user.bio}

                                        [+] Friends:  ${client.relationships.friendCache.size}
                                        [+] Guilds:   ${client.guilds.cache.size}
                                        [+] Channels: ${client.channels.cache.size}
                                        [+] Users:    ${client.users.cache.size}`))
        console.log(consolecolor("#0330fc", "#0398fc")("\n{ Logs: } \n"))
                                    })


    client.on('messageCreate', async message => {
        if (message.author.id !== client.user.id) return;

        var messageArray = message.content.split(" ");
        var args = messageArray.slice(1);

        if (message.content.startsWith(prefix + "add user")){
            message.delete().catch(() => false)
            if (!message.guild) return message.channel.send("This command can only be used on a `server`").catch(() => false)
            let user = message.mentions.users.first() || client.users.cache.get(args[1])
            if (!user) return message.channel.send(`No users found for: \`${args[1] || "rien"}\``).catch(() => false)

            if (!fs.existsSync(`./Data/${message.guild.id}.json`)) fs.writeFileSync(`./Data/${message.guild.id}.json`, '{\n   "users": []\n}');

            const guildfile = require(`./Data/${message.guild.id}.json`)

                  function save() {
        fs.writeFile(`./Data/${message.guild.id}.json`, JSON.stringify(guildfile), err => {
            if (err) console.log(err);
        });
      }

            if (guildfile["users"].includes(user.id)) return message.channel.send(`${user.username} is already in the list`).catch(() => false)
            guildfile["users"].push(user.id)
            save()
            message.channel.send(`${user.username} has been added to the list`).catch(() => false)

            if (globale["users"].includes(user.id)) return;
            else{
                globale["users"].push(user.id)
                saveglobale()
            }
        }

        if (message.content.startsWith(prefix + "list user")){
            if (globale["users"].length < 1){
                var slt = "Nobody"
            }
            else{
                var slt = globale["users"].map((e, i) => `[${i + 1}]〢${e} (${client.users.cache.get(e).username})`).join("\n")
            }
           message.channel.send("```"+slt+"```").catch(() => false)
        }

        if (message.content.startsWith(prefix + "remove user")){
            message.delete().catch(() => false)
            if (!message.guild) return message.channel.send("This command can only be used on a `server`").catch(() => false)
            let user = message.mentions.users.first() || client.users.cache.get(args[1])
            if (!user) return message.channel.send(`No users found for: \`${args[1] || "rien"}\``).catch(() => false)

            if (!fs.existsSync(`./Data/${message.guild.id}.json`)) return message.channel.send("No member of this server is on the list").catch(() => false)

            const guildfile = require(`./Data/${message.guild.id}.json`)

                  function save() {
        fs.writeFile(`./Data/${message.guild.id}.json`, JSON.stringify(guildfile), err => {
            if (err) console.log(err);
        });
      }

            if (!guildfile["users"].includes(user.id)) return message.channel.send(`${user.username} is not in the list`).catch(() => false)
            guildfile["users"].splice(guildfile["users"].indexOf(user.id), 1)
            save()
            message.channel.send(`${user.username} has been removed from the list`).catch(() => false)

            if (!globale["users"].includes(user.id)) return;
            else{
                globale["users"].splice(globale["users"].indexOf(user.id), 1)
                saveglobale()
            }     
        }

        if (message.content === prefix + "help"){
            message.delete().catch(() => false)
            if (config.mode === "embed"){
                var texte = new discord.WebEmbed()
                .setTitle("Auto Voice Kick")
                .setDescription(`
                𝙝𝙚𝙡𝙥
                Displays all orders

                𝙖𝙙𝙙 𝙪𝙨𝙚𝙧 <@𝙪𝙨𝙚𝙧>
                Adds a user to the list

                𝙧𝙚𝙢𝙤𝙫𝙚 𝙪𝙨𝙚𝙧 <@𝙪𝙨𝙚𝙧>
                Remove a user from the list

                𝙡𝙞𝙨𝙩 𝙪𝙨𝙚𝙧
                Displays users in the list of banned members (voice channels)
                `)
                .setThumbnail("https://i.imgur.com/QmxXQae.gif")
            }
            else{
                var texte = "```"+
                `𝙝𝙚𝙡𝙥               〢Displays all orders
𝙖𝙙𝙙 𝙪𝙨𝙚𝙧 <@𝙪𝙨𝙚𝙧>   〢Adds a user to the list
𝙧𝙚𝙢𝙤𝙫𝙚 𝙪𝙨𝙚𝙧 <@𝙪𝙨𝙚𝙧>〢Remove a user from the list
𝙡𝙞𝙨𝙩 𝙪𝙨𝙚𝙧            〢Displays users in the list of banned members (voice)`
                +"```"
            }
            if (config.mode === "embed") return message.channel.send({embeds: texte}).catch(() => false)
            else return message.channel.send(texte).catch(() => false)
        }
    })


    client.on("voiceStateUpdate", async (newState, oldState) => {
        if (!newState) return;
        if (!newState.guild) return;
        if (newState === oldState) return;
        if (!fs.existsSync(`./Data/${newState.guild.id}.json`)) return;
        const guildfile = require(`./Data/${newState.guild.id}.json`)
          let user = newState.guild.members.cache.get(newState.member.id)
          if (!user) return;
          if (guildfile["users"].includes(user.id)){
          user.voice.disconnect(`https://github.com/orgs/CappingTeam`).catch((err) => console.log(consolecolor("#0330fc", "#0398fc")(user.user.username + " could not be disconnected. Error: " + err)))
        }
      })