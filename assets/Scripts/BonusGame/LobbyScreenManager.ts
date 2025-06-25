import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LobbyScreenManager')
export class LobbyScreenManager extends Component {
    @property(Node)
    fireGame: Node = null;

    @property(Node)
    waterGame: Node = null;

    @property(Node)
    lobbyNode: Node = null;

    // Called when Air Game button is clicked
    onWaterGameClicked() {
        this.fireGame.active = false;
        this.waterGame.active = true;
        this.lobbyNode.active = false;
    }

    // Called when Fire Game button is clicked
    onFireGameClicked() {
        this.waterGame.active = false;
        this.fireGame.active = true;
        this.lobbyNode.active = false;
    }

    // Called when Home button is clicked
    onHomeClicked() {
        this.fireGame.active = false;
        this.waterGame.active = false;
        this.lobbyNode.active = true;
    }
}
