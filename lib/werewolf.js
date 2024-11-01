 killet toMs = require("ms")

let thumb1 =
    "https://user-images.githubusercontent.com/72728486/235344562-4677d2ad-48ee-419d-883f-e0ca9ba1c7b8.jpg";
let thumb2 =
    "https://user-images.githubusercontent.com/72728486/235344861-acdba7d1-8fce-41b8-adf6-337c818cda2b.jpg";
let thumb3 =
    "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg";
let thumb4 =
    "https://user-images.githubusercontent.com/72728486/235354619-6ad1cabd-216c-4c7c-b7c2-3a564836653a.jpg";
let thumb5 =
    "https://user-images.githubusercontent.com/72728486/235365156-cfab66ce-38b2-4bc7-90d7-7756fc320e06.jpg";
let thumb6 =
    "https://user-images.githubusercontent.com/72728486/235365148-35b8def7-c1a2-451d-a2f2-6b6a911b37db.jpg";

let jimp = require("jimp")

const resize = async (image, width, height) => {
    const read = await jimp.read(image);
    const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG);
    return data;
};
var a;
var b;
var d;
var e;
var f;
var textnya;
var idd;
var room;

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function emoji_role(role) {
    if (role === "residents") {
        return "👱‍♂️";
    } else if (role === "seer") {
        return "👳";
    } else if (role === "guardian") {
        return "👼";
    } else if (role === "sorcerer") {
        return "🔮";
    } else if (role === "werewolf") {
        return "🐺";
    } else {
        return "";
    }
}

// #######################

const findObject = (obj = {}, key, value) => {
    const result = [];
    const recursiveSearch = (obj = {}) => {
        if (!obj || typeof obj !== "object") {
            return;
        }
        if (obj[key] === value) {
            result.push(obj);
        }
        Object.keys(obj).forEach(function(k) {
            recursiveSearch(obj[k]);
        });
    };
    recursiveSearch(obj);
    return result;
};

// Sesi
const sesi = (from, data) => {
    if (!data[from]) return false;
    return data[from];
};

// Ensure the player is not in any gaming session
const playerOnGame = (sender, data) => {
    let result = findObject(data, "id", sender);
    let index = false;
    if (result.length === 0) {
        return index;
    } else {
        index = true;
    }
    return index;
};

// check if player is still in the room
const playerOnRoom = (sender, from, data) => {
    let result = findObject(data, "id", sender);
    let index = false;
    if (result.length > 0 && result[0].sesi === from) {
        index = true;
    } else {
        return index;
    }
    return index;
};

// get data player
const dataPlayer = (sender, data) => {
    let result = findObject(data, "id", sender);
    let index = false;
    if (result.length > 0 && result[0].id === sender) {
        index = result[0];
    } else {
        return index;
    }
    return index;
};

// get data player by id
const dataPlayerById = (id, data) => {
    let result = findObject(data, "number", id);
    let index = false;
    if (result.length > 0 && result[0].number === id) {
        index = result[0];
    } else {
        return index;
    }
    return index;
};

// exit game
const playerExit = (from, id, data) => {
    room = sesi(from, data);
    if (!room) return false;
    const indexPlayer = room.player.findIndex((i) => i.id === id);
    room.player.splice(indexPlayer, 1);
};

// get player id
const getPlayerById = (from, sender, id, data) => {
    room = sesi(from, data);
    if (!room) return false;
    const indexPlayer = room.player.findIndex((i) => i.number === id);
    if (indexPlayer === -1) return false;
    return {
        index: indexPlayer,
        sesi: room.player[indexPlayer].sesi,
        db: room.player[indexPlayer],
    };
};

// get player id 2
const getPlayerById2 = (sender, id, data) => {
    let result = findObject(data, "id", sender);
    if (result.length > 0 && result[0].id === sender) {
        let from = result[0].sesi;
        room = sesi(from, data);
        if (!room) return false;
        const indexPlayer = room.player.findIndex((i) => i.number === id);
        if (indexPlayer === -1) return false;
        return {
            index: indexPlayer,
            sesi: room.player[indexPlayer].sesi,
            db: room.player[indexPlayer],
        };
    }
};

// werewolf kill
const killWerewolf = (sender, id, data) => {
    let result = getPlayerById2(sender, id, data);
    if (!result) return false;
    let {
        index,
        sesi,
        db
    } = result;
    if (data[sesi].player[index].number === id) {
        if (db.effect.includes("guardian")) {
            data[sesi].guardian.push(parseInt(id));
            data[sesi].dead.push(parseInt(id));
        } else if (!db.effect.includes("guardian")) {
            data[sesi].dead.push(parseInt(id));
        }
    }
};

// seer dreamy
const dreamySeer = (sender, id, data) => {
    let result = getPlayerById2(sender, id, data);
    if (!result) return false;
    let {
        index,
        sesi,
        db
    } = result;
    if (data[sesi].player[index].role === "werewolf") {
        data[sesi].seer = true;
    }
    return data[sesi].player[index].role;
};

// seer dreamy
const sorcerer = (sender, id, data) => {
    let result = getPlayerById2(sender, id, data);
    if (!result) return false;
    let {
        index,
        sesi,
        db
    } = result;
    return data[sesi].player[index].role;
};

// guardian protect
const protectGuardian = (sender, id, data) => {
    let result = getPlayerById2(sender, id, data);
    if (!result) return false;
    let {
        index,
        sesi,
        db
    } = result;
    data[sesi].player[index].effect.push("guardian");
};

// role randomization
const roleShuffle = (array) => {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
};

// giving role to a player
const roleChanger = (from, id, role, data) => {
    room = sesi(from, data);
    if (!room) return false;
    var index = room.player.findIndex((i) => i.id === id);
    if (index === -1) return false;
    room.player[index].role = role;
};

// assigning roles to all players
const roleAmount = (from, data) => {
    const result = sesi(from, data);
    if (!result) return false;
    if (result.player.length == 4) {
        return {
            werewolf: 1,
            seer: 1,
            guardian: 1,
            resident: 1,
            sorcerer: 0,
        };
    } else if (result.player.length == 5) {
        return {
            werewolf: 1,
            seer: 1,
            guardian: 1,
            resident: 3,
            sorcerer: 0,
        };
    } else if (result.player.length == 6) {
        return {
            werewolf: 2,
            seer: 1,
            guardian: 1,
            resident: 2,
            sorcerer: 0,
        };
    } else if (result.player.length == 7) {
        return {
            werewolf: 2,
            seer: 1,
            guardian: 1,
            resident: 3,
            sorcerer: 0,
        };
    } else if (result.player.length == 8) {
        return {
            werewolf: 2,
            seer: 1,
            guardian: 1,
            resident: 4,
            sorcerer: 0,
        };
    } else if (result.player.length == 9) {
        return {
            werewolf: 2,
            seer: 1,
            guardian: 1,
            resident: 4,
            sorcerer: 1,
        };
    } else if (result.player.length == 10) {
        return {
            werewolf: 2,
            seer: 1,
            guardian: 1,
            resident: 5,
            sorcere: 1,
        };
    } else if (result.player.length == 11) {
        return {
            werewolf: 2,
            seer: 1,
            guardian: 2,
            resident: 5,
            sorcerer: 1,
        };
    } else if (result.player.length == 12) {
        return {
            werewolf: 2,
            seer: 1,
            guardian: 2,
            resident: 6,
            sorcerer: 1,
        };
    } else if (result.player.length == 13) {
        return {
            werewolf: 2,
            seer: 1,
            guardian: 1,
            resident: 7,
            sorcerer: 1,
        };
    } else if (result.player.length == 14) {
        return {
            werewolf: 2,
            seer: 2,
            guardian: 2,
            resident:7, 
            sorcerer: 1,
        };
    } else if (result.player.length == 15) {
        return {
            werewolf: 3,
            seer: 2,
            guardian: 3,
            resident: 6,
            sorcerer: 1,
        };
    }
};

const roleGenerator = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    var role = roleAmount(from, data);
    for (var i = 0; i < role.werewolf; i++) {
        var player = room.player.filter((x) => x.role === false);
        var list = roleShuffle(player);
        if (list.length === 0) return false;
        var random = Math.floor(Math.random() * list.length);
        roleChanger(from, list[random].id, "werewolf", data);
    }
    for (var i = 0; i < role.seer; i++) {
        var player = room.player.filter((x) => x.role === false);
        var list = roleShuffle(player);
        if (list.length === 0) return false;
        var random = Math.floor(Math.random() * list.length);
        roleChanger(from, list[random].id, "seer", data);
    }
    for (var i = 0; i < role.guardian; i++) {
        var player = room.player.filter((x) => x.role === false);
        var list = roleShuffle(player);
        if (list.length === 0) return false;
        var random = Math.floor(Math.random() * list.length);
        roleChanger(from, list[random].id, "guardian", data);
    }
    for (var i = 0; i < role.resident; i++) {
        var player = room.player.filter((x) => x.role === false);
        var list = roleShuffle(player);
        if (list.length === 0) return false;
        var random = Math.floor(Math.random() * list.length);
        roleChanger(from, list[random].id, "resident", data);
    }
    for (var i = 0; i < role.sorcere; i++) {
        var player = room.player.filter((x) => x.role === false);
        var list = roleShuffle(player);
        if (list.length === 0) return false;
        var random = Math.floor(Math.random() * list.length);
        roleChanger(from, list[random].id, "sorcerer", data);
    }
    shortPlayer(from, data);
};

// add cooldown
const addTimer = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    room.cooldown = Date.now() + toMs(90 + "s");
};

// change the status of the room, in the game
const startGame = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    room.status = true;
};

// foxes of the day
const changeDay = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    if (room.time === "morning") {
        room.time = "voting";
    } else if (room.time === "malem") {
        room.time = "morning";
        room.day += 1;
    } else if (room.time === "voting") {
        room.time = "malem";
    }
};

// hari voting
const dayVoting = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    if (room.time === "malem") {
        room.time = "voting";
    } else if (room.time === "morning") {
        room.time = "voting";
    }
};

// voting
const vote = (from, id, sender, data) => {
    room = sesi(from, data);
    if (!room) return false;
    const idGet = room.player.findIndex((i) => i.id === sender);
    if (idGet === -1) return false;
    const indexPlayer = room.player.findIndex((i) => i.number === id);
    if (indexPlayer === -1) return false;
    if (idGet !== -1) {
        room.player[idGet].isvote = true;
    }
    room.player[indexPlayer].vote += 1;
};

// revenues voting
const voteResult = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    room.player.sort((a, b) => (a.vote < b.vote ? 1 : -1));
    if (room.player[0].vote === 0) return 0;
    if (room.player[0].vote === room.player[1].vote) return 1;
    return room.player[0];
};

// vote killing
const voteKill = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    room.player.sort((a, b) => (a.vote < b.vote ? 1 : -1));
    if (room.player[0].vote === 0) return 0;
    if (room.player[0].vote === room.player[1].vote) return 1;
    room.player[0].isdead = true;
};

// voting reset
const resetVote = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    for (let i = 0; i < room.player.length; i++) {
        room.player[i].vote = 0;
    }
};

const voteDone = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    room.voting = false;
};

const voteStart = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    room.voting = true;
};

// clear vote
const clearAllVote = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    for (let i = 0; i < room.player.length; i++) {
        room.player[i].vote = 0;
        room.player[i].isvote = false;
    }
};

// clearAll
const clearAll = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    room.dead = [];
    room.seer = false;
    room.guardian = [];
    room.voting = false;
};

// clear all status player
const clearAllSTATUS = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    for (let i = 0; i < room.player.length; i++) {
        room.player[i].effect = [];
    }
};

const skillOn = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    for (let i = 0; i < room.player.length; i++) {
        room.player[i].status = false;
    }
};

const skillOff = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    for (let i = 0; i < room.player.length; i++) {
        room.player[i].status = true;
    }
};

const playerAlive = (data) => {
    const revenue= data.player.filter((x) => x.isdead === false);
    return revenue.length;
};

const playerDead = (data) => {
    const revenue = data.player.filter((x) => x.isdead === true);
    return revenue.length;
};

// get player win
const getWinner = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    var ww = 0;
    var orang_baek = 0;
    for (let i = 0; i < room.player.length; i++) {
        if (room.player[i].isdead === false) {
            if (
                room.player[i].role === "werewolf" ||
                room.player[i].role === "sorcerer"
            ) {
                ww += 1;
            } else if (
                room.player[i].role === "resident" ||
                room.player[i].role === "guardian" ||
                room.player[i].role === "seer"
            ) {
                orang_baek += 1;
            }
        }
    }
    if (room.voting) {
        b = voteResult(from, data);
        if (b != 0 && b != 1) {
            if (b.role === "werewolf" || b.role === "sorcerer") {
                ww -= 1;
            } else if (
                b.role === "resident"||
                b.role === "seer" ||
                b.role === "guardian"
            ) {
                orang_baek -= 1;
            }
        }
    }
    if (ww === 0) {
        room.iswin = true;
        return {
            voting: room.voting,
            status: true
        };
    } else if (ww === orang_baek) {
        room.iswin = false;
        return {
            voting: room.voting,
            status: false
        };
    } else if (orang_baek === 0) {
        room.iswin = false;
        return {
            voting: room.voting,
            status: false
        };
    } else {
        return {
            voting: room.voting,
            status: null
        };
    }
};

// shorting
const shortPlayer = (from, data) => {
    room = sesi(from, data);
    if (!room) return false;
    room.player.sort((a, b) => a.number - b.number);
};

// werewolf killing
const killww = (from, id, data) => {
    room = sesi(from, data);
    if (!room) return false;
    for (let j = 0; j < room.dead.length; j++) {
        idd = getPlayerById(from, room.player[0].id, room.dead[j], data);
        if (!idd) return false;
        if (room.player[idd.index].effect.includes("guardian")) return;
        room.player[idd.index].isdead = true;
    }
};

const pagii = (data) => {
    if (data.dead.length < 1) {
        return `*⌂ W E R E W O L F - G A M E*\n\nThe sun has risen, there are no casualties tonight, residents have returned to their normal activities.\n90 seconds remaining before the final decision, residents are invited to discuss\n*Day to ${data.day}*`;
    } else {
        a = "";
        d = "";
        e = [];
        f = [];
        for (let i = 0; i < data.dead.length; i++) {
            b = data.player.findIndex((x) => x.number === data.dead[i]);
            if (data.player[b].effect.includes("guardian")) {
                e.push(data.player[b].id);
            } else {
                f.push(data.player[b].id);
            }
        }
        for (let i = 0; i < f.length; i++) {
            if (i === f.length - 1) {
                if (f.length > 1) {
                    a += ` dan @${f[i].replace("@s.whatsapp.net", "")}`;
                } else {
                    a += `@${f[i].replace("@s.whatsapp.net", "")}`;
                }
            } else if (i === f.length - 2) {
                a += `@${f[i].replace("@s.whatsapp.net", "")}`;
            } else {
                a += `@${f[i].replace("@s.whatsapp.net", "")}, `;
            }
        }
        for (let i = 0; i < e.length; i++) {
            if (i === e.length - 1) {
                if (e.length > 1) {
                    d += ` dan @${e[i].replace("@s.whatsapp.net", "")}`;
                } else {
                    d += `@${e[i].replace("@s.whatsapp.net", "")}`;
                }
            } else if (i === e.length - 2) {
                d += `@${e[i].replace("@s.whatsapp.net", "")}`;
            } else {
                d += `@${e[i].replace("@s.whatsapp.net", "")}, `;
            }
        }
        textnya = `*⌂ W E R E W O L F - G A M E*\n\nMorning had arrived, the villagers discovered ${
      data.dead.length > 1 ? "beberapa" : "1"
    } Bodies in rubble and blood splattered. ${a ? a + " already died! " : ""}${
      d.length > 1
        ? ` ${d}almost killed, but *Guardian Angel* managed to protect him.`
        : ""
    }\n\nIt didn't feel like it was already noon, the sun was directly overhead, the heat of the sun made the atmosphere noisy, the villagers had 90 seconds to discuss\n*Day to ${
      data.day
    }*`;
        return textnya;
    }
};

async function morning(NanoBotz, x, data) {
    skillOff(x.room, data)
    let ment = [];
    for (let i = 0; i < x.player.length; i++) {
        ment.push(x.player[i].id);
    }
    shortPlayer(x.room, data);
    killww(x.room, x.dead, data);
    shortPlayer(x.room, data);
    changeDay(x.room, data);
    return await NanoBotz.sendMessage(x.room, {
        text: pagii(x),
        contextInfo: {
            externalAdReply: {
                title: "W E R E W O L F",
                mediaType: 1,
                renderLargerThumbnail: true,
                thumbnail: await resize(thumb1, 300, 175),
                sourceUrl: "",
                mediaUrl: thumb1,
            },
            mentionedJid: ment,
        },
    });
}

async function voting(NanoBotz, x, data) {
    let row = [];
    let ment = [];
    voteStart(x.room, data)
    textnya =
        "*⌂ W E R E W O L F - G A M E*\n\n Dusk has arrived. All citizens gathered at the village hall to vote on who would be executed. Some residents were seen busy preparing torture devices for the night. You have 90 seconds to vote! Be careful, there are traitors among you!\n\n*L I S T - P L A Y E R*:\n";
    shortPlayer(x.room, data);
    for (let i = 0; i < x.player.length; i++) {
        textnya += `(${x.player[i].number}) @${x.player[i].id.replace(
      "@s.whatsapp.net",
      ""
    )} ${x.player[i].isdead === true ? "☠️" : ""}\n`;
        ment.push(x.player[i].id);
    }
    textnya += "\nketik *.ww vote number* for voting player";
    dayVoting(x.room, data);
    clearAll(x.room, data);
    clearAllSTATUS(x.room, data);
    return await NanoBotz.sendMessage(x.room, {
        text: textnya,
        contextInfo: {
            externalAdReply: {
                title: "W E R E W O L F",
                mediaType: 1,
                renderLargerThumbnail: true,
                thumbnail: await resize(thumb2, 300, 175),
                sourceUrl: "",
                mediaUrl: thumb2,
            },
            mentionedJid: ment,
        },
    });
}

async function malam(NanoBotz, x, data) {
    var revenue_vote = voteResult(x.room, data);
    if (revenue_vote === 0) {
        textnya = `*⌂ W E R E W O L F - G A M E*\n\n Too hesitant to make choices. Residents went home, no one was executed today. The moon is shining brightly, the gripping night has come. Hope no one dies tonight. Player of the night: you guys have 90 seconds to act!`;
        return NanoBotz
            .sendMessage(x.room, {
                text: textnya,
                contextInfo: {
                    externalAdReply: {
                        title: "W E R E W O L F",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnail: await resize(thumb3, 300, 175),
                        sourceUrl: "",
                        mediaUrl: thumb3,
                    },
                },
            })
            .then(() => {
                changeDay(x.room, data);
                voteDone(x.room, data);
                resetVote(x.room, data);
                clearAllVote(x.room, data);
                if (getWinner(x.room, data).status != null)
                    return win(x, 1, NanoBotz, data);
            });
    } else if (hasil_vote === 1) {
        textnya = `*⌂ W E R E W O L F - G A M E*\n\n The villagers had voted, but the result was a series. \n\n The stars are shining a beautiful light tonight, the villagers are resting in each other's residences. Player of the night: you guys have 90 seconds to act!`;
        return NanoBotz
            .sendMessage(x.room, {
                text: textnya,
                contextInfo: {
                    externalAdReply: {
                        title: "W E R E W O L F",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnail: await resize(thumb3, 300, 175),
                        sourceUrl: "",
                        mediaUrl: thumb3,
                    },
                },
            })
            .then(() => {
                changeDay(x.room, data);
                voteDone(x.room, data);
                resetVote(x.room, data);
                clearAllVote(x.room, data);
                if (getWinner(x.room, data).status != null)
                    return win(x, 1, NanoBotz, data);
            });
    } else if (revenue_vote != 0 && hasil_vote != 1) {
        if (revenue_vote.role === "werewolf") {
            textnya = `*⌂ W E R E W O L F - G A M E*\n\n The villagers have voted and agreed @${revenue_vote.id.replace(
        "@s.whatsapp.net",
        ""
      )} executed dead.\n\n@${revenue_vote.id.replace(
        "@s.whatsapp.net",
        ""
      )} Is ${revenue_vote.role} ${emoji_role(revenue_vote.role)}`;
            voteKill(x.room, data);
            let ment = [];
            ment.push(revenue_vote.id);
            return await NanoBotz
                .sendMessage(x.room, {
                    text: textnya,
                    contextInfo: {
                        externalAdReply: {
                            title: "W E R E W O L F",
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            thumbnail: await resize(thumb4, 300, 175),
                            sourceUrl: "",
                            mediaUrl: thumb4,
                        },
                        mentionedJid: ment,
                    },
                })
                .then(() => {
                    changeDay(x.room, data);
                    voteDone(x.room, data);
                    resetVote(x.room, data);
                    clearAllVote(x.room, data);
                    if (getWinner(x.room, data).status != null)
                        return win(x, 1, NanoBotz, data);
                });
        } else {
            textnya = `*⌂ W E R E W O L F - G A M E*\n\n The villagers have voted and agreed @${hasil_vote.id.replace(
        "@s.whatsapp.net",
        ""
      )} executed dead.\n\n@${hasil_vote.id.replace(
        "@s.whatsapp.net",
        ""
      )} is ${revenue_vote.role} ${emoji_role(
        revenue_vote.role
      )}\n\n The moon is shining brightly tonight, the villagers are resting in each other's residences. Player of the night: you guys have 90 seconds to act!`;
            voteKill(x.room, data);
            let ment = [];
            ment.push(hasil_vote.id);
            return await NanoBotz
                .sendMessage(x.room, {
                    text: textnya,
                    contextInfo: {
                        externalAdReply: {
                            title: "W E R E W O L F",
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            thumbnail: await resize(thumb4, 300, 175),
                            sourceUrl: "",
                            mediaUrl: thumb4,
                        },
                        mentionedJid: ment,
                    },
                })
                .then(() => {
                    changeDay(x.room, data);
                    voteDone(x.room, data);
                    resetVote(x.room, data);
                    clearAllVote(x.room, data);
                    if (getWinner(x.room, data).status != null)
                        return win(x, 1, NanoBotz, data);
                });
        }
    }
}

async function skill(NanoBotz, x, data) {
    skillOn(x.room, data)
    if (getWinner(x.room, data).status != null || x.win != null) {
        return win(x, 1, NanoBotz, data);
    } else {
        if (!x) return;
        if (!x.player) return;
        if (x.win != null) return;
        let tok1 = "\n";
        let tok2 = "\n";
        let Its members = [];
        shortPlayer(x.room, data);
        for (let i = 0; i < x.player.length; i++) {
            tok1 += `(${x.player[i].number}) @${x.player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )}${x.player[i].isdead === true ? " ☠️" : ""}\n`;
            Its members.push(x.player[i].id);
        }
        for (let i = 0; i < x.player.length; i++) {
            tok2 += `(${x.player[i].number}) @${x.player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )} ${
        x.player[i].role === "werewolf" || x.player[i].role === "sorcerer"
          ? `${x.player[i].isdead === true ? ` ☠️` : ` ${x.player[i].role}`}`
          : " "
      }\n`;
            Its members.push(x.player[i].id);
        }
        for (let i = 0; i < x.player.length; i++) {
            if (x.player[i].role === "werewolf") {
                if (x.player[i].isdead != true) {
                    textnya = ` Please choose one of the people you want to eat with tonight.\n*LIST PLAYER*:\n${tok2}\n\nKetik *.wwpc kill number* to kill the player`;

                    await NanoBotz.sendMessage(x.player[i].id, {
                        text: textnya,
                        mentions: Its members,
                    });
                }
            } else if (x.player[i].role === "resident") {
                if (x.player[i].isdead != true) {
                    textnya = `*⌂ W E R E W O L F - G A M E*\n\n As a citizen beware, you may be the next target. \ n *LIST PLAYER*:${tok1}`;
                    await NanoBotz.sendMessage(x.player[i].id, {
                        text: textnya,
                        mentions: membernya,
                    });
                }
            } else if (x.player[i].role === "seer") {
                if (x.player[i].isdead != true) {
                    textnya = ` All right, who do you want to see in his role this time.\n*LIST PLAYER*:${tok1}\n\nKetik *.wwpc dreamy nomor* To see the role player`;

                    await NanoBotz.sendMessage(x.player[i].id, {
                        text: textnya,
                        mentions: membernya,
                    });
                }
            } else if (x.player[i].role === "guardian") {
                if (x.player[i].isdead != true) {
                    textnya = `You are a*Guardian*, Protect the citizens, please choose one of the players you want to protect\n*LIST PLAYER*:${tok1}\n\n Type *.wwpc deff number* to protect player`;

                    await NanoBotz.sendMessage(x.player[i].id, {
                        text: textnya,
                        mentions: membernya,
                    });
                }
            } else if (x.player[i].role === "sorcerer") {
                if (x.player[i].isdead != true) {
                    textnya = ` Alright, see what you can create, please select 1 person you want to open the identity of\n*LIST PLAYER*: $ {tok2}\n\nType *.wwpc sorcerer number* to view role player`

                    await NanoBotz.sendMessage(x.player[i].id, {
                        text: textnya,
                        mentions: membernya,
                    });
                }
            }
        }
    }
}

async function win(x, t, NanoBotz, data) {
    const sesinya = x.room;
    if (getWinner(x.room, data).status === false || x.iswin === false) {
        textnya = `*W E R E W O L F - W I N*\n\nTEAM WEREWOLF\n\n`;
        let ment = [];
        for (let i = 0; i < x.player.length; i++) {
            if (x.player[i].role === "sorcerer" || x.player[i].role === "werewolf") {
                textnya += `${x.player[i].number}) @${x.player[i].id.replace(
          "@s.whatsapp.net",
          ""
        )}\n     *Role* : ${x.player[i].role}\n\n`;
                ment.push(x.player[i].id);
            }
        }
        return await NanoBotz
            .sendMessage(sesinya, {
                text: textnya,
                contextInfo: {
                    externalAdReply: {
                        title: "W E R E W O L F",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnail: await resize(thumb5, 300, 175),
                        sourceUrl: "",
                        mediaUrl: thumb5,
                    },
                    mentionedJid: ment,
                },
            })
            .then(() => {
                delete data[x.room];
            });
    } else if (getWinner(x.room, data).status === true) {
        textnya = `*T E A M - R E S I D E N T - W I N*\n\nTEAM RESIDENT\n\n`;
        let ment = [];
        for (let i = 0; i < x.player.length; i++) {
            if (
                x.player[i].role === "resident" ||
                x.player[i].role === "guardian" ||
                x.player[i].role === "seer"
            ) {
                textnya += `${x.player[i].number}) @${x.player[i].id.replace(
          "@s.whatsapp.net",
          ""
        )}\n     *Role* : ${x.player[i].role}\n\n`;
                ment.push(x.player[i].id);
            }
        }
        return await NanoBotz.sendMessage(sesinya, {
            text: textnya,
            contextInfo: {
                externalAdReply: {
                    title: "W E R E W O L F",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnail: await resize(thumb6, 300, 175),
                    sourceUrl: "",
                    mediaUrl: thumb5,
                },
                mentionedJid: ment,
            },
        });
    }
}

// playing
async function run(NanoBotz, id, data) {
    while (getWinner(id, data).status === null) {
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await pagi(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await voting(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await malam(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await skill(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) break;
    }
    await win(sesi(id, data), 1, NanoBotz, data);
}

async function run_vote(NanoBotz, id, data) {
    while (getWinner(id, data).status === null) {
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await voting(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await malam(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await skill(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await pagi(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) break;
    }
    await win(sesi(id, data), 1, NanoBotz, data);
}

async function run_malam(NanoBotz, id, data) {
    while (getWinner(id, data).status === null) {
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await skill(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await pagi(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await voting(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await malam(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) break;
    }
    await win(sesi(id, data), 1, NanoBotz, data);
}

async function run_morning(NanoBotz, id, data) {
    while (getWinner(id, data).status === null) {
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await morning(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await voting(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await malam(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await skill(NanoBotz, sesi(id, data), data);
        }
        if (getWinner(id, data).status != null) {
            win(getWinner(id, data), 1, NanoBotz, data);
            break;
        } else {
            await sleep(90000);
        }
        if (getWinner(id, data).status != null) break;
    }
    await win(sesi(id, data), 1, NanoBotz, data);
}

module.exports = {
    emoji_role,
    sesi,
    playerOnGame,
    playerOnRoom,
    playerExit,
    dataPlayer,
    dataPlayerById,
    getPlayerById,
    getPlayerById2,
    killWerewolf,
    killww,
    dreamySeer,
    sorcerer,
    protectGuardian,
    roleShuffle,
    roleChanger,
    roleAmount,
    roleGenerator,
    addTimer,
    startGame,
    playerAlive,
    playerDead,
    vote,
    voteResult,
    clearAllVote,
    getWinner,
    win,
    morning,
    malam,
    skill,
    voteStart,
    voteDone,
    voting,
    run,
    run_vote,
    run_malam,
    run_morning,
};
