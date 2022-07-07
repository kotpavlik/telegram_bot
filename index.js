const  TelegramAPI = require('node-telegram-bot-api');
const {gameOptions,againOptions} = require('./options.js');
// Requiring modules
const express = require("express");

var cors = require('cors');
const app = express();

const token = '5594996297:AAEm8a0PqLX5I1C27F04AXXQyDLh6x-RiJM';

const bot = new TelegramAPI(token,{polling:true});

const chats = {}




app.use(cors())

// Root route of express app
app.post("/", (req, res) => {
   const body = req.body;
   if(body){
       console.log('I GOT DATA')
       bot.sendMessage(245721044,` you are name ${body.first_name} ${body.last_name}`)
       res.send("GREAT");
   }

});


// All the general routes of your
// web app are defined above the
// default route

// Default route
app.get("*", (req, res) => {

// Here user can also design an
// error page and render it
    res.send("PAGE NOT FOUND");
});

// Server setup
app.listen(3228, () => {
    console.log(
        `Server listening on http://localhost:3228`);
});



const startGame = async(chatId)=> {
    await  bot.sendMessage(chatId,` now I will think of a number from 0 to 9`)
    const randomNumber = Math.floor(Math.random() *10)
    chats[chatId]=randomNumber;
    await bot.sendMessage(chatId,'your think ...',gameOptions)
}

const start =()=> {
    bot.setMyCommands([
        {command:"/start",description:"start dialog with bot"},
        {command: "/info",description:"information about you"},
        {command: "/game",description:"game with numbers"},

    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if( text === '/start') {
            await bot.sendSticker(chatId,
                'https://tlgrm.ru/_/stickers/6a3/497/6a34971d-6648-37c2-8f2b-8940f65ba906/2.webp')
            return  bot.sendMessage(chatId, `hello my friend!`)
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId,` you are name ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
           return  startGame(chatId)
        }
        return bot.sendMessage(chatId,'sorry i dont understand you')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(data)
        console.log(chats[chatId])
        if(data === "/play_again") {
            return  startGame(chatId)
        }
        if(data == chats[chatId]){
            return await bot.sendMessage(chatId,'you are winner',againOptions)
        } else {
            return await bot.sendMessage(chatId,` the bot guessed ${chats[chatId]}`,againOptions)
        }

    })

}

start()