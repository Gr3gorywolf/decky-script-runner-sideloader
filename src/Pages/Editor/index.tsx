import { CodeEditor } from './components/CodeEditor';
import { TopBar } from './components/TopBar';
import { FileList } from './components/FileList';
import { useContext, useEffect } from 'react';
import { EditorContext } from '@/Contexts/EditorContext';
import { TestDeviceConnection } from '@/Utils/helpers';

function Editor() {
  const {
    setIsConnected,
    deviceIp,
    setEditingFile,
    setFiles,
    setDeviceIp,
    isConnected,
  } = useContext(EditorContext);
  useEffect(() => {
    let connectedKey = null;
    if (isConnected && deviceIp) {
      connectedKey = setInterval(async () => {
        const response = await TestDeviceConnection(deviceIp);
        if (!response) {
          setIsConnected(false);
          setEditingFile(null);
          setFiles([]);
          setDeviceIp(undefined);
        }
      }, 2000);
    }

    return () => {
      if (connectedKey) {
        clearInterval(connectedKey);
      }
    };
  }, [deviceIp, isConnected]);
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 font-mono">
      {/* Top bar */}
      <TopBar />

      {isConnected && (
        <div className="flex flex-1 overflow-hidden">
          {/* File list sidebar */}
          <FileList />

          {/* Code editor */}
          <CodeEditor />
        </div>
      )}
    </div>
  );
}

export default Editor;
