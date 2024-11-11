import { getScriptLogs } from '@/Api/endpoints/scriptsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/Components/ui/sheet';
import { ScriptData } from '@/Types/ScriptData';
import { FC, useEffect, useRef, useState } from 'react';

interface props {
  script: ScriptData;
  onClose: () => void;
}

export const CodeEditorLogs: FC<props> = ({ onClose, script }) => {
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchConsoleOutput = async () => {
    const scriptLogs = await getScriptLogs(script.name);
    setConsoleOutput(scriptLogs.data.split('\n'));
  };

  const autoScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const offset = 2.0;
    const reverseScrollHeight = Math.abs(
      container.scrollHeight - container.scrollTop - container.clientHeight
    );
    const isOnBottom = reverseScrollHeight <= offset;
    if (isOnBottom) {
      setTimeout(() => {
        container.scrollTop = 10000000;
      }, 15);
    }
  };

  useEffect(() => {
    fetchConsoleOutput();
    const interval = setInterval(fetchConsoleOutput, 1000);
    const autoScrollInterval = setInterval(autoScroll, 200);
    return () => {
      clearInterval(interval);
      clearInterval(autoScrollInterval);
    };
  }, []);
  return (
    <Sheet onOpenChange={() => onClose()} open={true}>
      <SheetContent className="dark text-white">
        <SheetHeader>
          <SheetTitle>Script logs</SheetTitle>
        </SheetHeader>
        <div
          className="w-full overflow-y-auto p-2 mt-2 bg-gray-900 rounded-md"
          style={{
            height: 'calc(100vh - 70px)',
          }}
          ref={containerRef}
        >
          {consoleOutput.map((line, index) => (
            <div key={index} className="m-0 py-1 flex">
              <span className="mr-2 text-green-400">{`/>`}</span>
              <span className="text-gray-50">{line}</span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};