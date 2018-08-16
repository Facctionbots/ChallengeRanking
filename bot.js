var Eris = require('eris');
var bot = new Eris("BOT_TOKEN");
var fs = require("fs");

//variaveis usadas paras queues

var player1 = "";
var player2 = "";
var player1id = "";
var player2id = "";

var fileJson = fs.readFileSync('status.json','utf8')
var jsonFile = JSON.parse(fileJson);

bot.on("ready", () => {
  console.log("Queue Ready!");
  setInterval(function(){
        player1 = ""
    }, 900000);
  });

bot.on("messageCreate", (msg) => {
    if(msg.author.bot) return;
    let command = msg.content.toLowerCase();
    let args = msg.content.split(" ").slice(1);

    if (command.indexOf("!log") !== -1){
        console.log(args[0])
    }

    if (command === "!salvar" && msg.author.id === '211962239433834498' && msg.channel.id === '470763374825701376'){

        bot.createMessage('470763374825701376', 'SALVO!')
    }

    if (command === "!reset" && msg.author.id === '270312011101896704' && msg.channel.id === '470763374825701376'){
        fileJson = '{"211962239433834498":{"jogos":0,"vitorias":0,"derrotas":0,"jogandoContra":"","ganhador":""}}'
        jsonFile = JSON.parse(fileJson);
        console.log(jsonFile)
        fs.writeFile("status.json", JSON.stringify(jsonFile), function(err) {
            console.log("Arquivo Salvo!");
        }); 
        bot.createMessage('470763374825701376', 'Season resetada!')
    }

    if (command === "!status" && JSON.stringify(jsonFile).indexOf(msg.author.id) > -1 && msg.channel.id === '470763374825701376'){
        bot.createMessage('470763374825701376', "Nick: " + msg.author.mention + '\n' + "Jogos: " + jsonFile[msg.author.id].jogos + '\n' + "Vitorias: " + jsonFile[msg.author.id].vitorias + '\n' + "Derrotas: " + jsonFile[msg.author.id].derrotas);
    }
    if (command.indexOf("!status") !== -1 && args[0] != null && JSON.stringify(jsonFile).indexOf(args[0].replace(/[^\d]/g, '')) > -1 && msg.channel.id === '470763374825701376'){
        bot.createMessage('470763374825701376', "Nick: " + args[0] + '\n' + "Jogos: " + jsonFile[args[0].replace(/[^\d]/g, '')].jogos + '\n' + "Vitorias: " + jsonFile[args[0].replace(/[^\d]/g, '')].vitorias + '\n' + "Derrotas: " + jsonFile[args[0].replace(/[^\d]/g, '')].derrotas);
    }
    if (command.indexOf("!status") !== -1 && args[0] != null && JSON.stringify(jsonFile).indexOf(args[0].replace(/[^\d]/g, '')) == -1 && msg.channel.id === '470763374825701376'){
        bot.createMessage('470763374825701376', "Este player não jogou nenhuma partida!");
    }
    if (command === "!status" && JSON.stringify(fileJson).indexOf(msg.author.id) === -1 && msg.channel.id === '470763374825701376'){
        bot.createMessage('470763374825701376', 'Parece que você não jogou nenhuma partida! Não estou te encontrando no meu banco de dados!')
    }

    if (command === "!q" && JSON.stringify(jsonFile).indexOf(msg.author.id) == -1 && msg.channel.id === '470763374825701376'){
            fileJson = JSON.stringify(jsonFile).replace(/}}/g, '},' + '"' + msg.author.id + '":' + '{"jogos":0,"vitorias":0,"derrotas":0,"jogandoContra":"","ganhador":""}}');
            jsonFile = JSON.parse(fileJson);
            fs.writeFile("status.json", JSON.stringify(jsonFile), function(err) {
                console.log("Arquivo Salvo!");
            }); 
    }

    if (command === "!q" && player1 == "" && player1 != msg.author.mention && jsonFile[msg.author.id].jogandoContra == "" && msg.channel.id === '470763374825701376'){
        player1 = msg.author.mention;
        player1id = msg.author.id;
        bot.createMessage('470763374825701376', "⚔ | Alguém acabou de entrar na queue! " + msg.channel.guild.roles.find(role=> role.name == "Membros ௫").mention);
    }

    if (command === "!q" && player1 != "" && player2 == "" && player1 != msg.author.mention && jsonFile[msg.author.id].jogandoContra == "" && msg.channel.id === '470763374825701376'){
        player2 = msg.author.mention;
        player2id = msg.author.id;
    }
    if (command === "!q" && jsonFile[msg.author.id].jogandoContra != "" && msg.channel.id === '470763374825701376'){
        bot.createMessage('470763374825701376', "Você já está em um game!")
    }

    if (player1 != "" && player2 != ""){
        jsonFile[player1id].jogos += 1;
        jsonFile[player2id].jogos += 1;
        jsonFile[player1id].jogandoContra = player2id;
        jsonFile[player2id].jogandoContra = player1id;
            player1id = "";
            player2id = "";
            bot.createMessage('470763374825701376', player1 + "⚔" + player2);
            player1 = "";
            player2 = "";
            fs.writeFile("status.json", JSON.stringify(jsonFile), function(err) {
                console.log("Arquivo Salvo!");
            }); 
    }
    /*if (msg.author.id != "346214136306335746" && msg.channel.id == "470763374825701376"){
        msg.delete();
    }*/

    if (command === "!win" && jsonFile[msg.author.id].jogandoContra != "" && msg.channel.id === '470763374825701376'){
        jsonFile[msg.author.id].ganhador = msg.author.id;
    }
    if (command === "!lose" && jsonFile[msg.author.id].jogandoContra != "" && msg.channel.id === '470763374825701376'){
        jsonFile[msg.author.id].ganhador = jsonFile[msg.author.id].jogandoContra;
    }

    if (command === "!win" && jsonFile[msg.author.id].jogandoContra != "" && jsonFile[msg.author.id].ganhador == msg.author.id && jsonFile[jsonFile[msg.author.id].jogandoContra].ganhador == msg.author.id && msg.channel.id === '470763374825701376'){
        bot.createMessage('470763374825701376', "<@" + jsonFile[msg.author.id].ganhador + ">" + " ganhou!")
        jsonFile[msg.author.id].vitorias += 1;
        jsonFile[jsonFile[msg.author.id].jogandoContra].derrotas += 1
        jsonFile[jsonFile[msg.author.id].jogandoContra].jogandoContra = "";
        jsonFile[jsonFile[msg.author.id].jogandoContra].ganhador = "";
        jsonFile[msg.author.id].jogandoContra = "";
        jsonFile[msg.author.id].ganhador = "";
        fs.writeFile("status.json", JSON.stringify(jsonFile), function(err) {
            console.log("Arquivo Salvo!");
        }); 
    }

    if (command === "!lose" && jsonFile[msg.author.id].jogandoContra != "" && jsonFile[msg.author.id].ganhador == jsonFile[msg.author.id].jogandoContra && jsonFile[jsonFile[msg.author.id].jogandoContra].ganhador == jsonFile[msg.author.id].jogandoContra && jsonFile[msg.author.id].jogandoContra != "" && msg.channel.id === '470763374825701376'){
        bot.createMessage('470763374825701376', "<@" + jsonFile[msg.author.id].ganhador + ">" + " ganhou!");
        jsonFile[msg.author.id].derrotas += 1;
        jsonFile[jsonFile[msg.author.id].ganhador].vitorias += 1
        jsonFile[jsonFile[msg.author.id].ganhador].ganhador = "";
        jsonFile[jsonFile[msg.author.id].ganhador].jogandoContra = "";
        jsonFile[msg.author.id].ganhador = "";
        jsonFile[msg.author.id].jogandoContra = "";
        fs.writeFile("status.json", JSON.stringify(jsonFile), function(err) {
            console.log("Arquivo Salvo!");
        }); 
    }
    if (player1 == msg.author.mention && command === "!c" && msg.channel.id === '470763374825701376'){
        player1 = "";
        bot.createMessage('470763374825701376', "🚫 | O player que estava na queue acabou de sair!");
    }

    if (command && msg.channel.id == '470763374825701376' && msg.author.id != '470756817186848769'){
        msg.delete();
    }
});
bot.connect();
