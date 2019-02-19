const should = require('chai').should();
const { expect } = require('chai');
const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

describe('Lung Cancer Screening Smoke test', function() {
    this.timeout(0);
    let driver,
        website;
    before(async function() {
        const url = process.env.TEST_WEBSITE;
        if ( url ) {
            driver = await new Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(new firefox.Options().headless())
                .build();
            website = url;
            await driver.get(website);
            await driver.wait(until.elementLocated(By.id('modalTitle')), 10000);
            const understandBtn = await driver.findElement(By.id('Agree'));
            await driver.wait(until.elementIsVisible(understandBtn), 10000);
            await understandBtn.click();
            await driver.wait(until.elementIsNotVisible(understandBtn), 10000);
            const form = await driver.findElement(By.name('lcsForm'));
            await driver.wait(until.elementIsVisible(form), 10000);
        } else {
            console.log("No TEST_WEBSITE set");
            this.skip();
        }
    });

    after( async function(){
        driver.close();
    });

    it('Website should be set', function(){
        expect(website).to.be.a('string');
    });

    it('Should have title "National Lung Screening Trial"', async function() {
        const title = await driver.getTitle();
        expect(title).is.equal('National Lung Screening Trial');
    });

    it('Should have Calculate button', async function() {
        const calBtn = await driver.findElement(By.id('calculateBtn'));
        await driver.wait(until.elementIsVisible(calBtn));
        expect(await calBtn.getText()).to.equal('Calculate');
        const resetBtn = await driver.findElement(By.id('resetBtn'));
        expect(await resetBtn.getText()).to.equal('Reset');
    });

});


