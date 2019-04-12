const resolvePath = require('path').resolve;

const timeOutConf = require('../config/timeOuts.json');

const TIMEOUT_MILLISECONDS = timeOutConf.timeOuts.enormous;
const INTERVAL_MILLISECONDS = timeOutConf.intervals.enormous;

/**
 * Utility class which wrappers WebDriverIO browser methods.
 */
class Common {

    /**
     * Set the value to a Web element.
     * @param {string} webElement.
     * @param {string|number} inputString Value to set.
     */
    static setValue(webElement, inputString) {
        try {
            this.waitForVisibility(webElement);
            log.info(`Set the value for element: "${webElement}" with value: "${inputString}"`);
            $(webElement).setValue(inputString);
        } catch (e) {
            log.error(`Error to set the value: "${webElement}" with value: "${inputString}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Get the text content form a Web element.
     * @param {string} webElement.
     * @returns {*|string|string[]} The text value.
     */
    static getText(webElement) {
        try {
            this.waitForVisibility(webElement);
            log.info(`Get the text value for element: "${webElement}"`);
            return $(webElement).getText();
        } catch (e) {
            log.error(`Error to get the text value for element: "${webElement}"`, e.message);
            throw new Error(e);
        }

    }

    /**
     * Click on a Web element.
     * @param {string} webElement.
     */
    static click(webElement) {
        try {
            this.waitForVisibility(webElement);
            log.info(`Click the element: "${webElement}"`);
            $(webElement).click();
        } catch (e) {
            log.error(`Error to click the element: "${webElement}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Wait for a Web element is visible.
     * @param {string} webElement.
     */
    static waitForVisibility(webElement) {
        try {
            log.info(`Wait for visible the element: "${webElement}"`);
            $(webElement).waitForDisplayed(TIMEOUT_MILLISECONDS);
        } catch (e) {
            log.error(`Error to wait for visible the element: "${webElement}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Return true if the Web element is visible.
     * @param webElement.
     * @returns {boolean} Whether the Web element is visible.
     */
    static isVisible(webElement) {
        try {
            log.info(`Is visible the element: "${webElement}"`);
            return $(webElement).isDisplayed();//browser.element(webElement).isVisible();
        } catch (e) {
            log.error(`Error to check is visible the element: "${webElement}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Get the title of the current opened website.
     * @returns {string} The title.
     */
    static getTitle() {
        try {
            log.info('Get tittle.');
            return browser.getTitle();
        } catch (e) {
            log.error('Error to get tittle.', e.message);
            throw new Error(e);
        }
    }

    /**
     * Get the value of a Web element attribute.
     * @param {string} webElement.
     * @param {string} attributeName.
     * @returns {string|string[]} The value of the attribute.
     */
    static getAttribute(webElement, attributeName) {
        try {
            this.waitForVisibility(webElement);
            log.info(`Get attribute for element: "${webElement}" attribute name to get: "${attributeName}"`);
            return $(webElement).getAttribute(attributeName);//browser.getAttribute(webElement, attributeName);
        } catch (e) {
            log.error(`Error to get attribute for element: "${webElement}" attribute name to get: "${attributeName}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Checks a Web Element, by default the second parameter is true. If the parameter is false uncheck the element.
     * @param {string} webElement.
     * @param {boolean} check optional whether the web element should be checked.
     */
    static check(webElement, check = true) {
        try {
            this.waitForVisibility(webElement);
            log.info(`Check the element: "${webElement}" check value: "${check}"`);
            if (!$(webElement).isSelected()) {
                check ? this.click(webElement) : void 0;
            } else {
                !check ? this.click(webElement) : void 0;
            }
        } catch (e) {
            log.error(`Error to check the element: "${webElement}" check value: "${check}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Select option with a specific value.
     * @param {string} webElement.
     * @param {string} value to set.
     * @param {boolean} allowEmptyValue Whether the method should try to set an empty value.
     */
    static selectByValue(webElement, value, allowEmptyValue = false) {
        try {
            if (value !== '' || allowEmptyValue) {
                this.waitForVisibility(webElement);
                this.waitUntil(() => {
                    log.info(`Select by value the element: "${webElement}" with value: "${value}"`);
                    $(webElement).selectByAttribute('value', value);
                    return $(webElement).getValue() === value;
                }, `it was not possible to se the value: ${value} to the Web Element: ${webElement}`);
            }
        } catch (e) {
            log.error(`Error to select by value the element: "${webElement}" with value: "${value}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Select option with a specific index.
     * @param {string} webElement.
     * @param {string|integer} index to set.
     */
    static selectByIndex(webElement, index) {
        try {
            this.waitForVisibility(webElement);
            log.info(`Select by index the element: "${webElement}" with index: "${index}"`);
            $(webElement).selectByIndex(index);
        } catch (e) {
            log.error(`Error to select by index the element: "${webElement}" with index: "${index}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Accept the currently displayed alert dialog.
     */
    static alertAccept() {
        try {
            log.info('Alert accept.');
            browser.acceptAlert();
        } catch (e) {
            log.error('Error to Alert accept.', e.message);
            throw new Error('alert message it is not displayed' + e);
        }
    }

    /**
     * Return true or false if the selected webElement is enabled.
     * @returns {boolean}
     */
    static isEnabled(webElement) {
        try {
            log.info(`Is enabled the element: "${webElement}"`);
            return $(webElement).isEnabled();
        } catch (e) {
            log.error(`Error to check is enabled the element: "${webElement}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Return true if the Web element exists.
     * @param webElement
     * @returns {boolean} Whether the Web element exists.
     */
    static isExisting(webElement) {
        try {
            log.info(`Is existing the element: "${webElement}"`);
            return $(webElement).isExisting();
        } catch (e) {
            log.error(`Error to check is existing the element: "${webElement}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Click a webElement receiving by parameter the webElement Id
     * @param elementId
     */
    static clickElementId(elementId) {
        try {
            log.info(`Click element by id with the element id: "${elementId}"`);
            browser.elementClick(elementId);
        } catch (e) {
            log.error(`Error to click element by id with the element id: "${elementId}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Get all webElements in the page given a webElement string
     * @param {string} webElement
     * @param {string} using The location strategy to find the element.
     * @returns {Array} of webElements
     */
    static getElementsId(webElement, using) {
        try {
            this.waitForVisibility(webElement);
            log.info(`Get elements by id with the element id: "${webElement}"`);
            return browser.findElements(using, webElement);
        } catch (e) {
            log.error(`Error to get elements by id with the element id: "${webElement}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Close browser.
     */
    static closeBrowser() {
        try {
            log.info('Close browser.');
            browser.closeWindow();
            const handles = this.getWindowHandles();
            this.switchToWindow(handles[0]);
        } catch (e) {
            log.error('Error to close browser.', e.message);
            throw new Error(e);
        }
    }

    /**
     * Given a selector corresponding to an <input type=file> chooseFile will upload the
     * local file to the browser machine and fill the form accordingly.
     * It does not submit the form for you. This command only works for desktop browser.
     * @param {string} webElement Input element.
     * @param {string} filePath Local path to file to be uploaded.
     * @param {boolean} skipVisibilityCheck Whether it needed to check the visibility of the webElement.
     */
    static chooseFile(webElement, filePath, skipVisibilityCheck = false) {
        try {
            if (!skipVisibilityCheck) {
                this.waitForVisibility(webElement);
            }
            log.info(`Choose File with element: "${webElement}" and file path: "${filePath}"`);
            $(webElement).setValue(resolvePath(filePath));
        } catch (e) {
            log.error(`Error to choose File with element: "${webElement}" and file path: "${filePath}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * /**
     * It expects a condition and waits until that condition is fulfilled with a truthy value or the timeout is reached.
     * If you use the WDIO testrunner the commands within the condition are getting executed synchronously
     * like in your test.
     * @param {Function} condition The condition to wait on.
     * @param {String} timeoutMsg Error message to thrown when waitUntil times out.
     * @param {Function} condition The condition to wait on.
     * @param {String} timeoutMsg Error message to thrown when waitUntil times out.
     * @param {Number} timeout The timeout in ms.
     * @param {Number} interval Interval between condition checks (default: 500)
     * @returns {*}
     */
    static waitUntil(condition, timeoutMsg, timeout = TIMEOUT_MILLISECONDS, interval = INTERVAL_MILLISECONDS) {
        try {
            log.info(`Wait Until condition: "${condition}", timeout: "${timeout}, interval: "${interval}"`);
            return browser.waitUntil(condition, timeout, timeoutMsg, interval);
        } catch (e) {
            log.error(`Error to wait Until condition: "${condition}", timeout: "${timeout}, interval: "${interval}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Wait for an element for the provided amount of milliseconds to be present within the DOM. Returns true if
     * the selector matches at least one element that exists in the DOM, otherwise throws an error. If the reverse
     * flag is true, the command will instead return true if the selector does not match any elements.
     * @param webElement
     * @param error If exists it overrides the default error message, use 'undefined' to keep the default error.
     * @param reverse If true it instead waits for the selector to not match any elements (default: false)
     * @param timeout The timeout to wait.
     */
    static waitForExist(webElement, error = undefined, reverse = false, timeout = TIMEOUT_MILLISECONDS) {
        try {
            log.info(`Wait for exist the element: "${webElement}"`);
            return $(webElement).waitForExist(timeout, reverse, error);
        } catch (e) {
            log.error(`Error to wait for visible the element: "${webElement}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Method to refresh page
     */
    static refreshPage() {
        browser.refresh();
    }

    /**
     * Method to switch to frame
     * @param webElementFrame
     * @param {string} using The using strategy to find elements.
     */
    static switchToFrame(webElementFrame, using) {
        const WAIT_TIME = 1000;
        browser.pause(WAIT_TIME);
        this.waitForVisibility(webElementFrame);
        browser.switchToFrame(browser.findElement(using, webElementFrame));
    }

    /**
     * Method to back to window from Frame
     */
    static backToWindowFromFrame() {
        browser.switchToParentFrame();
    }

    /**
     * Search for multiple elements on the page, starting from an element.
     * The located elements will be returned as a WebElement JSON objects.
     * The table below lists the locator strategies that each server should support.
     * Elements should be returned in the order located in the DOM.
     * @param {string} id ID of a WebElement JSON object to route the command to
     * @param {string} selector Selector to query the elements
     * @param {string} using The local strategy to use to find the elements.
     * @returns {Array<object>>} A list of WebElement JSON objects for the located elements.
     */
    static getElementIdElements(id, selector, using) {
        try {
            log.info(`Getting the elements using the id: "${id}" and selector: ${selector}`);
            return browser.findElementsFromElement(id, using, selector);
        } catch (e) {
            log.error(`Error getting the elements using the id: "${id}" and selector: ${selector}`, e.message);
            throw new Error(e);
        }

    }

    /**
     * Returns the visible text for the element.
     * @param id {string} ID of a WebElement JSON object to route the command to
     * @returns {string} visible text for the element.
     */
    static getElementIdText(id) {
        try {
            log.info(`Getting the tex form element using the id: "${id}"`);
            return browser.getElementText(id);
        } catch (e) {
            log.error(`Error getting the tex form element using the id: "${id}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * The Switch To Window command is used to select the current top-level browsing context for the current session,
     * i.e. the one that will be used for processing commands.
     * @param {string} handle A string representing a window handle, should be one of the strings that was returned in
     * a call to getWindowHandles
     */
    static switchToWindow(handle) {
        browser.switchToWindow(handle);
    }

    /**
     * The Get Window Handles command returns a list of window handles for every open top-level browsing context.
     * The order in which the window handles are returned is arbitrary.
     * @returns {String[]} An array which is a list of window handles.
     */
    static getWindowHandles() {
        return browser.getWindowHandles();
    }

    /**
     * Move the mouse by an offset of the specified element. If no element is specified, the move is relative to the
     * current mouse cursor. If an element is provided but no offset, the mouse will be moved to the center of the element.
     * If the element is not visible, it will be scrolled into view.
     * @param {string} webElement The element web to interact.
     */
    static moveTo(webElement) {
        $(webElement).moveTo();
    }

    /**
     * Method to get text from all occurrences in UI for the WebElement
     * @param {string} webElement The element web to interact.
     * @return {Array<string>}, string list with all occurrences for the webElement
     */
    static getAllText(webElement) {
        let listWebElements = $$(webElement);
        let stringArray = [];
        listWebElements.forEach(element => {
            stringArray.push(element.getText());
        });
        return stringArray;
    }

    /**
     * Method to get web element
     * @param elementLocator, locator for the element
     * @returns {WebdriverIO.Element}, Object with all information
     */
    static getWebElement(elementLocator) {
        try {
            return $(elementLocator);
        } catch (e) {
            log.error(`Error to get the WebElement for element: "${elementLocator}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Method to get all element matched with locator
     * @param {WebdriverIO.Element} base, represent the webELement like as base
     * @param {string} elementLocator, locator for the elements
     * @returns {Array<WebdriverIO.Element<void>>}, Object with all information
     */
    static getWebElementListFromBase(base, elementLocator) {
        try {
            return base.$$(elementLocator);
        } catch (e) {
            log.error(`Error to get the WebElements List"${elementLocator}" with base: "${base}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Method to get element matched with locator
     * @param {WebdriverIO.Element} base, represent the webELement like as base
     * @param {string} elementLocator, locator for the element
     * @returns {WebdriverIO.Element}, Object with all information
     */
    static getWebElementFromBase(base, elementLocator) {
        try {
            return base.$(elementLocator);
        } catch (e) {
            log.error(`Error to get the WebElement: "${elementLocator}" with base: "${base}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Method to get text form webElement
     * @param {WebdriverIO.Element} webElement, the webElement to get text
     * @returns {string}, value
     */
    static getTextFromWebElement(webElement) {
        try {
            return webElement.getText();
        } catch (e) {
            log.error(`Error to get the text for WebElement: "${webElement}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Return true if the webElement has been selected.
     * @param {string} webElement The element to verify if it is selected.
     * @returns {boolean} Whether the webElement has been selected.
     */
    static isSelected(webElement) {
        try {
            this.waitForVisibility(webElement);
            log.info(`Is selected the element: "${webElement}"`);
            return $(webElement).isSelected();
        } catch (e) {
            log.error(`Error to verify if the element is selected: "${webElement}"`, e.message);
            throw new Error(e);
        }
    }

    /**
     * Method to get the value from all occurrences in UI for the WebElement
     * @param {string} webElement The element web to interact.
     * @return {Array<string>}, the value list with all occurrences for the webElement
     */
    static getAllValue(webElement) {
        let listWebElements = $$(webElement);
        let stringArray = [];
        listWebElements.forEach(element => {
            stringArray.push(element.getValue());
        });
        return stringArray;
    }

    /**
     * Method to verify if an element exists with waitUntil
     * Return true if the Web element exists.
     * @param {string} webElement The element web to interact.
     * @returns {boolean} Whether the Web element exists.
     */
    static elementExists(webElement) {
        try {
            Common.waitUntil(() => $(webElement).isExisting(), `${webElement}: Element don't exists`, timeOutConf.timeOuts.short,
                timeOutConf.intervals.short);
            return true;
        } catch (e) {
            log.error(`Error to verify if the element exists: "${e}"`, e.message);
            return false;
        }
    }

    /**
     * Method to exit process (test Runner) and close window
     * To solve problem related to: https://github.com/webdriverio/webdriverio/issues/2606
     */
    static exitProcess() {
        browser.closeWindow();
        process.send({
            event: 'runner:end',
            failures: 1
        });
        process.exit(1);
    }

    /**
     * Wait for an element for the provided amount of milliseconds to be present within the DOM. Returns true if
     * the selector matches at least one element that exists in the DOM, otherwise return false. If the reverse
     * flag is true, the command will instead return true if the selector does not match any elements.
     * @param webElement
     * @param error If exists it overrides the default error message, use 'undefined' to keep the default error.
     * @param reverse If true it instead waits for the selector to not match any elements (default: false)
     * @param timeout The timeout to wait.
     */
    static isExistingWithWait(webElement, error = undefined, reverse = false, timeout = TIMEOUT_MILLISECONDS) {
        try {
            log.info(`Wait for exist the element: "${webElement}"`);
            return $(webElement).waitForExist(timeout, reverse, error);
        } catch (e) {
            log.error(`Error to wait for visible the element: "${webElement}"`, e.message);
            return false;
        }
    }
}

module.exports = Common;
