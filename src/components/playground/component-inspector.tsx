'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { HeadlessComponent, BaseComponentState, CssState } from '@/components/headless-logic';

interface ComponentInspectorProps<S extends BaseComponentState> {
  componentInstance: HeadlessComponent<S>;
  componentState: S;
  cssState: CssState;
}

export function ComponentInspector<S extends BaseComponentState>({
  componentState,
  cssState,
}: ComponentInspectorProps<S>) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const dataToInspect = {
    componentDataState: componentState,
    currentCssState: cssState,
  };

  const jsonString = JSON.stringify(dataToInspect, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", description: "Could not copy text to clipboard.", variant: "destructive" });
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Component Inspector</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopy} aria-label="Copy JSON state">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="ml-2">{copied ? 'Copied!' : 'Copy JSON'}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border bg-muted/30 p-1">
          <pre className="text-xs p-3 font-code whitespace-pre-wrap break-all">
            <code>{jsonString}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
