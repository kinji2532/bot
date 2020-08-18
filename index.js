//////////////////////////////////////////////////////////////
const { Client, MessageAttachment } = require('discord.js');
const client = new Client();
const fs = require('fs');
const request = require('request');
const cron = require('node-cron');
const path = require("path");
const https = require("https");
const rimraf = require("rimraf");
const { inspect } = require('util');
const J = {
  s:function(data){
    return JSON.stringify(data);
  },
  p:function(data){
    return JSON.parse(data);
  },
  c:function(data){
    return this.p(this.s(data));
  }
}
let command = {}
let typeError = data => {
  return [];
}
let messageCode = message =>{
  if(message.content.startsWith('test2')) eval(message.content.replace(/^test/g,''))
}
let unhandledCode = () => {}
let uncaughtCode = () => {}
let deleteCode = () => {}
let memberAddCode = () => {}
let memberRemoveCode = () => {}
let updateCode = () => {}
let reactionAddCode = () => {}
let reactionRemoveCode = () => {}
//////////////////////////////////////////////////////////////////
function testError(e,code="",revision=0){
  const data = J.c(e.stack.match(/>:(?<line>.*?):(?<column>.*?)\)/)?.groups||{line:1,column:1})
  const message = typeError(`${e.name}: ${e.message}`)
  return {
    embed:{
      title: (message[0]||e.name),
      thumbnail: {
        url: 'https://media.discordapp.net/attachments/576717465506021380/719155294546165760/image.png'
      },
      color: 0xff0000,
      description: `\`\`\`${(message[1]||e.message)}
line: ${data.line} write: ${data.column-revision}\`\`\``,
      fields: [
        {
          name: '**code**',
          value: code.split('\n')[data.line-1]||'実行コード内'
        }
      ]
    }
  }
}
function codeConnection(){
  request(process.env.mainCode,(e,r,body)=>{
    try{
      eval(body);
    }catch(e){
      client.channels.cache.get('637224720470638612').send('mainCode:エラーが起きたよ！',testError(e,body));
    }
  })
}
//////////////////////////////////////////////////////////////////
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const channel = client.channels.cache.get('637224720470638612');
  channel.bulkDelete(100);
  channel.send("起動");
  codeConnection();
});

client.on('message', message=>{
  if(message.author.id == '395010195090178058' && message.content == 'connect'){
    message.delete();
    codeConnection();
  }
});

client.login(process.env.BOT_TOKEN);
