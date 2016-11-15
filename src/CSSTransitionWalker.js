var CSSTransitionWalker = (function () {
    function CSSTransitionWalker(element) {
        this.element = element;
        this.initStyleList = {};
        this.transitions = [];
    }
    CSSTransitionWalker.prototype.captureInitialState = function () {
        // todo: get current window from given element
        var initStyle = window.getComputedStyle(this.element);
        for (var _i = 0, supportedProperties_1 = supportedProperties; _i < supportedProperties_1.length; _i++) {
            var propertyName = supportedProperties_1[_i];
            this.initStyleList[propertyName] = initStyle[propertyName];
        }
    };
    CSSTransitionWalker.prototype.captureFinalState = function () {
        // todo: emit warning when the final value unit is different than the source value unit (and both are non-zero values)
        var finalStyle = window.getComputedStyle(this.element);
        this.disableTransition();
        for (var _i = 0, supportedProperties_2 = supportedProperties; _i < supportedProperties_2.length; _i++) {
            var propertyName = supportedProperties_2[_i];
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
    };
    /**
     * Move transition of the element to a specific state.
     * @param progress number between `0` (initial state) and `1` (final state).
     */
    CSSTransitionWalker.prototype.goTo = function (progress) {
        this.disableTransition();
        for (var _i = 0, _a = this.transitions; _i < _a.length; _i++) {
            var transition = _a[_i];
            var currentValue = this.calcValue(transition, progress);
            var currentCSSValue = void 0;
            if (Array.isArray(currentValue)) {
                currentCSSValue = "matrix3d(" + currentValue.join(', ') + ")";
            }
            else {
                currentCSSValue = currentValue + transition.unit;
            }
            this.element.style[transition.propertyName] = currentCSSValue;
        }
    };
    /**
     * Removes all inline CSS. Allows CSS transition move naturally.
     */
    CSSTransitionWalker.prototype.release = function () {
        for (var _i = 0, _a = this.transitions; _i < _a.length; _i++) {
            var transition = _a[_i];
            this.element.style.removeProperty(transition.propertyName);
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
        var _this = this;
        var result;
        if (Array.isArray(transition.initValue) && Array.isArray(transition.finalValue)) {
            result = transition.initValue.map(function (n, i) { return _this.calcValueNumber(n, transition.finalValue[i], progress); });
        }
        else if (!Array.isArray(transition.initValue) && !Array.isArray(transition.finalValue)) {
            result = this.calcValueNumber(transition.initValue, transition.finalValue, progress);
        }
        return result;
    };
    CSSTransitionWalker.prototype.calcValueNumber = function (initValue, finalValue, progress) {
        return initValue + (finalValue - initValue) * progress;
    };
    CSSTransitionWalker.prototype.getValue = function (propertyValue) {
        // todo: support more complex propertyName values: background-color, transform, etc.
        var value;
        if (/matrix/.test(propertyValue)) {
            var matrixCopy = propertyValue.replace(/^\w*\(/, '').replace(')', '');
            value = matrixCopy.split(/\s*,\s*/).map(function (n) { return parseFloat(n); });
        }
        else {
            value = parseFloat(propertyValue);
        }
        return value;
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
    "bottom",
    "transform"
];
