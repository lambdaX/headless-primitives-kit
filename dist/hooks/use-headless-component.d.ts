import type { HeadlessComponent, BaseComponentState, CssState } from '@/components/headless-logic';
import type { CommandHistoryState } from '@/components/headless-logic/command';
interface HeadlessHookResult<T extends HeadlessComponent<S>, S extends BaseComponentState> {
    component: T;
    componentState: S;
    cssState: CssState;
    history: CommandHistoryState;
    undo: () => void;
    redo: () => void;
}
export declare function useHeadlessComponent<T extends HeadlessComponent<S>, S extends BaseComponentState>(HeadlessComponentClass: new () => T): HeadlessHookResult<T, S>;
export {};
//# sourceMappingURL=use-headless-component.d.ts.map