class CSSTransitionWalker {

    private initStyleList:{[property:string]:string} = {};
    private transitions:Transition[] = [];

    constructor(private element:HTMLElement) {
    }

    public captureInitialState():void {
        // todo: get current window from given element
        const initStyle:CSSStyleDeclaration = window.getComputedStyle(this.element);
        for (const propertyName of supportedProperties) {
            this.initStyleList[propertyName] = initStyle[propertyName];
        }
    }

    public captureFinalState():void {
        // todo: emit warning when the final value unit is different than the source value unit (and both are non-zero values)
        const finalStyle = window.getComputedStyle(this.element);
        this.disableTransition();
        for (const propertyName of supportedProperties) {
            if (this.initStyleList[propertyName] !== finalStyle[propertyName]) {
                this.transitions.push({
                    propertyName: propertyName,
                    initValue: this.getValue(this.initStyleList[propertyName]),
                    finalValue: this.getValue(finalStyle[propertyName]),
                    unit: this.getUnit(finalStyle[propertyName])
                });
            }
        }
        // todo: fix issue with a transition running after capturing a final state (transition runs before the end state class will be removed by user)
        this.enableTransition();
        this.initStyleList = {};
    }

    /**
     * Move transition of the element to a specific state.
     * @param progress number between `0` (initial state) and `1` (final state).
     */
    public goTo(progress:number):void {
        this.disableTransition();
        for (const transition of this.transitions) {
            const currentValue = this.calcValue(transition, progress);
            let currentCSSValue:string;
            if (Array.isArray(currentValue)) {
                currentCSSValue = `matrix3d(${currentValue.join(', ')})`;
            } else {
                currentCSSValue = currentValue + transition.unit;
            }
            this.element.style[transition.propertyName] = currentCSSValue;
        }
    }

    /**
     * Removes all inline CSS. Allows CSS transition move naturally.
     */
    public release():void {
        for (const transition of this.transitions) {
            this.element.style.removeProperty(transition.propertyName);
        }
        this.enableTransition();
    }

    private disableTransition():void {
        this.element.style.transition = 'none';
    }

    private enableTransition():void {
        this.element.style.removeProperty('transition');
    }

    private calcValue(transition:Transition, progress:number):number|Array<number> {
        let result;
        if (Array.isArray(transition.initValue) && Array.isArray(transition.finalValue)) {
            result = transition.initValue.map((n, i) => this.calcValueNumber(n, transition.finalValue[i], progress));
        } else if (!Array.isArray(transition.initValue) && !Array.isArray(transition.finalValue)) {
            result = this.calcValueNumber(transition.initValue, transition.finalValue, progress);
        }
        return result
    }

    private calcValueNumber(initValue:number, finalValue:number, progress:number):number {
        return initValue + (finalValue - initValue) * progress;
    }

    private getValue(propertyValue:string):number|Array<number> {
        // todo: support more complex propertyName values: background-color, transform, etc.
        let value;
        if (/matrix/.test(propertyValue)) {
            const matrixCopy = propertyValue.replace(/^\w*\(/, '').replace(')', '');
            value = matrixCopy.split(/\s*,\s*/).map(n => parseFloat(n));
        } else {
            value = parseFloat(propertyValue);
        }
        return value;
    }

    private getUnit(propertyValue:string):string {
        // todo: support more complex CSS units: background-color, transform, etc.
        return /\d*(.*)/.exec(propertyValue)[1];
    }
}

interface Transition {
    propertyName:string;
    initValue:number|Array<number>;
    finalValue:number|Array<number>;
    unit:string;
}

const supportedProperties = [
    "border-radius",
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    "transform"
];