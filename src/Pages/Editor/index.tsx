import { CodeEditor } from './components/CodeEditor';
import { TopBar } from './components/TopBar';
import { FileList } from './components/FileList';
import { useContext, useEffect, useState } from 'react';
import { EditorContext } from '@/Contexts/EditorContext';
import { TestDeviceConnection } from '@/Utils/helpers';
import { NoFilePlaceholder } from './components/NoFilePlaceholder';
import { NotConnectedPlaceholder } from './components/NotConnectedPlaceholder';
import { useGetScripts } from '@/Hooks/useGetScripts';
import classnames from 'classnames';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/Components/ui/resizable';
import { useScreenSize } from '@/Hooks/useScreenSize';

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
  const { refetch: refetchScripts } = useGetScripts(isConnected);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const { isDesktopOrLaptop } = useScreenSize();

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


  useEffect(()=>{
    if(!isDesktopOrLaptop){
      setSidebarVisible(!editingFile);
    }
   
  },[editingFile, isDesktopOrLaptop])



  useEffect(() => {
    const intKey = setInterval(() => {
      refetchScripts();
    }, 10000);
    return () => {
      clearInterval(intKey);
    };
  }, [isConnected]);
  return (
    <div className="dark flex flex-col h-screen bg-gray-900 text-gray-300 font-mono">
      {/* Top bar */}
      <TopBar onSidebarTrigger={()=>setSidebarVisible(!sidebarVisible)} />

      {isConnected ? (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            className={classnames({
              'w-0': !sidebarVisible,
              'max-w-0': !sidebarVisible,
              'min-w-80': sidebarVisible || isDesktopOrLaptop,
            })}
          >
            {/* File list sidebar */}
            <FileList />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75} className="h-full">
            {/* Code editor */}
            <div className="d-flex h-full">
              {editingFile ? <CodeEditor /> : <NoFilePlaceholder />}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <NotConnectedPlaceholder />
      )}
    </div>
  );
}

export default Editor;
