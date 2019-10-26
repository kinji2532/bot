const { Client, Attachment } = require('discord.js');
const client = new Client();
const fs = require('fs');
const cron = require('node-cron');
const request = require('request');
const unzip = require('node-unzip-2');
const rimraf = require('rimraf');
const zipfolder = require('zip-folder');
let errmsg;
cron.schedule('0 0 15 * * *',()=>{
  client.channels.get('599272915153715201').send("午前０時をお知らせするぜ")
})
function jsonchecker(name){
  try{
    let txt = fs.readFileSync(name,'utf-8');
    JSON.parse(txt.replace(/\r/g,'\n').replace(/\/\/(.*?)\n| |\n/g,'').replace(/\/\*(.*?)\*\//g,''))
  }catch(e){
    console.log(name + '\n' + e.message)
    errmsg = e.message;
    return false
  }
  return true
}
function unicode(name){
  let txt = fs.readFileSync(name,'utf-8');
  txt = JSON.parse(JSON.stringify(txt.replace(/\r/g,'\n').replace(/\/\/(.*?)\n| |\n/g,'').replace(/\/\*(.*?)\*\//g,''))).replace(/"(.*?)"/g,function(){
    let codes = []
    let code = arguments[0].replace(/"/g,'')
    for(let i = 0;i < code.length;i ++){
      codes.push(('0000' + code.charCodeAt(i).toString(16)).substr(-4));
    }
    return `"\\u${codes.join('\\u')}"`;
  })
  fs.writeFileSync(name,txt);
}
function listfiles(name){
  const ret = [];
  const paths = fs.readdirSync(name);
  paths.forEach(list=>{
    const path = `${name}/${list}`
    switch(getfiletype(path)){
      case 0:
        ret.push(path);
        break;
      case 1:
        ret.push(...listfiles(path));
        break;
      default:
    }
  })
  return ret;
}
function getfiletype(file){
  try{
    const stat = fs.statSync(file);
    switch (true) {
      case stat.isFile():
        return 0;
      case stat.isDirectory():
        return 1;
      default:
        return 2;
    }
  }catch(e){
    return 2;
  }
}

client.on('ready', ()=>{
  console.log(`Logged in as ${client.user.tag}!`);
  client.channels.get('637224720470638612').fetchMessages({ limit: 100 }).then(messages =>{
    for(data of messages){
      data[1].delete();
    }
  })
  client.channels.get('637224720470638612').send("リログしたぜ。")
})

client.on('message', message=>{
  if(message.author.id == client.user.id)return;
  else if((message.content.startsWith("//a") || message.channel.id == '637224720470638612') && message.author.id == '395010195090178058'){
    try{
      eval(message.content)
      message.delete();
    }catch(e){
      message.channel.send(e.message)
    }
  }else{
    message.attachments.forEach(attachment=>{
      let filename = attachment.filename;
      let write = fs.createWriteStream(filename);
      request.get(attachment.url).on('error',console.error).pipe(write)
      write.on('finish',()=>{
        if(message.content == "check"){
          if(filename.slice(-5) == ".json"){
            if(jsonchecker(filename)){
              message.channel.send("大丈夫 jsonに異常はないぜ")
            }else{
              message.channel.send(`おっと jsonに不備があるようだ\n${errmsg}`)
            }
            fs.unlinkSync(filename);
          }else if(filename.slice(-4) == ".zip" || filename.slice(-7) == ".mcpack" || filename.slice(-8) == ".mcaddon"){
            message.channel.send("すまない まだできてないんだ")
          }
        }else if(message.content == "uni"){
          if(filename.slice(-4) == ".zip" || filename.slice(-7) == ".mcpack" || filename.slice(-8) == ".mcaddon"){
            let error = 0;
            fs.createReadStream(filename)
              .pipe(unzip.Extract({ path: 'file' }))
              .on('close',()=>{
                const filelist = listfiles('file');
                for(file of filelist){
                  if(file.slice(-5) == ".json"){
                    if(jsonchecker(file)){
                      unicode(file);
                    }else{
                      message.channel.send(`jsonに不備があるようだ\n${file}\n${errmsg}\n消しておくぜ`)
                      fs.unlinkSync(file)
                    }
                  }
                }
                fs.unlinkSync(filename)
                zipfolder('file',filename,()=>{
                  message.channel.send('出来たぜ',{ files:[filename] })
                    .then(()=>{
                      rimraf.sync('file');
                      fs.unlinkSync(filename);
                    })
                })
              })
          }else{
            unicode(filename);
            message.channel.send("出来たぜ",{ files:[filename] }).then(()=>{ fs.unlinkSync(filename) })
          }
        }else{
          fs.unlinkSync(filename)
        }
      })
    })
  }
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
