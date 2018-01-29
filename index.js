var time = require('time');
const puppeteer = require('puppeteer');
const CREDS = require('./creds');

// Text for weekend
weekend_text = "Weekend - Leave at Office"

// texts for weekdays
// total 9
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

message_for_email = "dd-automate email \n\n\n"

/**
 * Get a random integer between `min` and `max`.
 * returned number is inclusive of min and max
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// for (i = 0; i < 1000; i++ ){
//   console.log(getRandomInt(1, 10))
// }

// Tells if it's weekend in India (IST timezone)
function isWeekendInIST() {
  t = new time.Date();
  t.setTimezone("Asia/Calcutta");
  message_for_email = message_for_email + "Filling Daily Diary at: " + t.toString() + "\n"
  // console.log(t.toString())
  day = t.getDay()
  // 6 = Saturday, 0 = Sunday
  isWeekend = (day == 6) || (day == 0);
  return isWeekend
}

function getText() {
  // in JS function is true, so without () it will go in true always
  if (isWeekendInIST()) {
    return weekend_text
  } 
  else{
    return week_texts[getRandomInt(0,8)]
  }
}

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
  });
  // Log Into University Google Account
  const pageg = await browser.newPage();
  await pageg.goto('https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin', {waitUntil: 'networkidle2'});
  // dom element selectors
  const USERNAME_SELECTOR = '#identifierId';
  const PASSWORD_SELECTOR = '#password';
  await pageg.click(USERNAME_SELECTOR);
  await pageg.keyboard.type(CREDS.gu);
  await pageg.keyboard.press('Tab');  
  await pageg.keyboard.press('Tab');
  await pageg.keyboard.press('Enter');
  // await pageg.click(PASSWORD_SELECTOR);
  await pageg.waitFor(1000)
  await pageg.keyboard.type(CREDS.gp);
  await pageg.keyboard.press('Tab');
  await pageg.keyboard.press('Enter');  

  const page = await browser.newPage();
  page.on('dialog', async dialog => {
    message_for_email = message_for_email + "Message in Popup: " + dialog.message() + "\n"
    // console.log(dialog.message());
    dialog.accept(); // click ok on alert
  });
  // log into NU ERP
  await page.waitFor(5*1000);
  await page.goto('https://nucleus.niituniversity.in/', {waitUntil: 'networkidle2'});
  await page.click('#lnklogingoogle', {waitUntil: 'networkidle2'});
  await page.waitFor(5*1000);
  await page.goto('https://nucleus.niituniversity.in/WebApp/StudParentDashBoard/DailyDiary.aspx', {waitUntil: 'networkidle2'});
  // await page.click('#ctl00_ContentPlaceHolder1_btnDDiary');
  // await browser.close();
  in_hour = ("0" + getRandomInt(8, 10)).slice(-2);
  in_min = ("0" + getRandomInt(1, 59)).slice(-2);
  out_hour = ("0" + getRandomInt(19, 22)).slice(-2);
  out_min = ("0" + getRandomInt(1, 59)).slice(-2);
  message_for_email = message_for_email + "In Time: " + in_hour + ":" + in_min + "\n" 
  message_for_email = message_for_email + "out Time: " + out_hour + ":" + out_min + "\n"
  // console.log(in_hour)
  // console.log(in_min)
  // console.log(out_hour)
  // console.log(out_min)
  // fill in the in and out hours
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeinhr"]', in_hour);
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeinmin"]', in_min);
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeouthr"]', out_hour);
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeoutmin"]', out_min);
  // fill in the desc.
  text_for_desc = getText();
  message_for_email = message_for_email + "Desc: " + text_for_desc + "\n"
  await page.type('#txtDesc', text_for_desc, {delay: 10}); // Types slower, like a user
  // click the submit buttom
  await page.click('#ctl00_ContentPlaceHolder1_btnSubmit', {waitUntil: 'networkidle2'});
  // log email message
  console.log(message_for_email)
}

// console.log(isWeekendInIST());
// console.log(getText())
run();
