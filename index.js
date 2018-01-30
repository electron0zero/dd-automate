var time = require('time');
const puppeteer = require('puppeteer');
const CREDS = require('./creds');
const sgMail = require('@sendgrid/mail');

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
sgMail.setApiKey(CREDS.SENDGRID_API_KEY);

// Text for weekend
weekend_text = "Weekend - Leave at Office"

// texts for weekdays - total 9
week_texts = [
"Fixed a bug and made a PR",
"Merged a feature I was working on",
"Debugged an issue",
"Worked on a feature",
"Fixed a bug and release it to production",
"Fixed a consumer facing bug",
"Found and fixed a bug",
"Discussed new feature and worked on it",
"Worked on onging feature"]

// message for email we send when we reach at the end of run function
message_for_email = "<h2>dd-automate email</h2><br>"

// catch everything uncaught and email me when this happens
// consider this poor man's monitoring
process.on('uncaughtException', function (err) {
  now = new Date().toString()
  message = "<h2>Something Happend in dd-automate which was unexpacted</h2>"
  message = message + "<p>At Time: " + now + "</p><br>"
  message = message + "<p><strong>Error log</strong></p>"
  message = message + "<pre>" + err.stack + "</pre>"
  console.log(message)
  sendEmail("Error in dd-automate - uncaughtException", message)
});

// ========================
// Helper Functions
// ========================

// Get a random integer between 'min' and 'max' 
// returned number is inclusive of min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// Tells if it's weekend in India (IST timezone)
function isWeekendInIST() {
  t = new time.Date();
  t.setTimezone("Asia/Calcutta");
  message_for_email = message_for_email + "<p>Filling Daily Diary at: " + t.toString() + "</p>"
  // console.log(t.toString())
  day = t.getDay()
  // 6 = Saturday, 0 = Sunday
  isWeekend = (day == 6) || (day == 0);
  return isWeekend
}
// get desc text to fill in, it takes care of weekend and weekdays
function getText() {
  // in JS function is true, so without () it will go in true always
  if (isWeekendInIST()) {
    return weekend_text
  } 
  else{
    return week_texts[getRandomInt(0,(week_texts.length - 1))]
  }
}
// build email message object
function buildMessage(subject, message){
  const msg = {
    to: 'devversitymail@gmail.com',
    from: 'no-reply@dd-automate.com',
    subject: subject,
    text: message,
    html: message
  };
  return msg  
}
// send email
function sendEmail(subject, message){
  sgMail.send(buildMessage(subject, message));
}

// =====================================
// async run() function
// =====================================

// this function is resposnible for all puppetier things
async function run() {
  // config browser
  const browser = await puppeteer.launch({
    headless: false,
  });
  // Log Into University Google Account
  const pageg = await browser.newPage();
  await pageg.goto('https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin', {waitUntil: 'networkidle2'});
  // DOM element selectors
  const USERNAME_SELECTOR = '#identifierId';
  const PASSWORD_SELECTOR = '#password';
  await pageg.click(USERNAME_SELECTOR);
  await pageg.keyboard.type(CREDS.gEmail);
  await pageg.keyboard.press('Tab');  
  await pageg.keyboard.press('Tab');
  await pageg.keyboard.press('Enter');
  await pageg.waitFor(10000)
  await pageg.keyboard.type(CREDS.gPass);
  await pageg.keyboard.press('Tab');
  await pageg.keyboard.press('Enter');

  // In a new page log into NU ERP
  const page = await browser.newPage();

  // handle popup messages
  page.on('dialog', async dialog => {
    message_for_email = message_for_email + "<p>Message in Popup: " + dialog.message() + "</p>"
    dialog.accept(); // click ok on alert
  });
  // log into NU ERP
  // wait for good amount of time to ensure that page gets loaded
  await page.waitFor(10*1000);
  await page.goto('https://nucleus.niituniversity.in/', {waitUntil: 'networkidle2'});
  await page.click('#lnklogingoogle', {waitUntil: 'networkidle2'});
  await page.waitFor(10*1000);
  await page.goto('https://nucleus.niituniversity.in/WebApp/StudParentDashBoard/DailyDiary.aspx', {waitUntil: 'networkidle2'});

  // generate random in and out time in ranges
  in_hour = ("0" + getRandomInt(8, 10)).slice(-2);
  in_min = ("0" + getRandomInt(1, 59)).slice(-2);
  out_hour = ("0" + getRandomInt(19, 22)).slice(-2);
  out_min = ("0" + getRandomInt(1, 59)).slice(-2);
  message_for_email = message_for_email + "<p>In Time: " + in_hour + ":" + in_min + "</p>" 
  message_for_email = message_for_email + "<p>Out Time: " + out_hour + ":" + out_min + "</p>"

  // fill in the in and out hours
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeinhr"]', in_hour);
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeinmin"]', in_min);
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeouthr"]', out_hour);
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeoutmin"]', out_min);

  // fill in the desc.
  text_for_desc = getText();
  message_for_email = message_for_email + "<p>Desc: " + text_for_desc + "</p>"
  await page.type('#txtDesc', text_for_desc, {delay: 10}); // Types slower, like a user

  // click the submit buttom
  await page.click('#ctl00_ContentPlaceHolder1_btnSubmit', {waitUntil: 'networkidle2'});

  // send Email
  sendEmail("dd-automate - Daily Diary Email", message_for_email)
}

// ================================
// main execution point, run() will
// run the whole routine
// ================================

// catch error an email me
// another bit of poor man's monitoring
try {
  run();
} catch (err) {
  now = new Date().toString()
  message = "<h2>run() failed in dd-automate</h2>"
  message = message + "<p>At Time: " + now + "</p><br>"
  message = message + "<p><strong>Error log</strong></p>"
  message = message + "<pre>" + err.stack + "</pre>"
  console.log(message)
  sendEmail("Error in dd-automate - run() Failed", message)
}
