
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


 
@ccclass('Constants')
export class Constants extends Component {

    public static gamedata =[];
    public static wininimgpos = [];
    public static payouts_5x = [1.5,2.5,1.8,2.5,1.8,2,2.2,2.5,2.4,2.3,2.5,1.9,2.5];
    public static isspining:boolean = false;
    public static freespin:boolean = false;
}

