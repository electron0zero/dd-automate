const puppeteer = require('puppeteer');
const CREDS = require('./creds');

/**
 * Get a random integer between `min` and `max`.
 * 
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
  });
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
  await page.waitFor(2*1000);
  await page.goto('https://nucleus.niituniversity.in/', {waitUntil: 'networkidle2'});
  await page.click('#lnklogingoogle', {waitUntil: 'networkidle2'});
  await page.waitFor(2*1000);
  await page.goto('https://nucleus.niituniversity.in/WebApp/StudParentDashBoard/DailyDiary.aspx', {waitUntil: 'networkidle2'});
  // await page.click('#ctl00_ContentPlaceHolder1_btnDDiary');
  // await browser.close();
  in_hour = ("0" + getRandomInt(8, 10)).slice(-2);
  in_min = ("0" + getRandomInt(1, 59)).slice(-2);
  out_hour = ("0" + getRandomInt(19, 22)).slice(-2);
  out_min = ("0" + getRandomInt(1, 59)).slice(-2);
  console.log(in_hour)
  console.log(in_min)
  console.log(out_hour)
  console.log(out_min)
  // fill in the in and out hours
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeinhr"]', in_hour);
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeinmin"]', in_min);
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeouthr"]', out_hour);
  await page.select('select[name="ctl00$ContentPlaceHolder1$Timeoutmin"]', out_min);
  // fill in the desc.
  await page.type('#txtDesc', 'Fixed a bug and worked on a feature', {delay: 10}); // Types slower, like a user
  // click the submit buttom
  await page.click('#ctl00_ContentPlaceHolder1_btnSubmit', {waitUntil: 'networkidle2'});
  // get contenet of alert box

  // take screenshot of page
  await page.screenshot({ path: 'screenshots/nu.png' });

}

run();
