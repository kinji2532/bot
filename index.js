const { Client, Attachment } = require('discord.js');
const client = new Client();
const fs = require('fs');
const request = require('request');
let jsoncheck = false

function jsonchecker(name){
  try{
    let txt = fs.readFileSync(name,'utf-8');
    JSON.parse(txt)
  }catch{
    return "おっと jsonに不備があるようだ"
  }
  return "大丈夫 jsonに異常はないぜ"
}

client.on('ready', ()=>{
  console.log(`Logged in as ${client.user.tag}!`);
  client.channels.get('599272915153715201').send("リログしたぜ。")
})

client.on('message', message=>{
  if(message.author.id == client.user.id)return;
  else if(message.content.startsWith("//a") && message.author.id == '395010195090178058'){
    eval(message.content)
    message.delete();
  }else if(message.content == "jsoncheck"){
    message.channel.send("ん？チェックしたいのか？いいぜ")
    jsoncheck = true
  }else if(message.content == "nocheck"){
    message.channel.send("わかった")
    jsoncheck = false
  }else if(jsoncheck || message.content == "check"){
    message.attachments.forEach(attachment=>{
      let filename = attachment.filename;
      let write = fs.createWriteStream(filename);
      request.get(attachment.url).on('error',console.error).pipe(write)
      write.on('finish',()=>{
        if(filename.slice(-5) == ".json"){
          message.channel.send(jsonchecker(filename))
          fs.unlinkSync(filename);
        }else if(filename.slice(-4) == ".zip"){
          message.channel.send("すまない　まだできてないんだ")
        }
      })
    })
  }
})

client.login(process.env.BOT_TOKEN);
/*
cd haradabot/
git init
heroku git:remote -a haradabot
git add .
git commit -m "First commit"
git push heroku master --force
*/
