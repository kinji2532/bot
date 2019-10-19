const { Client, Attachment } = require('discord.js');
const client = new Client();
const fs = require('fs');
//const request = require('request');

function jsoncheck(name){
  try{
    let txt = fs.roadFileSync(name,'utf-8');
    JSON.parse(txt)
  }catch{
    return "error! jsonに不備があります"
  }
  return "ok! jsonに異常はありません"
}

client.on('ready', ()=>{
  console.log(`Logged in as ${client.user.tag}!`);
  client.channels.get('599272915153715201').send("リログしました。")
})

client.on('message', message=>{
  if(message.author.id == client.user.id)return;
  else if(message.content.startsWith("//a")){
    eval(message.content)
  }else{
    message.attachments.forEach(attachment=>{
      let filename = attachment.filename;
      //let write = fs.createWriteStream(filename);
      // request.get(attachment.url).on('error',console.error).pipe(write)
      // write.on('finish',()=>{
      //   if(filename.slice(-5) == ".json"){
      //     message.channel.send(jsoncheck(filename))
      //     fs.unlinkSync(filename);
      //   }
      // })
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
