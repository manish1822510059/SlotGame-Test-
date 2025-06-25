import { _decorator, Component, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BetManager')
export class BetManager extends Component {
    @property(Label)
    betLabel: Label = null;

    @property(Button)
    plusButton: Button = null;

    @property(Button)
    minusButton: Button = null;

    @property(Button)
    maxButton: Button = null;

    private currentBet: number = 10;
    private minBet: number = 10;
    private maxBet: number = 100;
    private betStep: number = 10;

    start() {
        this.updateBetDisplay();

        this.plusButton.node.on(Button.EventType.CLICK, this.onPlusClicked, this);
        this.minusButton.node.on(Button.EventType.CLICK, this.onMinusClicked, this);
        this.maxButton.node.on(Button.EventType.CLICK, this.onMaxClicked, this);
    }

    onPlusClicked() {
        if (this.currentBet + this.betStep <= this.maxBet) {
            this.currentBet += this.betStep;
            this.updateBetDisplay();
        }
    }

    onMinusClicked() {
        if (this.currentBet - this.betStep >= this.minBet) {
            this.currentBet -= this.betStep;
            this.updateBetDisplay();
        }
    }

    onMaxClicked() {
        if (this.currentBet !== this.maxBet) {
            this.currentBet = this.maxBet;
            this.updateBetDisplay();
        }
    }

    updateBetDisplay() {
        this.betLabel.string = this.currentBet.toString();
    }
}
