var CSSTransitionWalker = (function () {
    function CSSTransitionWalker(element) {
        this.element = element;
        this.initStyleList = {};
        this.transitions = [];
    }
    CSSTransitionWalker.prototype.captureInitialState = function () {
        // todo: get current window from given element
        var initStyle = window.getComputedStyle(this.element);
        var propertyName;
        for (var _i = 0, supportedProperties_1 = supportedProperties; _i < supportedProperties_1.length; _i++) {
            propertyName = supportedProperties_1[_i];
            this.initStyleList[propertyName] = initStyle[propertyName];
        }
    };
    CSSTransitionWalker.prototype.captureFinalState = function () {
        // todo: emit warning when the final value unit is different than the source value unit (and both are non-zero values)
        var finalStyle = window.getComputedStyle(this.element);
        this.disableTransition();
        var propertyName;
        for (var _i = 0, supportedProperties_2 = supportedProperties; _i < supportedProperties_2.length; _i++) {
            propertyName = supportedProperties_2[_i];
            if (this.initStyleList[propertyName] !== finalStyle[propertyName]) {
                this.transitions.push({
                    property: propertyName,
                    initValue: this.getValue(this.initStyleList[propertyName]),
                    finalValue: this.getValue(finalStyle[propertyName]),
                    unit: this.getUnit(finalStyle[propertyName])
                });
            }
        }
        // todo: fix issue with a transition running after capturing a final state (transition runs before the end state class will be removed by user)
        this.enableTransition();
        this.initStyleList = null;
    };
    /**
     * Move transition of the element to a specific state.
     * @param progress number between `0` (initial state) and `1` (final state).
     */
    CSSTransitionWalker.prototype.goTo = function (progress) {
        this.disableTransition();
        var trans;
        for (var _i = 0, _a = this.transitions; _i < _a.length; _i++) {
            trans = _a[_i];
            this.element.style[trans.property] = this.calcValue(trans, progress) + trans.unit;
        }
    };
    /**
     * Removes all inline CSS. Allows CSS transition move naturally.
     */
    CSSTransitionWalker.prototype.release = function () {
        var transition;
        for (var _i = 0, _a = this.transitions; _i < _a.length; _i++) {
            transition = _a[_i];
            this.element.style.removeProperty(transition.property);
        }
        this.enableTransition();
    };
    CSSTransitionWalker.prototype.disableTransition = function () {
        this.element.style.transition = 'none';
    };
    CSSTransitionWalker.prototype.enableTransition = function () {
        this.element.style.removeProperty('transition');
    };
    CSSTransitionWalker.prototype.calcValue = function (transition, progress) {
        return transition.initValue + (transition.finalValue - transition.initValue) * progress;
    };
    CSSTransitionWalker.prototype.getValue = function (propertyValue) {
        // todo: support more complex property values: background-color, transform, etc.
        return parseFloat(propertyValue);
    };
    CSSTransitionWalker.prototype.getUnit = function (propertyValue) {
        // todo: support more complex CSS units: background-color, transform, etc.
        return /\d*(.*)/.exec(propertyValue)[1];
    };
    return CSSTransitionWalker;
}());
var supportedProperties = [
    "border-radius",
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom"
];
//# sourceMappingURL=CSSTransitionWalker.js.map