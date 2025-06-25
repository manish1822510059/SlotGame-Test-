import { _decorator, Component, Node, Prefab, instantiate, tween, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BonusGameManager')
export class BonusGameManager extends Component {
    @property(Prefab)
    bonusGamePrefab: Prefab = null!;

    @property(Node)
    transitionLayer: Node = null!; // A full-screen node for fade effect

    private bonusGameNode: Node | null = null;

    start() {


    }

    // Show the bonus game with a fade-in transition
    showBonusGame() {
        this.transitionLayer.active = true;
        tween(this.transitionLayer)
            .to(1, {  })
            .call(() => {
                // Instantiate and show bonus game
                if (!this.bonusGameNode) {
                    this.bonusGameNode = instantiate(this.bonusGamePrefab);
                    this.bonusGameNode.parent = this.node;
                }
            })
            .to(1, {})
            .call(() => {
                this.transitionLayer.active = false;
            })
            .start();
    }

    // Hide and destroy the bonus game with a fade-out transition
    hideBonusGame() {
        this.transitionLayer.active = true;
        tween(this.transitionLayer)
            .to(1, {  })
            .call(() => {
                // Destroy bonus game
                if (this.bonusGameNode) {
                    this.bonusGameNode.destroy();
                    this.bonusGameNode = null;
                    this.transitionLayer.active = false;
                }
            })
            .start();
    }
}
