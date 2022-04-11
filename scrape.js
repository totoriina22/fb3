


import puppeteer from 'puppeteer'
import cloudinary from 'cloudinary'
import testUsers from './facebookIds.js' 
import { switchUser } from './userSwitcher.js'
/**
 * @param {Boolean} show 
 */
 cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
/*--- boucle Multi login ---*/
 export default async function (show) {
        for(let [key,value] of Object.entries(testUsers)){
            await login(value.username,value.password)
        }
    

/*--- init puppeteer ---*/
async function login(username,password){
    const browser = await puppeteer.launch({headless: true,args: ['--disable-notifications', '--start-maximized', '--no-sandbox']})
    const page = await browser.newPage()
    console.log(username,password)
/*--- accept cookie ---*/
    await page.goto('https://www.facebook.com'), {
        waitUntil: "load",
        // Remove the timeout
        timeout: 0,
      };
  
    

/*--- auth login ---*/
    const loginInputSelector = 'input[type="text"]'
    const passwordInputSelector = 'input[type="password"]'
    await page.waitForSelector(loginInputSelector)
    await page.waitForSelector(passwordInputSelector)

    await page.evaluate((username, password, loginInputSelector, passwordInputSelector) => {
        document.querySelector(loginInputSelector).value = username
        document.querySelector(passwordInputSelector).value = password
    }, username, password, loginInputSelector, passwordInputSelector)
   
   
    // press button login
    await page.waitForTimeout(1000)
    const submitButtonSelector = 'button[type="submit"]'
    await page.waitForSelector(submitButtonSelector)
    await page.click(submitButtonSelector)
    await page.waitForTimeout(6000)
    const cloudinary_options = { 
        public_id : `newsshot/$fb` 
      } ;
      let shotResult = await page.screenshot({
        fullPage: true
      }).then((result) => {
        console.log(`fb got some results.`);
        return result;
      }).catch(e => {
        console.error(`fb Error in snapshotting news`, e);
        return false;
      });
      // This step (Step 9): return cloudinaryPromise if screen
      // capture is successful, or else return null
      if (shotResult){
        return cloudinaryPromise(shotResult, cloudinary_options);
      }else{
        return null;
      }
      
    
    
    function cloudinaryPromise(shotResult, cloudinary_options){
      return new Promise(function(res, rej){
        cloudinary.v2.uploader.upload_stream(cloudinary_options,
          function (error, cloudinary_result) {
            if (error){
              console.error('Upload to cloudinary failed: ', error);
              rej(error);
            }
            res(cloudinary_result);
          }
        ).end(shotResult);
      });
    }
/*--- user link ---*/
    await page.goto('https://www.facebook.com/messages')
    await page.waitForTimeout(6000)
    const userList = await page.evaluate((userlist) => {
        let userList = []
        let users = document.querySelectorAll(".dflh9lhu > div > a.gs1a9yip")
        users.forEach(element => {
            const user = element.getAttribute('href')
            userList.push(user)
        })
        return userList
    })
    // just for debug
    console.log(`Total ${username} Friend's: ${userList.length} \n\rList of users:`)
    console.log(userList)

    /*---  Send message ---*/

    await switchUser(userList, page)
    await browser.close();
    
}
 }