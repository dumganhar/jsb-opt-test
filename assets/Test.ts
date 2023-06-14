import { Layers } from 'cc';
import { _decorator, Component, Label, Node, Vec3 } from 'cc';
import { NATIVE } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property({ type: Node })
    public cube: Node;

    @property({ type: Label })
    public resultLabel: Label;

    @property({ type: Label })
    public timesLabel: Label;

    @property
    public executeTimes = 1000;

    private defaultExecuteTimes = 0;

    @property
    public timesStep = 50000;

    start() {
        this.defaultExecuteTimes = this.executeTimes;
        this.updateTimesLabel();
    }

    private updateTimesLabel() {
        this.timesLabel.string = 'Times: ' + this.executeTimes;
    }

    private updateResultLabel(prefix: string, value: number) {
        console.log(`${prefix} costs ${value.toFixed(5)} ms`);
        this.resultLabel.string = `${prefix} costs: ${value.toFixed(5)}ms`;
    }

    onTestNewSetPositionBtnClicked() {
        const oldPosition = new Vec3();
        Vec3.copy(oldPosition, this.cube.position);
        // Test begins
        const oldTime = performance.now();
        for (let i = 0, len = this.executeTimes; i < len; ++i) {
            this.cube.setPosition(oldPosition.x + i, oldPosition.y + i , oldPosition.z + i);
        }
        const nowTime = performance.now();
        this.updateResultLabel('New setPosition', nowTime - oldTime);
        // Test ends

        // reset position
        this.cube.setPosition(oldPosition);
    }

    onTestOldSetPositionBtnClicked() {
        if (!NATIVE) {
            return;
        }
        const oldPosition = new Vec3();
        Vec3.copy(oldPosition, this.cube.position);
        // Test begins
        const oldTime = performance.now();
        for (let i = 0, len = this.executeTimes; i < len; ++i) {
            (this.cube as any)._oldSetPosition(oldPosition.x + i, oldPosition.y + i , oldPosition.z + i);
        }
        const nowTime = performance.now();
        this.updateResultLabel('Old setPosition', nowTime - oldTime);
        // Test ends

        // reset position
        this.cube.setPosition(oldPosition);
    }

    onTestNewGetPositionBtnClicked() {
        const oldPosition = new Vec3();
        Vec3.copy(oldPosition, this.cube.position);
        // Test begins
        const oldTime = performance.now();
        let tempPos: Vec3;
        let count = 0;
        for (let i = 0, len = this.executeTimes; i < len; ++i) {
            tempPos = this.cube.getPosition();
            count += tempPos.x + tempPos.y + tempPos.z;
        }
        const nowTime = performance.now();
        this.updateResultLabel('New getPosition', nowTime - oldTime);
        console.log(`count: ${count}`);
        // Test ends

        // reset position
        this.cube.setPosition(oldPosition);
    }

    onTestOldGetPositionBtnClicked() {
        if (!NATIVE) {
            return;
        }
        const oldPosition = new Vec3();
        Vec3.copy(oldPosition, this.cube.position);
        // Test begins
        const oldTime = performance.now();
        let tempPos: Vec3;
        let count = 0;
        for (let i = 0, len = this.executeTimes; i < len; ++i) {
            tempPos = (this.cube as any)._oldGetPosition();
            count += tempPos.x + tempPos.y + tempPos.z;
        }
        const nowTime = performance.now();
        this.updateResultLabel('Old getPosition', nowTime - oldTime);
        console.log(`count: ${count}`);
        // Test ends

        // reset position
        this.cube.setPosition(oldPosition);
    }

    onIncreaseBtnClicked() {
        this.executeTimes += this.timesStep;
        this.updateTimesLabel();
    }

    onDecreaseBtnClicked() {
        this.executeTimes -= this.timesStep;
        if (this.executeTimes < 0) {
            this.executeTimes = this.defaultExecuteTimes;
        }

        this.updateTimesLabel();
    }

    onNewSetLayerBtnClicked() {
        const oldTime = performance.now();
        for (let i = 0, len = this.executeTimes; i < len; ++i) {
            (this.cube as any)._layer = Layers.Enum.ALL;
        }

        const nowTime = performance.now();
        this.updateResultLabel('New node.layer', nowTime - oldTime);
    }

    onOldSetLayerBtnClicked() {
        if (!NATIVE) {
            return;
        }

        const oldTime = performance.now();
        for (let i = 0, len = this.executeTimes; i < len; ++i) {
            (this.cube as any).setLayer(Layers.Enum.ALL);
        }

        const nowTime = performance.now();
        this.updateResultLabel('Old node.layer', nowTime - oldTime);
    }

    onNewGetChildrenBtnClicked() {
        const oldTime = performance.now();
        let children: Array<Node>;
        let total = 0;
        for (let i = 0, len = this.executeTimes; i < len; ++i) {
            children = this.cube.children;
            total += children.length;
        }

        const nowTime = performance.now();
        this.updateResultLabel('New node.children', nowTime - oldTime);
        console.log(`children count: ${children.length}, total: ${total}`);
    }

    onOldGetChildrenBtnClicked() {
        if (!NATIVE) {
            return;
        }

        const oldTime = performance.now();
        let children: Array<Node>;
        let total = 0;
        for (let i = 0, len = this.executeTimes; i < len; ++i) {
            children = (this.cube as any).getChildren();
            total += children.length;
        }

        const nowTime = performance.now();
        this.updateResultLabel('Old node.children', nowTime - oldTime);
        console.log(`children count: ${children.length}, total: ${total}`);
    }

    onNewSetPositionReuseArgs() {
        this.onTestOldSetPositionBtnClicked();
    }

    onOldSetPositionNotReuseArgs() {
        if (!NATIVE) {
            return;
        }
        const oldPosition = new Vec3();
        Vec3.copy(oldPosition, this.cube.position);
        // Test begins
        const oldTime = performance.now();
        for (let i = 0, len = this.executeTimes; i < len; ++i) {
            (this.cube as any)._setPositionTempArgVector(oldPosition.x + i, oldPosition.y + i , oldPosition.z + i);
        }
        const nowTime = performance.now();
        this.updateResultLabel('Old setPosition not reuse args', nowTime - oldTime);
        // Test ends

        // reset position
        this.cube.setPosition(oldPosition);
    }
}

