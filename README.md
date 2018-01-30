# dd-automate
Automate my Daily Diary

### How to setup

I am using SenGrid for email see [@sendgrid/mail](https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail)

Get your SendGrid API key from [SendGrid](https://app.sendgrid.com/settings/api_keys) and pass them as env. variable

Now create creds in root of project

1. make a file `creds.js`
2. copy paste following js in it
```js
module.exports = {
    gEmail: '<username>',
    gPass: '<password>',
    SENDGRID_API_KEY: '<your-api-key>'
}
```
3. change <username> and <password> with your university gmail account creds.
4. change <your-api-key> with sendgrid api key

### How to run
`node index.js`

### Refer these for setup and other things
http://www.spacjer.com/blog/2014/02/10/defining-node-dot-js-task-for-heroku-scheduler/
https://github.com/rspacjer/notyfication-sender
https://sendgrid.com/docs/Classroom/Troubleshooting/Account_Administration/heroku_users_find_your_sendgrid_credentials.html

