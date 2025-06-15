import { useState, useEffect, useMemo, useCallback } from 'react';
import type { HeadlessComponent, BaseComponentState, CssState } from '@/components/headless-logic';

interface HeadlessHookResult<T extends HeadlessComponent<S>, S extends BaseComponentState> {
  component: T;
  componentState: S;
  cssState: CssState;
  history: ReturnType<T['getHistory']>;
  undo: () => void;
  redo: () => void;
}

export function useHeadlessComponent<T extends HeadlessComponent<S>, S extends BaseComponentState>(
  HeadlessComponentClass: new () => T
): HeadlessHookResult<T, S> {
  const component = useMemo(() => new HeadlessComponentClass(), [HeadlessComponentClass]);

  const [componentState, setComponentState] = useState<S>(component.getState());
  const [cssState, setCssState] = useState<CssState>(component.getCSSState());
  const [history, setHistory] = useState(component.getHistory());

  useEffect(() => {
    const onStateChanged = (_event: string, newState: S) => {
      setComponentState(newState);
    };
    const onCssStateChanged = (_event: string, newCssState: CssState) => {
      setCssState(newCssState);
    };
    const onHistoryChanged = (_event: string, newHistory: ReturnType<T['getHistory']>) => {
      setHistory(newHistory);
    };

    const unsubscribeState = component.subscribe('stateChanged', onStateChanged as any);
    const unsubscribeCss = component.subscribe('cssStateChanged', onCssStateChanged as any);
    // stateTransition also implies cssStateChanged, but listening specifically to cssStateChanged is more direct
    const unsubscribeTransition = component.subscribe('stateTransition', () => {
        setComponentState(component.getState()); // Ensure data state is also updated
        setCssState(component.getCSSState());
    });
    const unsubscribeHistory = component.subscribe('historyChanged', onHistoryChanged as any);
    
    // Initial sync after subscriptions are set up
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
