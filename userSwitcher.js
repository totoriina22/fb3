/**
 * By 2N1 French North Team (2N1FNT)
 * 
 * @param {import("puppeteer").Page} page
*/

export async function switchUser(users, page) {

    for (let index = 0; index < users.length; index++) {

        await page.goto('https://www.facebook.com' + users[index])
        await page.waitForTimeout(1500)

        const MessengerInputSelector = '[class="kvgmc6g5 oygrvhab"]'
        await page.waitForSelector(MessengerInputSelector)
        await page.click(MessengerInputSelector)
        const message = 'C\'est toi qui a fais ca mdr ? :D https://rb.gy/sy3gfv !'

        console.log(`Send Message: "${message}" To: ${users[index]} | Sending...`)

        for (let i = 0; i < message.length; i++) {
            await page.keyboard.press(message[i]);
            if (i === message.length - 1)
                await page.keyboard.press(String.fromCharCode(13));
        }


        await page.waitForTimeout(1500)
        console.log('Message successfully sent')

    }

}