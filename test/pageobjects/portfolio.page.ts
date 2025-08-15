import { $ } from '@wdio/globals'
import Page from './page.js';
import log from '../utils/logger';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class PortfolioPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get sectionWalletPicker() {
        return $('[data-testid="icon-section-wallet-picker-arrow-right"]');
    }

    public get itemMainWallet() {
        return $('[data-testid^="li-wallets-"]');
    }

    public get itemManageRecoveryPhrase() {
        return $('[data-testid="li-add-wallet-mnemonic-manage"]');
    }

    public get btnAddWallet() {
        return $('[data-testid="icon-btn-add"]');
    }

    public get btnSave() {
        return $('[data-testid="btn-save"]');
    }

    public get walletItems() {
        return $$('button[data-testid^="li-wallets-"]');
    }

    public async clickWalletPicker() {
        log.info('Clicking wallet picker');
        await this.waitAndClick(this.sectionWalletPicker);
    }

    public async clickAddWalletButton() {
        log.info('Clicking add wallet button');
        await this.waitAndClick(this.btnAddWallet);
    }

    public async clickItemManageRecoveryPhrase() {
        log.info('Clicking manage recovery phrase item');
        await this.waitAndClick(this.itemManageRecoveryPhrase);
    }

    public async clickSaveButton() {
        log.info('Clicking save button');
        await this.waitAndClick(this.btnSave);
    }

    private async getToggle(numberOfItem: number) {
        const recoveryPhraseItem = await $(`[data-index="${numberOfItem - 1}"]`);
        await recoveryPhraseItem.waitForDisplayed();
        return recoveryPhraseItem.$('button');
    }

    public async isToggleDisabled(numberOfItem: number): Promise<boolean> {
        log.info(`Checking if toggle #${numberOfItem} is disabled`);
        const toggle = await this.getToggle(numberOfItem);
        return await toggle.getAttribute('disabled') !== null;
    }

    public async isToggleOn(numberOfItem: number): Promise<boolean> {
        log.info(`Checking if toggle #${numberOfItem} is ON`);
        const toggle = await this.getToggle(numberOfItem);
        return await toggle.getAttribute('aria-checked') === 'true';
    }

    public async toggleItem(numberOfItem: number) {
        log.info(`Toggling item #${numberOfItem}`);
        const toggle = await this.getToggle(numberOfItem);
        await toggle.click();
    }

    public async getWalletNames(): Promise<string[]> {
        log.info('Getting wallet names');
        const walletNameElements = await $$('[data-testid="list-item-m-title"]');
        const walletNames: string[] = [];
        for (const el of walletNameElements) {
            const textValue = await el.getText();
            // This condition is because the Add wallet button has the same data-testid
            // Could check its parents, but for this case it is easier workaround
            if (textValue !== "Add wallet") {
                walletNames.push(textValue);
            }
        }

        log.info('Waiting for wallet names to be populated.');
        await browser.waitUntil(
            async () => (await walletNames).length === 3,
            {
                timeout: 5000,
                timeoutMsg: 'Expected 3 wallets to be displayed'
            }
        );

        log.info('Wallet names:', walletNames);
        return walletNames;
    }
}

export default new PortfolioPage();
