import { useState, useEffect, useMemo, useCallback } from 'react';
export function useHeadlessComponent(HeadlessComponentClass) {
    const component = useMemo(() => new HeadlessComponentClass(), [HeadlessComponentClass]);
    const [componentState, setComponentState] = useState(component.getState());
    const [cssState, setCssState] = useState(component.getCSSState());
    // Use CommandHistoryState for useState type and initial value
    const [history, setHistory] = useState(component.getHistory());
    useEffect(() => {
        const onStateChanged = (_event, newState) => {
            setComponentState(newState);
        };
        const onCssStateChanged = (_event, newCssState) => {
            setCssState(newCssState);
        };
        // Use CommandHistoryState for the newHistory parameter
        const onHistoryChanged = (_event, newHistory) => {
            setHistory(newHistory);
        };
        const unsubscribeState = component.subscribe('stateChanged', onStateChanged);
        const unsubscribeCss = component.subscribe('cssStateChanged', onCssStateChanged);
        const unsubscribeTransition = component.subscribe('stateTransition', () => {
            setComponentState(component.getState());
            setCssState(component.getCSSState());
        });
        // The 'as any' here is to satisfy the general EventCallback type.
        // The actual data passed for 'historyChanged' will be CommandHistoryState.
        const unsubscribeHistory = component.subscribe('historyChanged', onHistoryChanged);
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
    const undo = useCallback(() => {
        component.undo();
    }, [component]);
    const redo = useCallback(() => {
        component.redo();
    }, [component]);
    return { component, componentState, cssState, history, undo, redo };
}
//# sourceMappingURL=use-headless-component.js.map