import { $ } from '@wdio/globals'
import Page from './page.js';
import log from '../utils/logger';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class OnboardPage extends Page {
    /**
     * getter for the "Need New Wallet" button
     */
    public get btnNeedNewWallet() {
        return $('[data-testid="btn-need-new-wallet"]');
    }

    /**
     * a method to click on the "Need New Wallet" button
     */
    public async clickNeedNewWalletButton() {
        log.info('Clicking Need New Wallet button');
        await this.waitAndClick(this.btnNeedNewWallet)
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open() {
        log.info('Opening OnboardPage');
        return super.open('onboard');
    }
}

export default new OnboardPage();
