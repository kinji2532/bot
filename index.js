const { Client, Attachment } = require('discord.js');
const client = new Client();
const fs = require('fs');
const cron = require('node-cron');
const request = require('request');
const unzip = require('node-unzip-2');
const rimraf = require('rimraf');
const zipfolder = require('zip-folder');

process.on('uncaughttException',(err)=>{
  client.channels.get('637224720470638612').send("予期せぬエラーが起きたぜ");
  try{
    client.channels.get('637224720470638612').send(err.messagge)
  }catch{}
  console.log(err)
  client.destroy();
  client.login(process.env.BOT_TOKEN);
});

client.on('ready', ()=>{
  console.log(`Logged in as ${client.user.tag}!`);
  client.channels.get('637224720470638612').fetchMessages({ limit: 100 }).then(messages =>{
    for(data of messages){
      data[1].delete();
    }
  })
  client.channels.get('637224720470638612').send("リログしたぜ。")
  let url = 'https://www.dropbox.com/s/o5ov4egzv9y6gaw/index-seiji.js?dl=1'
  let text = fs.createWriteStream('seiji.js');
  request.get(url).on('error',console.error).pipe(text)
  text.on('finish',()=>{
    try{
      let txt = fs.readFileSync('seiji.js','utf-8');
      eval(txt);
    }catch(e){
      client.channels.get('637224720470638612').send(`エラーが起きたぜ！\n${e.message}`);
    }
    fs.unlinkSync('seiji.js')
  })
});

client.login(process.env.BOT_TOKEN);

/*
cd haradabot/
git init
heroku git:remote -a haradabot
git add .
git commit -m "First commit"
git push heroku master --force
*/
