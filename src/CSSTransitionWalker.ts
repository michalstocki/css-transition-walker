class CSSTransitionWalker {

    private initStyleList:{[property:string]:string} = {};
    private transitions:Transition[] = [];

    constructor(private element:HTMLElement) {
    }

    public captureInitialState():void {
        // todo: get current window from given element
        const initStyle:CSSStyleDeclaration = window.getComputedStyle(this.element);
        let propertyName:string;
        for (propertyName of supportedProperties) {
            this.initStyleList[propertyName] = initStyle[propertyName];
        }
    }

    public captureFinalState():void {
        // todo: emit warning when the final value unit is different than the source value unit (and both are non-zero values)
        const finalStyle = window.getComputedStyle(this.element);
        let propertyName:string;
        for (propertyName of supportedProperties) {
            if (this.initStyleList[propertyName] !== finalStyle[propertyName]) {
                this.transitions.push({
                    property: propertyName,
                    initValue: this.getValue(this.initStyleList[propertyName]),
                    finalValue: this.getValue(finalStyle[propertyName]),
                    unit: this.getUnit(finalStyle[propertyName])
                });
            }
        }
        this.initStyleList = null;
    }

    /**
     * Move transition of the element to a specific state.
     * @param progress number between `0` (initial state) and `1` (final state).
     */
    public goTo(progress:number):void {
        // todo: inspect issue braking `goTo` when `transition` CSS property is applied to the element
        let trans:Transition;
        for (trans of this.transitions) {
            this.element.style[trans.property] = this.calcValue(trans, progress) + trans.unit;
        }
    }

    /**
     * Removes all inline CSS. Allows CSS transition move naturally.
     */
    public release():void {
        let transition:Transition;
        for (transition of this.transitions) {
            this.element.style.removeProperty(transition.property);
        }
    }

    private calcValue(transition:Transition, progress:number):number {
        return transition.initValue + (transition.finalValue - transition.initValue) * progress;
    }

    private getValue(propertyValue:string):number {
        // todo: support more complex property values: background-color, transform, etc.
        return parseFloat(propertyValue);
    }

    private getUnit(propertyValue:string):string {
        // todo: support more complex CSS units: background-color, transform, etc.
        return /\d*(.*)/.exec(propertyValue)[1];
    }
}

interface Transition {
    property:string;
    initValue:number;
    finalValue:number;
    unit:string;
}

var supportedProperties = [
    "borderRadius",
    "width",
    "height"
];