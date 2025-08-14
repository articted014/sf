import { expect } from '@wdio/globals'
import OnboardPage from '../pageobjects/onboard.page.js'
import CreatePage from '../pageobjects/create.page.js'

describe('Onboard flow', () => {
    it('should verify that the recovery phrase list contains the original wallet and the newly added wallets',
        async () => {
            await OnboardPage.open();
            await expect(OnboardPage.btnNeedNewWallet).toBeExisting();

            await OnboardPage.clickNeedNewWalletButton();
            await expect(CreatePage.sectionRecoveryPhrase).toBeExisting();

            const words = await CreatePage.getRecoveryPhraseWords();

            console.log('Recovery phrase words:', words);

            await expect(CreatePage.btnSavedMyRecoveryPhrase).toBeExisting()
            await CreatePage.clickSavedMyRecoveryPhraseButton();
            await CreatePage.fillAllRecoveryPhraseInputs(words);
            //wait for 5 seconds
            await browser.pause(5000);
        })
})

