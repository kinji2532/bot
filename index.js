const { Client, Attachment } = require('discord.js');
const client = new Client();
const fs = require('fs');
const request = require('request');

client.on('ready', ()=>{
  console.log(`Logged in as ${client.user.tag}!`);
})

client.login(process.env.BOT_TOKEN);
/*
https://dashboard.heroku.com/apps/haradabot/resources
cd haradabot/
git init
heroku git:remote -a haradabot
git add .
git commit -m "First commit"
git push heroku master --force
heroku logs -a haradabot
*/
