
import { _decorator, Component, Node, EventTarget  } from 'cc';
const { ccclass, property } = _decorator;


 
@ccclass('EventManager')
export class EventManager extends Component {
    // [1]
    static instance: EventManager;
    eventTarget: EventTarget = new EventTarget();

    onLoad() {
        EventManager.instance = this;
    }

    emitActionCompleteEvent() {
        this.eventTarget.emit('spin_complete');
    }

    bonusCompleteEvent() {
        this.eventTarget.emit('bonus_complete');
    }
}


