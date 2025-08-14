import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CreatePage extends Page {
    /**
     * define selectors using getter methods
     */
    public get sectionRecoveryPhrase() {
        return $('[data-testid="section-mnemonic-field"]');
    }

    public get btnSavedMyRecoveryPhrase() {
        return $('[data-testid="btn-saved-my-recovery-phrase"]');
    }

    /**
     * Gets the values of the children divs (recovery phrase words) inside sectionRecoveryPhrase
     */
    public async getRecoveryPhraseWords(): Promise<string[]> {
        const container = this.sectionRecoveryPhrase; // no await here
        const childDivs = await container.$$('div._1tvh0vb3');
        const words: string[] = [];
        for (const div of childDivs) {
            const input = await div.$('input[data-testid^="input-recovery-phrase-"]');
            if (input) {
                const value = await input.getValue();
                words.push(value);
            }
        }
        return words;
    }

    /**
     * Fills all recovery phrase inputs with the provided words
     */
    public async fillAllRecoveryPhraseInputs(words: string[]) {
        const sections = await $$('[data-testid="section-mnemonic-field"]');
        for (const section of sections) {
            const inputs = await section.$$(`input[data-testid^="input-recovery-phrase-"]`);
            const inputsLength = await inputs.length;
            for (let i = 0; i < inputsLength && i < words.length; i++) {
                await inputs[i].setValue(words[i]);
            }
        }
    }


    public async clickSavedMyRecoveryPhraseButton() {
        await this.btnSavedMyRecoveryPhrase.click();
    }
}

export default new CreatePage();
