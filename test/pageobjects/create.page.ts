import { $ } from '@wdio/globals'
import Page from './page.js';
import log from '../utils/logger';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CreatePage extends Page {
    /**
     * getters for selectors
     */
    public get sectionRecoveryPhrase() {
        return $('[data-testid="section-mnemonic-field"]');
    }

    public get btnSavedMyRecoveryPhrase() {
        return $('[data-testid="btn-saved-my-recovery-phrase"]');
    }


    public get recoveryPhraseInputs() {
        return this.sectionRecoveryPhrase.$$(`input[data-testid^="input-recovery-phrase-"]`);
    }

    public get btnContinue() {
        return $('[data-testid="btn-continue"]');
    }

    public get inputNewPassword() {
        return $('[data-testid="input-new-password"]');
    }

    public get repeatNewPassword() {
        return $('[data-testid="input-repeat-password"]');
    }

    /**
     * Gets the values of the children divs (recovery phrase words) inside sectionRecoveryPhrase
     */
    public async getRecoveryPhraseWords(): Promise<string[]> {
        log.info('Getting recovery phrase words');
        const inputs = await this.recoveryPhraseInputs; const values: string[] = [];
        for (const input of inputs) {
            values.push(await input.getValue());
        }
        log.info('Recovery phrase words:', values);
        return values as string[];
    }

    /**
     * Fills all recovery phrase inputs with the provided words
     */
    public async fillAllRecoveryPhraseInputs(words: string[]) {
        log.info('Filling all recovery phrase inputs:', words);
        const inputs = await this.recoveryPhraseInputs;
        const inputsLength = await inputs.length;
        for (let i = 0; i < inputsLength && i < words.length; i++) {
            await this.fillInput(inputs[i], words[i]);
        }
        log.info('All recovery phrase inputs filled');
    }


    public async clickSavedMyRecoveryPhraseButton() {
        log.info('Clicking Saved My Recovery Phrase button');
        await this.waitAndClick(this.btnSavedMyRecoveryPhrase);
    }

    public async clickContinueButton() {
        log.info('Clicking Continue button');
        await this.waitAndClick(this.btnContinue);
    }

    // Filling and repeating new password
    public async fillAndRepeatNewPassword(password: string) {
        log.info('Filling and repeating new password');
        await this.fillInput(this.inputNewPassword, password);
        await this.fillInput(this.repeatNewPassword, password);
        log.info('New password fields filled');
    }
}

export default new CreatePage();
