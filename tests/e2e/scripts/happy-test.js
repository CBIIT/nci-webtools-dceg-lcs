const should = require('chai').should();
const { expect } = require('chai');
const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');


describe('Lung Cancer Screening Happy test', function() {
    this.timeout(0);
    let driver,
        website;

    let clickOption = async function (selector, optionText) {
        const selectInput = await driver.findElement(selector);
        const options = await selectInput.findElements(By.css('option'));
        for (const option of options) {
            if (await option.getText() === optionText) {
                await option.click();
                break;
            }
        }
    };

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

    it('Should be able to select/enter parameters', async function(){
        //Select age 60
        await clickOption(By.id('age'), '60');

        //Select gender to be Male
        await clickOption(By.id('gender'), 'Male');

        //Select BMI type
        await clickOption(By.id('bmiSelection'), 'BMI');

        //Enter BMI
        const bmiInput = await driver.findElement(By.id('bmi'));
        await driver.wait(until.elementIsVisible(bmiInput), 2000);
        bmiInput.sendKeys('25');

        //Select Race group
        await clickOption(By.id('race_group'), 'White');

        //Select Education
        await clickOption(By.id('education'), 'Less than high school');

        //Select smoker type
        await clickOption(By.id('smoker_type'), 'Current smoker');

        //Enter smoke info
        const cigsInput = await driver.findElement(By.id('cigs'), 2000);
        await driver.wait(until.elementIsVisible(cigsInput), 2000);
        await clickOption(By.id('start'), '10');
        await cigsInput.sendKeys('20');

        //Select lung disease info
        await clickOption(By.id('disease'), 'None');

        //Select family history
        await clickOption(By.id('history'), 'unknown');
    });

    it('Should be able to run calculate', async function() {
        const calcBtn = await driver.findElement(By.id('calculateBtn'));
        await calcBtn.click();
        await driver.wait(until.elementLocated(By.id('results')), 10000);
    });

    it('Should be able to view results', async function(){
        const resultBtn = await driver.findElement(By.id('resultBtn'));
        await resultBtn.click();

        const nextBtn1 = await driver.findElement(By.id('nextBtn1'));
        await driver.wait(until.elementIsVisible(nextBtn1), 2000);
        await nextBtn1.click();
        const chart_1 = await driver.findElement(By.id('chart_1'));
        await driver.wait(until.elementIsVisible(chart_1), 2000);
        const chart_2 = await driver.findElement(By.id('chart_2'));
        await driver.wait(until.elementIsVisible(chart_2), 2000);

        const nextBtn2 = await driver.findElement(By.id('nextBtn2'));
        await driver.wait(until.elementIsVisible(nextBtn2), 2000);
        await nextBtn2.click();
        const chart_3 = await driver.findElement(By.id('chart_3'));
        await driver.wait(until.elementIsVisible(chart_3), 2000);
        const chart_4 = await driver.findElement(By.id('chart_4'));
        await driver.wait(until.elementIsVisible(chart_4), 2000);

        const nextBtn3 = await driver.findElement(By.id('nextBtn3'));
        await driver.wait(until.elementIsVisible(nextBtn3), 2000);
        await nextBtn3.click();
        const chart_5 = await driver.findElement(By.id('chart_5'));
        await driver.wait(until.elementIsVisible(chart_5), 2000);
    });

});


