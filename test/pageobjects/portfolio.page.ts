import { $ } from '@wdio/globals'
import Page from './page.js';
import log from '../utils/logger';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class PortfolioPage extends Page {
    /**
     * getters for selectors
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
        return $$('[data-testid="list-item-m-title"]');
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

    // Checks if the toggle is disabled
    public async isToggleDisabled(numberOfItem: number): Promise<boolean> {
        log.info(`Checking if toggle #${numberOfItem} is disabled`);
        const toggle = await this.getToggle(numberOfItem);
        return await toggle.getAttribute('disabled') !== null;
    }

    // Checks if the toggle is ON
    public async isToggleOn(numberOfItem: number): Promise<boolean> {
        log.info(`Checking if toggle #${numberOfItem} is ON`);
        const toggle = await this.getToggle(numberOfItem);
        return await toggle.getAttribute('aria-checked') === 'true';
    }

    // Toggles the state of a toggle located at the specified index
    public async toggleItem(numberOfItem: number) {
        log.info(`Toggling item #${numberOfItem}`);
        const toggle = await this.getToggle(numberOfItem);
        await toggle.click();
    }

    // Gets the wallet items
    public async getWalletItems(): Promise<ChainablePromiseArray> {
        log.info('Waiting for wallet items to be loaded and displayed');
        await browser.waitUntil(async () => {
            const items = await this.walletItems;
            const arr = await Promise.all(items);
            return arr.length > 0 && (await arr[0].isDisplayed());
        }, {
            timeout: 5000,
            timeoutMsg: 'No wallet items found or not displayed after 5s'
        });
        return this.walletItems;
    }

    // Gets the wallet names
    public async getWalletNames(): Promise<string[]> {
        log.info('Getting wallet names');
        const walletNameElements = await $$('[data-testid="list-item-m-title"]');
        const walletNames: string[] = [];

        for (const el of walletNameElements) {
            const textValue = await el.getText();
            // This condition is because the Add wallet button has the same data-testid
            // Could check its parents, but for this case, this is easier workaround
            if (textValue !== "Add wallet") {
                walletNames.push(textValue);
            }
        }
        log.info('Wallet names:', walletNames);
        return walletNames;
    }
}

export default new PortfolioPage();
