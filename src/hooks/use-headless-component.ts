import { useState, useEffect, useMemo, useCallback } from 'react';
import type { HeadlessComponent, BaseComponentState, CssState } from '@/components/headless-logic';
import type { CommandHistoryState } from '@/components/headless-logic/command'; // Import the new interface

interface HeadlessHookResult<T extends HeadlessComponent<S>, S extends BaseComponentState> {
  component: T;
  componentState: S;
  cssState: CssState;
  history: CommandHistoryState; // Use CommandHistoryState here
  undo: () => void;
  redo: () => void;
}

export function useHeadlessComponent<T extends HeadlessComponent<S>, S extends BaseComponentState>(
  HeadlessComponentClass: new () => T
): HeadlessHookResult<T, S> {
  const component = useMemo(() => new HeadlessComponentClass(), [HeadlessComponentClass]);

  const [componentState, setComponentState] = useState<S>(component.getState());
  const [cssState, setCssState] = useState<CssState>(component.getCSSState());
  // Use CommandHistoryState for useState type and initial value
  const [history, setHistory] = useState<CommandHistoryState>(component.getHistory());

  useEffect(() => {
    const onStateChanged = (_event: string, newState: S) => {
      setComponentState(newState);
    };
    const onCssStateChanged = (_event: string, newCssState: CssState) => {
      setCssState(newCssState);
    };
    // Use CommandHistoryState for the newHistory parameter
    const onHistoryChanged = (_event: string, newHistory: CommandHistoryState) => {
      setHistory(newHistory);
    };

    const unsubscribeState = component.subscribe('stateChanged', onStateChanged as any);
    const unsubscribeCss = component.subscribe('cssStateChanged', onCssStateChanged as any);
    const unsubscribeTransition = component.subscribe('stateTransition', () => {
        setComponentState(component.getState());
        setCssState(component.getCSSState());
    });
    // The 'as any' here is to satisfy the general EventCallback type.
    // The actual data passed for 'historyChanged' will be CommandHistoryState.
    const unsubscribeHistory = component.subscribe('historyChanged', onHistoryChanged as any);
    
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
