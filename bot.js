var Discord = require('discord.js')
var logger = require('winston')
var auth = require('./auth.json')

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console(), { colorize: true })
logger.level = 'debug'

var client = new Discord.Client({
    token: auth.token,
    autorun: true
})

client.on('ready', function(evt) {
    logger.info("Connected")
})

client.on("message", msg => {
    let messageText = msg.content
    if (messageText.substr(0,1) === "|") {
        let args = messageText.substr(1).split(" ")
        let cmd = args[0]
        args = args.splice(1)

        switch(cmd) {
            case "ping":
                pong(msg)
                break
            case "join":
                join(msg, args)
                break
        }
    }
})

function pong(msg) {
   msg.reply("pong!") 
}

function join(msg, args) {
    if (!args[0]) return
    let room = args[0]
    let type = args[1]

    let server = msg.guild
    server.createChannel(room, { type })
        .then(channel => {
            channel.overwritePermissions(
                msg.guild.roles.find(it => it.name === "@everyone"), 
                {
                    "CREATE_INSTANT_INVITE": false,
                    "VIEW_CHANNEL": false,
                    "CONNECT": false,
                    "SPEAK": false
                }
            )
            .then(channel => {
                channel.overwritePermissions(
                    msg.member.user.id,
                    {
                        "CREATE_INSTANT_INVITE": true,
                        "VIEW_CHANNEL": true,
                        "CONNECT": true,
                        "SPEAK": true
                    }
                )
            })
        })
}

client.login(auth.token)