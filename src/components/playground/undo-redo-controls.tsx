'use client';

import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';

interface UndoRedoControlsProps {
  undo: () => void;
  redo: () => void;
  history: {
    canUndo: boolean;
    canRedo: boolean;
    length: number;
    currentPosition: number;
  };
}

export function UndoRedoControls({ undo, redo, history }: UndoRedoControlsProps) {
  return (
    <div className="flex items-center space-x-2 my-2 p-2 border rounded-md bg-card shadow">
      <Button onClick={undo} disabled={!history.canUndo} variant="outline" size="sm" aria-label="Undo last action">
        <Undo className="mr-2 h-4 w-4" /> Undo
      </Button>
      <Button onClick={redo} disabled={!history.canRedo} variant="outline" size="sm" aria-label="Redo last undone action">
        <Redo className="mr-2 h-4 w-4" /> Redo
      </Button>
      <div className="text-xs text-muted-foreground ml-auto">
        History: {history.currentPosition + 1} / {history.length}
      </div>
    </div>
  );
}
