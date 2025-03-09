const { Client } = require('discord.js-selfbot-v13');
const { GatewayIntentBits } = require('discord.js');

const ms = require('ms');

const logger = console;
const Timer = require('./timers');
const config = require('./config');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    logger.log('Bot is ready');
});

const lastTuResults = new Map();

client.on('messageCreate', async (message) => {
    if (message.channel.id !== config.CHANNEL_ID) return;
    if (message.author.id !== config.MUDAE_ID) return;

    const messageContent = message.content;
    if (!messageContent.includes('**manouellatrouell**,')) return



    const regexes = {
        username: /\*\*(\w+)\*\*,/,
        claim: /(can't|__can__) claim(?: for another \*\*(\d+)(?:h )?(\d+)?\*\* min| right now!)/,
        rolls: /You have \*\*(\d+)\*\* rolls(?: \(.*?\))? left\. Next rolls reset in \*\*(\d+)?(?:h )?(\d+)?\*\* min/,
        rtCooldown: /Time left: \*\*(\d+h)? ?(\d+)?\*\* min/,
        kakeraAvailable: /You (can't|__can__) react to kakera(?: for \*\*(\d+)\*\* min| right now!)/,
        power: /Power: \*\*(\d+%)\*\*/,
        kakeraStock: /Stock: \*\*(\d+)\*\*<:kakera:\d+>/,
        dailyReset: /\$daily is available!/,
        dkReset: /\$dk is ready!/
    };

    const results = {
        username: messageContent.match(regexes.username)?.[1],
        claimAvailable: messageContent.match(regexes.claim)?.[1] === "__can__" ? "can" : "can't",
        claimReset: messageContent.match(regexes.claim)?.[2]
            ? `${messageContent.match(regexes.claim)?.[2] || ''} ${messageContent.match(regexes.claim)?.[3] || ''}`.trim()
            : "ready",
        rollsLeft: messageContent.match(regexes.rolls)?.[1],
        rollsReset: `${messageContent.match(regexes.rolls)?.[2] || ''} ${messageContent.match(regexes.rolls)?.[3] || ''}`.trim(),
        rtCooldown: `${messageContent.match(regexes.rtCooldown)?.[1] || ''} ${messageContent.match(regexes.rtCooldown)?.[2] || ''}`.trim(),
        kakeraAvailable: messageContent.match(regexes.kakeraAvailable)?.[1] === "__can__" ? "can" : "can't",
        kakeraCooldown: messageContent.match(regexes.kakeraAvailable)?.[2] || "ready",
        power: messageContent.match(regexes.power)?.[1],
        kakeraStock: messageContent.match(regexes.kakeraStock)?.[1],
        dailyReset: messageContent.match(regexes.dailyReset) ? "available" : "not available",
        dkReset: messageContent.match(regexes.dkReset) ? "ready" : "not ready"
    };
    if (results.rollsLeft == undefined && results.power == undefined && results.kakeraStock == undefined) return
    lastTuResults.set(message.author.id, results);

    if (results.rtCooldown) {
        if (results.claimAvailable !== "can" && results.claimReset !== "ready") {
            sendCommand(message.channel, "resetclaimtimer", "$rt");
        }
    }

    if (parseInt(results.rollsLeft) > 0) {
        console.log('Rolls available, sending roll commands...', results.rollsLeft);
        const rollsLeft = parseInt(results.rollsLeft);
        sendRollCommands(message.channel, rollsLeft);
        return

    } else {
        console.log('No rolls available.');
    }

    if (results.rollsReset) {
        setNextRollTimeout(message.channel, results.rollsReset);
    }
});

client.on('messageCreate', async (message) => {
    if (message.channel.id !== config.CHANNEL_ID) return;
    if (message.author.id !== config.MUDAE_ID) return;

    const messageContent = message.content;
    if (!messageContent.startsWith('Wished by ')) return
    const lastTu = lastTuResults.get(config.MUDAE_ID);
    if (!lastTu) {
        console.log('No last $tu results found.');
        return;
    } else {
        const claimAvailable = lastTu.claimAvailable;
        const claimReset = lastTu.claimReset;
        const rtCooldown = lastTu.rtCooldown;
        if (claimAvailable === "can") {
            sendCommand(message, "claim", "");
        } else {
            if (rtCooldown) {
                if (claimAvailable !== "can" && claimReset !== "ready") {
                    sendCommand(message, "resetclaimtimer", "$rt");
                }
            }
        }
    }
})

client.on('messageCreate', async (message) => {

    if (message.channel.id !== config.CHANNEL_ID) return;
    if (message.author.id !== config.MUDAE_ID) return;
    if (message.components.length == 0) return

    if (message.components && message.components[0].components) {
        if (!["kakeraP", "kakeraO", "kakeraR", "kakeraW", "kakeraL"].includes(message.components[0].components[0].emoji.name)) return

        const buttonID = message.components[0].components[0].customId;
        const randomTime = Math.floor(Math.random() * 13000) + 2000;
        console.log('Waiting', randomTime, 'ms before clicking the button');
        setTimeout(async () => {
            await message.clickButton(buttonID);
        }, randomTime);
    }
})

client.on('messageCreate', async (message) => {

    if (message.channel.id !== config.CHANNEL_ID) return;
    if (message.author.id !== config.MUDAE_ID) return;
    if (message.embeds.length == 0) return
    const messageContent = message.content;

    if (messageContent.startsWith('Wished by ')) return
    if (!message.embeds[0].footer) return
    if (!message.embeds[0].footer.text.length) return

    var footerContent = message.embeds[0].footer.text;
    footerContent = footerContent.replace("⚠️ 2 ROLLS LEFT ⚠️", "")
    const kakeraMatch = footerContent.match(/-\s*(\d+)\s*ka/);
    const kakeraAmount = kakeraMatch ? kakeraMatch[1] : null;
    if (parseInt(kakeraAmount) > 350) {
        const randomTime = Math.floor(Math.random() * 13000) + 2000;
        console.log('Waiting', randomTime, 'ms before reacting to the message', kakeraAmount);
        setTimeout(async () => {
            await message.react("👍");
        }, randomTime);

    }
})

client.on('messageCreate', async (message) => {

    if (message.channel.id !== config.CHANNEL_ID) return;
    if (message.author.id !== config.USER_ID) return;
    const messageContent = message.content;
    const args = messageContent.split(" ");
    if (args[0] === "ohputinlaurent") {
        sendRollCommands(message.channel, args[1])
    }
})



async function sendCommand(message, commandName, command) {
    const channel = message.channel
    if (!channel) return
    if (channel.id !== config.CHANNEL_ID) return;
    if (commandName === "resetclaimtimer") {
        channel.send(command);
        setTimeout(() => {
            sendCommand(message, "claim", "");
        }, 2000);
    } if (commandName == "claim") {
        const buttonID = message.components[0].components[0].customId;

        const randomTime = Math.floor(Math.random() * 13000) + 2000;
        console.log('Waiting', randomTime, 'ms before clicking the button');
        setTimeout(async () => {
            await message.clickButton(buttonID);
        }, randomTime);
    }
}

function sendRollCommands(channel, rollsLeft) {
    if (channel.id !== config.CHANNEL_ID) return;
    let rolls = rollsLeft;

    const rollInterval = setInterval(() => {
        if (rolls > 0) {
            channel.send("$ma");
            rolls--;
        } else {
            clearInterval(rollInterval);
            console.log('All rolls spent.');
            channel.send("$mk");
            setTimeout(() => {
                channel.send("$mk");
                setTimeout(() => {
                    channel.send("$tu");
                }, 2000);
            }, 2000);
        }
    }, 2000);
}

function setNextRollTimeout(channel, rollsReset) {
    console.log('Next rolls reset in', rollsReset, 'min');
    setTimeout(() => {
        const newRollsLeft = 48;
        sendRollCommands(channel, newRollsLeft);
    }, ms(`${rollsReset}m`));
}

client.login(config.BOT_TOKEN);