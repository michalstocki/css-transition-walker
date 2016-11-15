import {using} from '../utils/using';
import {SupportedLenghtUnits} from '../../src/const/SupportedLenghtUnits';

describe('width property', () => {

    let divElement:HTMLDivElement;
    let style:HTMLStyleElement;

    beforeEach(() => {
        divElement = document.createElement('div');
        document.createElement('style');
        document.body.appendChild(style);
        document.body.appendChild(divElement);
    });

    afterEach(() => {
        document.body.removeChild(divElement);
        document.body.removeChild(style);
    });

    using(SupportedLenghtUnits).describe('transition', (unit:string) => {
        describe(`with a value defined in ${unit}`, () => {
            describe('when the both initial and final values are non-zero', () => {
                it('can be moved forward from the initial position', () => {
                    // given
                    style.innerText = `
div {
    width: 10${unit};
}

div.final {
    width: 110${unit};
}
`;
                    const walker = new CSSTransitionWalker(divElement);
                    walker.captureInitialState();
                    divElement.classList.add('final');
                    walker.captureFinalState();

                    // when
                    walker.goTo(0.75);

                    // then
                    chai.expect(divElement.style.width).to.equal(`85${unit}`);
                });

                it('can be moved back from the final position', () => {
                    // given
                    style.innerText = `
div {
    width: 10${unit};
}

div.final {
    width: 110${unit};
}
`;
                    const walker = new CSSTransitionWalker(divElement);
                    walker.captureInitialState();
                    divElement.classList.add('final');
                    walker.captureFinalState();
                    divElement.classList.remove('final');

                    // when
                    walker.goTo(0.25);

                    // then
                    chai.expect(divElement.style.width).to.equal(`35${unit}`);
                });
            });

            describe('when the initial value is 0', () => {
                describe('and the final value is non-zero', () => {
                    it('can be moved forward from the initial position', () => {
                        // given
                        style.innerText = `
div {
    width: 0;
}

div.final {
    width: 100${unit};
}
`;
                        const walker = new CSSTransitionWalker(divElement);
                        walker.captureInitialState();
                        divElement.classList.add('final');
                        walker.captureFinalState();
                        divElement.classList.remove('final');

                        // when
                        walker.goTo(0.25);

                        // then
                        chai.expect(divElement.style.width).to.equal(`25${unit}`);
                    });

                    it('can be moved back from the final position', () => {
                        // given
                        style.innerText = `
div {
    width: 0;
}

div.final {
    width: 100${unit};
}
`;
                        const walker = new CSSTransitionWalker(divElement);
                        walker.captureInitialState();
                        divElement.classList.add('final');
                        walker.captureFinalState();

                        // when
                        walker.goTo(0.75);

                        // then
                        chai.expect(divElement.style.width).to.equal(`75${unit}`);
                    });
                });
            });

            describe('when the initial value is non-zero', () => {
                describe('and the final value is 0', () => {
                    it('can be moved forward from the initial position', () => {
                        // given
                        style.innerText = `
div {
    width: 100${unit};
}

div.final {
    width: 0;
}
`;
                        const walker = new CSSTransitionWalker(divElement);
                        walker.captureInitialState();
                        divElement.classList.add('final');
                        walker.captureFinalState();
                        divElement.classList.remove('final');

                        // when
                        walker.goTo(0.25);

                        // then
                        chai.expect(divElement.style.width).to.equal(`75${unit}`);
                    });

                    it('can be moved back from the final position', () => {
                        // given
                        style.innerText = `
div {
    width: 100${unit};
}

div.final {
    width: 0;
}
`;
                        const walker = new CSSTransitionWalker(divElement);
                        walker.captureInitialState();
                        divElement.classList.add('final');
                        walker.captureFinalState();

                        // when
                        walker.goTo(0.75);

                        // then
                        chai.expect(divElement.style.width).to.equal(`25${unit}`);
                    });
                });
            });

        });
    });
});
