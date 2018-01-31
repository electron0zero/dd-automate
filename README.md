# dd-automate
Automate my Daily Diary

### How to setup

I am using SenGrid for email see [@sendgrid/mail](https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail)

Get your SendGrid API key from [SendGrid](https://app.sendgrid.com/settings/api_keys) and pass them as env. variable

Now create creds in you [heroku project using config](https://devcenter.heroku.com/articles/config-vars)

- Using GUI [go here and set them](https://dashboard.heroku.com/apps/dd-automate/settings)
- Using command line
`heroku config:set EMAIL=<university-email>`
`heroku config:set PASS=<password>`
`heroku config:set SENDGRID_API_KEY=<your-api-key>`
- change <university-email> and <password> with your university gmail account creds.
- change <your-api-key> with sendgrid api key

for local developemt just export/set these env vars.

### How to run
- Install stuff with - `npm install`
- Job `npm run job` (you can change `headless: false` to see GUI)
- Dummy Server - `npm start`

OR

run using [heroku local command](https://devcenter.heroku.com/articles/heroku-local)

### Deplyment

0. have a hello word node app so heroku can treat this a valid node app
#### Heroku
1. do usual heroku things, login, project create etc.
2. add this [buildpack](https://github.com/jontewks/puppeteer-heroku-buildpack) to install required dependcies for puppeteer
3. force it as nodejs app using nodejs buildpack
3. add credit card(if not added) so we can add scheduler addon
3. configure cron to run it daily at a time

- `heroku create dd-automate`
- `heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack`
- `heroku buildpacks:set heroku/nodejs`
- `heroku addons:add scheduler`
- `git push heroku master`

Go to Heroku Scheduler App for the app and config scheduler and type our job

### Refer these for setup and other thing
http://www.spacjer.com/blog/2014/02/10/defining-node-dot-js-task-for-heroku-scheduler/

https://github.com/rspacjer/notyfication-sender

https://sendgrid.com/docs/Classroom/Troubleshooting/Account_Administration/heroku_users_find_your_sendgrid_credentials.html

https://timleland.com/headless-chrome-on-heroku/

https://github.com/jontewks/puppeteer-heroku-buildpack
