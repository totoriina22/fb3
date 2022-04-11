


import puppeteer from 'puppeteer'
import testUsers from './facebookIds.js' 
import { switchUser } from './userSwitcher.js'
/**
 * @param {Boolean} show 
 */

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