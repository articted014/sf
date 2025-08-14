import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class OnboardPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get btnNeedNewWallet() {
        return $('[data-testid="btn-need-new-wallet"]');
    }

    /**
     * a method to click on the "Need New Wallet" button
     */
    public async clickNeedNewWalletButton() {
        await this.btnNeedNewWallet.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open() {
        return super.open('onboard');
    }
}

export default new OnboardPage();
