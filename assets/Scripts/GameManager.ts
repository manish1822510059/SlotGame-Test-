import { _decorator, Animation, Button, Color, Component, game, instantiate, JsonAsset, Label, log, math, Node, Prefab, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { RollManager } from './RollManager';
import { Constants } from './Constants';
import { ScoreManager } from './ScoreManager';
import { EventManager } from './EventManager';
import { BonusGameManager } from './BonusGame/BonusGameManager';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(RollManager)
    columns: RollManager[] = [];

    @property(Prefab)
    Items: Prefab[] = [];

    @property(SpriteFrame)
    ItemsSprites: SpriteFrame[] = [];

    @property(JsonAsset)
    json: JsonAsset;

    @property(Node)
    ScoreMenu: Node = null;

    @property(Node)
    Btns: Node[] = [];

    @property(Node)
    freespinnotification: Node = null;

    @property(Label)
    freespincnt: Label = null!;

    @property(Node)
    WiningBg: Node = null;

    @property(Node)
    FreeGameBtn: Node = null;

    @property(Label)
    balanceLabel: Label = null;

    @property(Label)
    currentWinLabel: Label = null;

    @property(Node)
    FreeGameNode: Node = null;

    @property(Node)
    WinBoard: Node = null;

    @property(BonusGameManager)
    BonusGameManager: BonusGameManager = null;

    gamedata = [];
    imagearry = [];
    winingimage = null;
    winingeffect: Node[] = [];
    winingimagename;

    freeSpins: number = 0;
    isFreeGame: boolean = false;
    private isHandlingFreeSpin: boolean = false;

    private playerBalance: number = 100;
    private readonly betAmount: number = 5;
    private readonly winReward: number = 10;

    protected onLoad(): void {
        EventManager.instance.eventTarget.on('spin_complete', this.onspincomplete, this);
        EventManager.instance.eventTarget.on('bonus_complete', this.finishBonusGame, this);
    }

    start() {
        this.parsing();
        this.updateBalanceUI();
    }

    parsing() {
        let Json = this.json.json;
        for (let i = 0; i < 11; i++) {
            let data = Json[i]["WiningCombinations"];
            this.gamedata.push(data);
        }
    }

    updateBalanceUI() {
        if (this.balanceLabel) {
            this.balanceLabel.string = this.playerBalance.toString();
        }
    }

    onspincomplete() {
        setTimeout(() => {
            if (this.winingeffect.length > 0) {
                for (const element of this.winingeffect) {
                    element.children[0].active = true;
                    element.children[1].active = true;
                    element.children[1].getComponent(Animation).play();
                }
            }

            console.log(this.winingimagename);
            this.currentWinLabel.string = this.winReward.toString();
            this.playerBalance += this.winReward;
            this.balanceLabel.string = this.playerBalance.toString();

            if (this.winingimagename == "icon_7") {
                // this.WiningBg.active = true;
                this.startFreeGame(5);

                // Add winning points
                this.playerBalance += this.winReward;
                this.updateBalanceUI();
            }
            if (this.winingimagename == "icon_3") {
                if(this.BonusGameManager != null){
                    this.BonusGameManager.showBonusGame();
                    this.playerBalance += this.winReward;
                    this.updateBalanceUI();
                }
            }

            Constants.isspining = false;

            if (this.isFreeGame && this.freeSpins > 0) {
                this.scheduleOnce(() => {
                    this.OnStartClick();
                }, 0.5);
            } else {
                this.isHandlingFreeSpin = false;
            }
        }, 20);
    }

    AsigningEndImages() {
        this.imagearry = [];
        this.winingeffect = [];
        this.selectingrandomImg();
        let data = this.gamedata[math.randomRangeInt(0, this.gamedata.length)];

        for (let i = 0; i < this.columns.length; i++) {
            let col = this.columns[i].node.children[1];
            for (let j = 0; j < 3; j++) {
                col.children[j].getComponent(Sprite).spriteFrame = this.imagearry[data[j][i]];
                if (data[j][i] == 0) {
                    this.winingimagename = col.children[j].getComponent(Sprite).spriteFrame.name;
                    let node = instantiate(this.winingimage)
                    col.children[j].addChild(node);
                    node.setPosition(-2.5, 3.3, 0);
                    let val = [this.columns[i].node.name, j];
                    Constants.wininimgpos.push(val);
                    this.winingeffect.push(node);
                }
            }
        }
    }

    selectingrandomImg() {
        for (let i = 0; i < 6; i++) {
            let randnum = math.randomRangeInt(0, this.ItemsSprites.length);
            if (!this.winingimage) {
                this.winingimage = this.Items[0];
                ScoreManager.overallScore += Constants.payouts_5x[randnum];
            }
            let ranimg = this.ItemsSprites[randnum];
            if (this.imagearry.indexOf(ranimg) == -1) {
                this.imagearry.push(ranimg);
            } else {
                i--;
            }
        }
    }

    startFreeGame(count: number) {
        this.freeSpins += count;
        this.isFreeGame = true;
        this.updateFreeSpinUI();
        

        if (this.FreeGameBtn) {
            this.FreeGameBtn.getComponent(Button).interactable = false;
        }

        if (!this.isHandlingFreeSpin) {
            this.isHandlingFreeSpin = true;
            this.OnStartClick();
        }
    }

    onclickFreeGame() {
        this.startFreeGame(5);
    }

    updateFreeSpinUI() {
        if (this.freespincnt) {
            this.freespincnt.string = this.freeSpins.toString();
            this.FreeGameNode.active = true;
            this.WinBoard.active = false;
        }
    }

    OnStartClick() {
        if (Constants.isspining) return;
        this.currentWinLabel.string = "0";

        if (this.isFreeGame && this.freeSpins > 0) {
            this.freeSpins--;
            this.updateFreeSpinUI();

            if (this.freeSpins === 0) {
                this.isFreeGame = false;
                this.FreeGameNode.active = false;
                this.WinBoard.active = true;

                if (this.FreeGameBtn) {
                    this.FreeGameBtn.getComponent(Button).interactable = true;
                }
            }
        } else {
            // Deduct balance only in normal spins
            if (this.playerBalance >= this.betAmount) {
               
                this.playerBalance -= this.betAmount;
                this.updateBalanceUI();
            } else {
                console.log("Not enough balance to spin!");
                return;
            }
        }

        let idx = 0;
        Constants.isspining = true;
        this.winingimage = null;

        this.schedule(() => {
            this.columns[idx].enabled = true;
            idx += 1;
            this.winingeffect = [];
        }, 0.1, this.columns.length - 1);

        this.winingeffect = [];
    }

    update(deltaTime: number) {
        // Enable start if ready and has enough balance
        const canSpin = (!Constants.isspining && (!this.isFreeGame || this.freeSpins > 0));
        this.Btns[0].getComponent(Button).enabled = canSpin && (this.playerBalance >= this.betAmount);

        if (RollManager.changeimgbool) {
            if (this.winingeffect.length <= 0) {
                this.AsigningEndImages();
            }
            RollManager.changeimgbool = false;
        }
    }

    finishBonusGame(){
        this.BonusGameManager.hideBonusGame();
    }
}
