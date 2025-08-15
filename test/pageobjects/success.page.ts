import { $ } from '@wdio/globals'
import Page from './page.js';
import log from '../utils/logger';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SuccessPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get btnAgree() {
        return $('[data-testid="btn-explore"]');
    }

    public async clickAgreeButton() {
        log.info('Clicking Agree button');
        await this.waitAndClick(this.btnAgree);
    }
}

export default new SuccessPage();
