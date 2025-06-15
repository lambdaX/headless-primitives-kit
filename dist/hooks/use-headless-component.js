"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHeadlessComponent = useHeadlessComponent;
const react_1 = require("react");
function useHeadlessComponent(HeadlessComponentClass) {
    const component = (0, react_1.useMemo)(() => new HeadlessComponentClass(), [HeadlessComponentClass]);
    const [componentState, setComponentState] = (0, react_1.useState)(component.getState());
    const [cssState, setCssState] = (0, react_1.useState)(component.getCSSState());
    const [history, setHistory] = (0, react_1.useState)(component.getHistory());
    (0, react_1.useEffect)(() => {
        const onStateChanged = (_event, newState) => {
            setComponentState(newState);
        };
        const onCssStateChanged = (_event, newCssState) => {
            setCssState(newCssState);
        };
        const onHistoryChanged = (_event, newHistory) => {
            setHistory(newHistory);
        };
        const unsubscribeState = component.subscribe('stateChanged', onStateChanged);
        const unsubscribeCss = component.subscribe('cssStateChanged', onCssStateChanged);
        const unsubscribeTransition = component.subscribe('stateTransition', () => {
            setComponentState(component.getState());
            setCssState(component.getCSSState());
        });
        const unsubscribeHistory = component.subscribe('historyChanged', onHistoryChanged);
        // Initial sync
        setComponentState(component.getState());
        setCssState(component.getCSSState());
        setHistory(component.getHistory());
        return () => {
            unsubscribeState();
            unsubscribeCss();
            unsubscribeTransition();
            unsubscribeHistory();
        };
    }, [component]);
    const undo = (0, react_1.useCallback)(() => {
        component.undo();
    }, [component]);
    const redo = (0, react_1.useCallback)(() => {
        component.redo();
    }, [component]);
    return { component, componentState, cssState, history, undo, redo };
}
//# sourceMappingURL=use-headless-component.js.map