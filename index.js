const puppeteer = require('puppeteer');
const CREDS = require('./creds');
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
  // await page.setViewport({width: 1024, height: 768});
  // await page.goto('https://github.com/login', {waitUntil: 'networkidle2'});
  // dom element selectors
  // const USERNAME_SELECTOR = '#login_field';
  // const PASSWORD_SELECTOR = '#password';
  // await page.click(USERNAME_SELECTOR);
  // await page.keyboard.type(CREDS.username);
  // await page.click(PASSWORD_SELECTOR);
  // await page.keyboard.type(CREDS.password);
  // // Submit form
  // await page.keyboard.press('Tab');  
  // await page.keyboard.press('Enter');  
  // await page.waitForNavigation();
  // const userToSearch = 'john';
  // const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;
  // await page.goto(searchUrl);
  await page.waitFor(2*1000);
  await page.goto('https://nucleus.niituniversity.in/', {waitUntil: 'networkidle2'});
  await page.click('#lnklogingoogle', {waitUntil: 'networkidle2'});
  // dom element selectors
  // const USERNAME_SELECTOR = '#SchSel_txtUserName';
  // const PASSWORD_SELECTOR = '#SchSel_txtPassword';
  // await page.click(USERNAME_SELECTOR);
  // await page.keyboard.type(CREDS.nu);
  // await page.click(PASSWORD_SELECTOR);
  // await page.keyboard.type(CREDS.pass);
  // // Submit form
  // await page.keyboard.press('Tab');  
  // await page.keyboard.press('Enter');  
  // await page.waitForNavigation();
  await page.waitFor(2*1000);
  await page.goto('https://nucleus.niituniversity.in/WebApp/StudParentDashBoard/DailyDiary.aspx', {waitUntil: 'networkidle2'});
  // await page.click('#ctl00_ContentPlaceHolder1_btnDDiary');
  await page.screenshot({ path: 'screenshots/nu.png' });
  // await browser.close();
}

run();
