import { getScriptLogs } from '@/Api/endpoints/scriptsApi';
import { ScriptData } from '@/Types/ScriptData';
import { FC, useEffect, useRef, useState } from 'react';
import Ansi from 'ansi-to-react';
import { X } from 'lucide-react';

interface props {
  script: ScriptData;
  onClose: () => void;
}

export const CodeEditorLogs: FC<props> = ({ onClose, script }) => {
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchConsoleOutput = async (initialFetch = false) => {
    const scriptLogs = await getScriptLogs(script.name);
    setConsoleOutput(scriptLogs.data.split('\n'));
    if(initialFetch){
      setTimeout(() => {
        containerRef.current?.scrollTo(0, 10000000);
      }, 3);
    }
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
    fetchConsoleOutput(true);
    const interval = setInterval(fetchConsoleOutput, 1000);
    const autoScrollInterval = setInterval(autoScroll, 200);
    return () => {
      clearInterval(interval);
      clearInterval(autoScrollInterval);
    };
  }, [script]);
  return (
    <div
      className="w-full overflow-y-auto px-4 py-2 bg-gray-900  rounded-md"
      style={{
        height: '100%',
      }}
      
    >
      <h5 className='flex flex-row mb-1'>Logs <X onClick={onClose} size={18} className='cursor-pointer ml-auto' /></h5>
      <div style={{ 
        height: 'calc(100% - 1.75rem)'
       }} ref={containerRef} className='overflow-y-auto'>
      {consoleOutput.map((line, index) => (
        <div key={index} className="m-0 py-1 flex">
          <span className="mr-2 text-green-400">{`/>`}</span>
          <span className="text-gray-50">
            <Ansi>{line}</Ansi>
          </span>
        </div>
      ))}
      </div>
    </div>
  );
};
