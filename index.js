const puppeteer = require('puppeteer');
const { keyboard, Key } = require('@nut-tree/nut-js');

class Bower {
    sleep(milliseconds) {return new Promise(resolve => setTimeout(resolve, milliseconds));}
    async init(homepageLink) {
        this.browser = await puppeteer.launch({
            headless: false,
            args: ['--start-fullscreen'],
            ignoreDefaultArgs: ['--enable-automation'],
            defaultViewport: null
        });
        this.homepage = await this.browser.newPage();
        this.homepage.goto(homepageLink);
    }
    async disconnect() {
        await this.browser.disconnect();
        this.browser = null;
        this.homepage = null;
        this.zoompage = null;
    }
    async launchZoom(startLink, email, password) {
        this.zoompage = await this.browser.newPage();

        await this.zoompage.goto('https://zoom.us/switch_account?backUrl=' + encodeURIComponent(startLink));
        await this.zoompage.evaluate(`
            document.getElementById('email').value = "` + email + `";
            document.getElementById('password').value = "` + password + `";
            document.forms[0].querySelector('button').click();`
        );
        await this.zoompage.waitForNavigation();
        await this.sleep(100);

        await keyboard.type(Key.Tab);
        await keyboard.type(Key.Tab);
        await keyboard.type(Key.Enter);

        await this.sleep(5000);
        await this.zoompage.close();
    }
    /*
    async evaluate(thisPage, strToEvaluate, putPageOnTop=true) {
        if (!thisPage instanceof Object) {
            console.log("ERROR.  The variable given is not an Object");
            return;
        }
        if (putPageOnTop) {
            await thisPage.bringToFront();
        }
        return await thisPage.evaluate(new Function(strToEvaluate));
    }
    */
}

(async () => {
    const bower = new Bower();
    await bower.init("file:///" + __dirname + '/web/index.html');
    //await bower.sleep(1000);
    //await bower.evaluate(bower.homepage, 'document.write("hi");return "hello"');
    await bower.sleep(1000);
    await bower.launchZoom('https://zoom.us/s/96138303673', 'brookfieldzoom@gmail.com', '4Nephi112');
    await bower.sleep(3000);
    await bower.disconnect();
})();