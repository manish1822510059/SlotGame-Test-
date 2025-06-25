import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, tween, Vec3, Color } from 'cc';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;


interface WheelSegment {
    index: number;
    name: string;
    weight: number;
    multiplier: number;
}

@ccclass('BonusWheel')
export class BonusWheel extends Component {
    @property(Node)
    wheelNode: Node = null!;

    @property(Node)
    celebrationParticle: Node = null!;

    @property(Label)
    resultLabel: Label = null!;

    @property([Prefab])
    segmentPrefabs: Prefab[] = [];

    @property
    spinDuration: number = 3.0;

    @property
    fullRotations: number = 5;

    private segments: WheelSegment[] = [];
    private isSpinning: boolean = false;

    private readonly segmentData = [
        { name: "JACKPOT", weight: 5, multiplier: 50 },
        { name: "MAJOR", weight: 15, multiplier: 30 },
        { name: "MINOR", weight: 30, multiplier: 20 },
        { name: "MINI", weight: 50, multiplier: 10 },
        { name: "HIT", weight: 60, multiplier: 80 },
    ];

    start() {
        this.initializeWheel();
        this.celebrationParticle.active = false;
    }

    initializeWheel() {
        this.wheelNode.removeAllChildren();
        this.segments = [];

        const segmentCount = this.segmentData.length;
        const sectorWidth = 110;
        const gap = 0;
        const anglePerSector = 360 / segmentCount;
        const radPerSector = Math.PI * 2 / segmentCount;
        const radius = (sectorWidth / 2) / Math.sin(Math.PI / segmentCount) + gap;

        for (let i = 0; i < segmentCount; i++) {
            const segmentNode = instantiate(this.segmentPrefabs[i % this.segmentPrefabs.length]);
            segmentNode.parent = this.wheelNode;

            const sectorScript = segmentNode.getComponent('Sector');
            if (sectorScript) {
                sectorScript.setPrizeLabel(`${this.segmentData[i].name}\n${this.segmentData[i].multiplier}x`);
            }

            const angleDeg = anglePerSector * i;
            const angleRad = radPerSector * i;

            segmentNode.setPosition(
                Math.sin(angleRad) * radius,
                Math.cos(angleRad) * radius * -1,
                0
            );

            segmentNode.angle = angleDeg;

            this.segments.push({
                index: i,
                name: this.segmentData[i].name,
                weight: this.segmentData[i].weight,
                multiplier: this.segmentData[i].multiplier
            });
        }
    }

    startSpin() {
        this.reset(); 
        if (this.isSpinning) return;

        this.isSpinning = true;
        const targetSegment = this.getRandomSegment();
        const segmentAngle = 360 / this.segments.length;
        const targetAngle = 360 * this.fullRotations + segmentAngle * targetSegment.index;

        tween(this.wheelNode)
            .to(this.spinDuration, { angle: targetAngle }, {
                easing: 'sineOut',
                onUpdate: () => this.updateSegmentHighlight()
            })
            .call(() => {
                this.awardPrize(targetSegment);
                this.highlightWinningSegment(targetSegment.index);
                this.isSpinning = false;
            })
            .start();
    }

    private getRandomSegment(): WheelSegment {
        const totalWeight = this.segments.reduce((sum, s) => sum + s.weight, 0);
        let random = Math.random() * totalWeight;

        for (const segment of this.segments) {
            random -= segment.weight;
            if (random <= 0) return segment;
        }
        return this.segments[0];
    }

    private awardPrize(segment: WheelSegment) {
        const prizeValue = segment.multiplier;
        this.resultLabel.string = `${segment.name} WIN: ${prizeValue}x!`;
        console.log("--> ", this.resultLabel.string);

        // Animate the result label from the center of the wheel
        const labelNode = this.resultLabel?.node;
        if (labelNode) {
            this.resultLabel.node.setPosition(new Vec3(0, 0, 0));
            this.resultLabel.node.setScale(new Vec3(0, 0, 0));
            this.resultLabel.color = Color.YELLOW;

            tween(this.resultLabel.node)
                .to(0.2, { scale: new Vec3(1.5, 1.5, 1.5) })
                .to(0.2, { scale: new Vec3(1, 1, 1) })
                .to(0.5, { position: new Vec3(400, -18, 1) })
                .to(0.2, { scale: new Vec3(2, 2, 2)})
                .start();
        }
    }

    private updateSegmentHighlight() {
        // Add visual feedback during spin if needed
    }

    private highlightWinningSegment(index: number) {
        // Reset all segments to white and all labels to normal scale
        this.segments.forEach((_, i) => {
            const segmentNode = this.wheelNode.children[i];
            const sprite = segmentNode.getComponent(Sprite);
            if (sprite) sprite.color = Color.WHITE;

            // Reset label scale if exists
            const label = segmentNode.getComponentInChildren(Label);
            if (label) {
                label.node.setScale(new Vec3(1, 1, 1));
            }
        });

        // Set winning segment to yellow
        const winningSegmentNode = this.wheelNode.children[index];
        const winningSprite = winningSegmentNode.getComponent(Sprite);
        if (winningSprite) winningSprite.color = Color.YELLOW;

        // Tween the winning label for pop effect
        const winningLabel = winningSegmentNode.getComponentInChildren(Label);
        if (winningLabel) {
            winningLabel.node.setScale(new Vec3(1, 1, 1)); // Ensure starting scale
            tween(winningLabel.node)
                .to(0.5, { scale: new Vec3(1.5, 1.5, 1.5) })
                .start();
        }

        this.celebrationParticle.active = true;
        setTimeout(() => {
            EventManager.instance.bonusCompleteEvent()
        }, 5000);
    }

    // --- RESET METHOD ---
    reset() {
        // Reset wheel rotation
        this.wheelNode.angle = 0;

        // Reset all segment colors and label scales
        this.segments.forEach((_, i) => {
            const segmentNode = this.wheelNode.children[i];
            const sprite = segmentNode.getComponent(Sprite);
            if (sprite) sprite.color = Color.WHITE;
            const label = segmentNode.getComponentInChildren(Label);
            if (label) {
                label.node.setScale(new Vec3(1, 1, 1));
            }
        });

        // Reset result label
        const labelNode = this.resultLabel?.node;
        if (labelNode) {
            this.resultLabel.string = "";
            labelNode.setScale(new Vec3(1, 1, 1));
            labelNode.setPosition(new Vec3(0, 0, 0));
            this.resultLabel.color = Color.WHITE;
        }
        

        // Hide celebration particle
        if (this.celebrationParticle) {
            this.celebrationParticle.active = false;
        }

        // Allow spinning again
        this.isSpinning = false;
    }

}
