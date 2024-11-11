import { CodeEditor } from './components/CodeEditor';
import { TopBar } from './components/TopBar';
import { FileList } from './components/FileList';
import { useContext, useEffect } from 'react';
import { EditorContext } from '@/Contexts/EditorContext';
import { TestDeviceConnection } from '@/Utils/helpers';
import { NoFilePlaceholder } from './components/NoFilePlaceholder';
import { NotConnectedPlaceholder } from './components/NotConnectedPlaceholder';

function Editor() {
  const {
    setIsConnected,
    deviceIp,
    setEditingFile,
    setFiles,
    setDeviceIp,
    editingFile,
    isConnected,
  } = useContext(EditorContext);
  useEffect(() => {
    let connectedKey: NodeJS.Timeout | null = null;
    if (isConnected && deviceIp) {
      connectedKey = setInterval(async () => {
        const response = await TestDeviceConnection(deviceIp);
        if (!response) {
          setIsConnected(false);
          setEditingFile(null);
          setFiles([]);
          setDeviceIp(undefined);
        }
      }, 10000);
    }

    return () => {
      if (connectedKey) {
        clearInterval(connectedKey);
      }
    };
  }, [deviceIp, isConnected]);
  return (
    <div className="dark flex flex-col h-screen bg-gray-900 text-gray-300 font-mono">
      {/* Top bar */}
      <TopBar />

      {isConnected ? (
        <div className="flex flex-1 overflow-hidden">
          {/* File list sidebar */}
          <FileList />

          {/* Code editor */}
          {editingFile ? <CodeEditor /> : <NoFilePlaceholder />}
        </div>
      ) : (
        <NotConnectedPlaceholder />
      )}
    </div>
  );
}

export default Editor;
