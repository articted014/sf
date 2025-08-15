import { expect } from '@wdio/globals'
import OnboardPage from '../pageobjects/onboard.page.js'
import CreatePage from '../pageobjects/create.page.js'
import SuccessPage from '../pageobjects/success.page.js'
import PortfolioPage from '../pageobjects/portfolio.page.js'

describe('Login and add wallet', () => {
    it('should verify that the recovery phrase list contains the original wallet and the newly added wallets',
        async () => {
            const password = 'testpassword';
            const expectedWalletNames = ['Main Wallet', 'Wallet 2', 'Wallet 3'];

            await OnboardPage.open();
            await expect(OnboardPage.btnNeedNewWallet).toBeExisting();

            await OnboardPage.clickNeedNewWalletButton();
            await expect(CreatePage.sectionRecoveryPhrase).toBeExisting();

            const words = await CreatePage.getRecoveryPhraseWords();

            await expect(CreatePage.btnSavedMyRecoveryPhrase).toBeExisting()
            await CreatePage.clickSavedMyRecoveryPhraseButton();
            await CreatePage.fillAllRecoveryPhraseInputs(words);
            await CreatePage.clickContinueButton();
            await CreatePage.fillAndRepeatNewPassword(password);
            await CreatePage.clickContinueButton();

            await expect(SuccessPage.btnAgree).toBeExisting();
            await SuccessPage.clickAgreeButton();
            await expect(PortfolioPage.sectionWalletPicker).toBeExisting();
            await PortfolioPage.clickWalletPicker();
            await expect(PortfolioPage.itemMainWallet).toBeExisting();
            await expect(PortfolioPage.btnAddWallet).toBeExisting();
            await PortfolioPage.clickAddWalletButton();
            await expect(PortfolioPage.itemManageRecoveryPhrase).toBeExisting();
            await PortfolioPage.clickItemManageRecoveryPhrase();
            await expect(PortfolioPage.isToggleDisabled(1)).resolves.toBe(true);
            await expect(PortfolioPage.isToggleOn(1)).resolves.toBe(true);

            await PortfolioPage.toggleItem(3);
            await expect(PortfolioPage.isToggleOn(3)).resolves.toBe(true);

            await PortfolioPage.toggleItem(4);
            await expect(PortfolioPage.isToggleOn(4)).resolves.toBe(true);

            await PortfolioPage.clickSaveButton();

            const walletElements = await PortfolioPage.getWalletItems();
            const walletNames = await PortfolioPage.getWalletNames();

            // Assert the number of wallets
            expect(walletElements).toBeElementsArrayOfSize(3);
            expect(walletNames).toBeExisting();

            // Assert the names (replace with your expected names)
            expect(walletNames).toEqual(expectedWalletNames);
        })
})

