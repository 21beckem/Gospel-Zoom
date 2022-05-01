const puppeteer = require('puppeteer');
const {getEdgePath} = require('edge-paths');
const { screen, mouse, keyboard, Key, Point } = require('@nut-tree/nut-js');
class Bower {
    constructor() {
        this.zoomRunning = false;
        this.ending = false;
        this.homepage = null;
    }
    sleep(milliseconds) {return new Promise(resolve => setTimeout(resolve, milliseconds));}
    async init(homepageLink) {
        //getting some useful info
        this.screen_width = await screen.width();
        this.screen_height = await screen.height();

        //the actual init
        this.browser = await puppeteer.launch({
            executablePath: getEdgePath(),
            headless: false,
            args: ['--start-fullscreen'],
            ignoreDefaultArgs: ['--enable-automation'],
            defaultViewport: null
        });
        this.homepage = await this.browser.newPage();
        await this.homepage.goto(homepageLink);
        // make sure no popups
        await this.sleep(500);
        await keyboard.type(Key.Escape);
        await this.sleep(1000);
        await keyboard.type(Key.Escape);
        
        await mouse.setPosition(new Point(this.screen_height, this.screen_width / 2));
        await mouse.leftClick();

        await this.homepage.exposeFunction('shutdown', async () => {
            await this.destroy();
            //exec('shutdown /s /t 1');
            console.log('would normally shut down now...');
        });
        this.homepage.on('dialog', async dialog => {
            console.log('dialog');
            console.log(dialog.message());
            await dialog.dismiss();
        });
    }
    async destroy() {
        await this.browser.close();
        this.browser = null;
        this.homepage = null;
        this.zoompage = null;
    }
    async launchZoom(startLink, email, password, _callback=()=>{}) {
        this.zoompage = await this.browser.newPage();
        //console.log('https://zoom.us/switch_account?backUrl=' + startLink);

        await this.zoompage.goto('https://zoom.us/switch_account?backUrl=' + startLink);
        await this.zoompage.evaluate(`
            document.getElementById('email').value = "` + email + `";
            document.getElementById('password').value = "` + password + `";
            document.forms[0].querySelector('button').click();`
        );
        await this.zoompage.waitForNavigation();
        await this.sleep(100);
        let launched = !(await this.zoompage.evaluate(`document.body.innerText.includes("cannot start")`));
        _callback(launched);
        if (!launched) {
            await this.zoompage.close();
            return false;
        }
        
        await keyboard.type(Key.Tab);
        await keyboard.type(Key.Tab);
        await keyboard.type(Key.Enter);

        this.zoomRunning = true;
        await this.sleep(5000);
        await this.zoompage.close();
        await this.sleep(3000);
        await mouse.setPosition(new Point(this.screen_height / 2, this.screen_width / 2));
        await mouse.leftClick();
        await this.sleep(100);
        await mouse.setPosition(new Point(this.screen_height, this.screen_width / 2));
        await mouse.leftClick();
        await this.sleep(50);
        await keyboard.pressKey(Key.LeftAlt, Key.Tab);
        this.sleep(250);
        await keyboard.releaseKey(Key.LeftAlt, Key.Tab);
        return true;
    }
    async zoomToggle(AorV) {
        let avKey = (AorV.toLowerCase()=='a') ? Key.A : Key.V;
        await keyboard.pressKey(Key.LeftAlt, avKey);
        await keyboard.releaseKey(Key.LeftAlt, avKey);
    }
    async zoomPressEnd() {
        if (this.ending) {
            await keyboard.pressKey(Key.LeftAlt, Key.Q);
            await keyboard.releaseKey(Key.LeftAlt, Key.Q);
            await this.sleep(100);
            await keyboard.type(Key.Enter);
            await mouse.setPosition(new Point(this.screen_width, this.screen_width / 2));
            await this.sleep(500);
            await mouse.leftClick();
            this.ending = false;
            this.zoomRunning = false;
            return true;
        } else {
            this.ending = true;
            await keyboard.pressKey(Key.LeftAlt, Key.Q);
            await keyboard.releaseKey(Key.LeftAlt, Key.Q);
            await this.sleep(2000);
            await keyboard.type(Key.Escape);
            this.ending = false;
            return false;
        }
    }
    async invoke(function_call) {
        if (this.homepage != null) {
            await this.homepage.evaluate(function_call);
        }
    }
}
module.exports = { Bower };
