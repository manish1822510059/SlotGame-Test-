import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Sector')
export class Sector extends Component {
    @property(Label)
    prizeLabel: Label = null!;

    /**
     * Call this method after instantiating the sector,
     * passing in the prize name or multiplier.
     */
    public setPrizeLabel(text: string) {
        if (this.prizeLabel) {
            this.prizeLabel.string = text;
        }
    }
}
