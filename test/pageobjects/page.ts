import { browser } from '@wdio/globals'
import log from '../utils/logger';

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public open(path: string) {
        return browser.url(`/${path}`)
    }


    protected async waitAndClick(element: ChainablePromiseElement) {
        log.info('Waiting for element to be displayed and clicking:', await element.selector);
        await element.waitForDisplayed();
        await element.click();
        log.info('Clicked element:', await element.selector);
    }

    protected async fillInput(input: ChainablePromiseElement, value: string) {
        log.info('Waiting for input to be displayed and setting value:', await input.selector, value);
        await input.waitForDisplayed();
        await input.setValue(value);
        log.info('Set value for input:', await input.selector);
    }
}

