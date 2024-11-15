import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { EditorContext } from '@/Contexts/EditorContext';
import { getScriptContent, putUpdateScript } from '@/Api/endpoints/scriptsApi';
import { Editor } from '@monaco-editor/react';
import { getMonacoLanguage } from '@/Utils/monaco';
import {
  MenubarShortcut,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/Components/ui/menubar';
import { CodeEditorLogs } from './CodeEditorLogs';
import { useToast } from '@/Hooks/use-toast';
import { SCRIPTS_QUERY_KEY, useGetScripts } from '@/Hooks/useGetScripts';
import { queryClient } from '@/App';
import { WarningAlert } from '@/Components/ui/warning-alert';
import { prependScriptComment } from '@/Utils/scripts';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/Components/ui/resizable';
import classNames from 'classnames';

export const CodeEditor = () => {
  const { editingFile } = useContext(EditorContext);
  const [content, setContent] = useState('');
  const [_, setIsSaving] = useState(false);
  const [showNotCommentAlert, setShowNotCommentAlert] = useState(false);
  const prevContent = useRef<string | null>(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const { toast } = useToast();
  const editor = useRef<any>();
  const { data: scripts } = useGetScripts(true);

  const hasMetadata = (scriptContent: string) => {
    return scriptContent.includes('----------metadata---------');
  };

  const extractMetadata = (scriptContent: string) => {
    if (!hasMetadata(scriptContent)) return null;
    return (
      scriptContent
        .split('----------metadata---------')[1]
        ?.split('----------metadata---------')[0] ?? null
    );
  };

  const fetchScriptContent = async () => {
    if (!editingFile) return;
    try {
      const data = await getScriptContent(editingFile?.name);
      setContent(data.data);
      if (!hasMetadata(data.data)) {
        setShowNotCommentAlert(true);
      }
      prevContent.current = data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetMetadata = useCallback(() => {
    setContent(prependScriptComment(editingFile?.name ?? '', content));
    setShowNotCommentAlert(false);
  }, [editingFile, content]);

  const handleSave = useCallback(async () => {
    if (!editingFile) return;
    setIsSaving(true);
    try {
      const foundScript = scripts?.find(
        script => script.name === editingFile.name
      );
      await putUpdateScript({ ...editingFile, ...foundScript, content });
      const metadata = extractMetadata(content) ?? '';
      const prevMetadata = extractMetadata(prevContent.current ?? '') ?? '';
      setShowNotCommentAlert(!hasMetadata(content));

      if (metadata !== prevMetadata) {
        queryClient.refetchQueries(SCRIPTS_QUERY_KEY);
        prevContent.current = content;
      }
      toast({
        title: 'File saved',
        duration: 2000,
      });
    } catch (err: any) {
      toast({
        title: 'Failed to save file',
        description: err?.response?.data?.error,
        duration: 2000,
        variant: 'destructive',
      });
      console.error(err);
    }
    setIsSaving(false);
  }, [editingFile, content, scripts]);

  const handleOpenLogs = () => {
    setLogsOpen(true);
  };

  useEffect(() => {
    if (editingFile) {
      fetchScriptContent();
    }
  }, [editingFile]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSave();
      }

      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        handleOpenLogs();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <>
      <div className="h-full">
        <Menubar className="w-full bg-gray-800 rounded-none dark">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent className="dark">
              <MenubarItem onClick={handleSave}>
                Save <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent className="dark">
              <MenubarItem
                onClick={() => {
                  editor?.current.trigger('keyboard', 'undo', null);
                }}
              >
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  editor?.current.trigger('keyboard', 'redo', null);
                }}
              >
                Redo <MenubarShortcut>⌘Y</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Debug</MenubarTrigger>
            <MenubarContent className="dark">
              <MenubarItem onClick={handleOpenLogs}>
                Open logs <MenubarShortcut>⌘L</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        {showNotCommentAlert && (
          <WarningAlert
            message="No metadata comment detected"
            actionLabel="Create it"
            onClose={() => setShowNotCommentAlert(false)}
            onAction={handleSetMetadata}
          />
        )}

        <ResizablePanelGroup
          direction="vertical"
          style={{ height: 'calc(100% - 40px)' }}
        >
          <ResizablePanel
            defaultSize={70}
            className={classNames({
              'min-h-full': !logsOpen,
            })}
          >
            {/* File list sidebar */}
            <Editor
              className="h-full"
              onMount={edi => {
                editor.current = edi;
              }}
              defaultLanguage={getMonacoLanguage(editingFile?.language ?? '')}
              theme="vs-dark"
              language={getMonacoLanguage(editingFile?.language ?? '')}
              value={content}
              onChange={value => setContent(value ?? '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                formatOnPaste: true,
                scrollBeyondLastLine: false,
                readOnly: false,
                cursorStyle: 'line',
              }}
            />
          </ResizablePanel>
          <ResizableHandle />
          {editingFile && logsOpen && (
            <ResizablePanel defaultSize={30} className="min-h-64">
              <CodeEditorLogs
                script={editingFile}
                onClose={() => {
                  setLogsOpen(false);
                }}
              />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
    </>
  );
};
