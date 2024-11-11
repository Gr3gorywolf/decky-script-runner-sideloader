import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { EditorContext } from '@/Contexts/EditorContext';
import { getScriptContent, putUpdateScript } from '@/Api/endpoints/scriptsApi';
import { Editor, useMonaco } from '@monaco-editor/react';
import { getMonacoLanguage } from '@/Utils/monaco';
import {
  MenubarShortcut,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from '@/Components/ui/menubar';
import { CodeEditorLogs } from './CodeEditorLogs';
import { useToast } from '@/hooks/use-toast';

export const CodeEditor = () => {
  const { editingFile } = useContext(EditorContext);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const {toast } = useToast();
  const editor = useRef<any>();

  const fetchScriptContent = async () => {
    if (!editingFile) return;
    try {
      const data = await getScriptContent(editingFile?.name);
      setContent(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = useCallback(async () => {
    if (!editingFile) return;
    setIsSaving(true);
    try {
      await putUpdateScript({ ...editingFile, content });
      toast({
        title: 'File saved',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'Failed to save file',
        description: err?.response?.data?.error,
        duration: 2000,
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  }, [editingFile, content]);

  const handleOpenLogs = () => {
    setLogsOpen(true);
  };

  useEffect(() => {
    if (editingFile) {
      fetchScriptContent();
    }
  }, [editingFile]);

  useEffect(() => {
    const handleKeyDown = event => {
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
      <div className="flex-grow">
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
        <Editor
          height="calc(100% - 40px)"
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
      </div>
      {editingFile && logsOpen && (
        <CodeEditorLogs
          script={editingFile}
          onClose={() => {
            setLogsOpen(false);
          }}
        />
      )}
    </>
  );
};
