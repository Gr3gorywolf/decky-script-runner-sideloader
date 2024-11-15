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
import { Save } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';

export const CodeEditor = () => {
  const { editingFile, editingFileHasChanges, setEditingFileHasChanges } =
    useContext(EditorContext);
  const [content, setContent] = useState('');
  const [_, setIsSaving] = useState(false);
  const [showNotCommentAlert, setShowNotCommentAlert] = useState(false);
  const prevContent = useRef<string | null>(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const { toast } = useToast();
  const editor = useRef<any>();
  const monaco = useRef<any>();
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

  function clearUndoRedoHistory() {
    if (!editor.current || !monaco.current) return;

    // Get the current content and language
    const currentValue = editor.current.getValue();
    const currentLanguage = editor.current.getModel().getLanguageId();

    // Dispose of the current model to clean up resources
    editor.current.getModel().dispose();

    // Create a new model with the same content and language
    const newModel = monaco.current.editor.createModel(currentValue, currentLanguage);

    // Assign the new model to the editor
    editor.current.setModel(newModel);
  }

  const fetchScriptContent = async () => {
    if (!editingFile) return;
    try {
      const data = await getScriptContent(editingFile?.name);
      
      if (!hasMetadata(data.data)) {
        setShowNotCommentAlert(true);
      }
      prevContent.current = data.data;
      handleContentChange(data.data);
      setTimeout(() => {
        clearUndoRedoHistory();
      }, 100);
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
      setEditingFileHasChanges(false);

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

  const handleContentChange = (newContent: string) => {
    const normalizeContent = (content: string) => content.replace('\r\n', '\n').replace('\r', '').trim();
    const normalizedNewContent = normalizeContent(newContent);
    const normalizedPrevContent = normalizeContent(prevContent.current ?? '');
    const isModified = normalizedNewContent !== normalizedPrevContent;
    setEditingFileHasChanges(isModified);
    setContent(newContent);
  };

  const handleOpenLogs = () => {
    setLogsOpen(!logsOpen);
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
            <MenubarTrigger onClick={handleSave} className="cursor-pointer">
              <Save size={14} className="mr-1" /> Save
            </MenubarTrigger>
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
            <MenubarTrigger onClick={handleOpenLogs} className="cursor-pointer">
              {' '}
              Open logs
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
        <div className="bg-gray-800 border-t border-t-gray-700 w-full px-4 py-1 ">
          <h5>
            {editingFile?.name}{' '}
            {editingFileHasChanges && (
              <Badge variant="default" className="ml-3">
                Modified
              </Badge>
            )}
          </h5>
        </div>
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
              onMount={(edi, monac) => {
                editor.current = edi;
                monaco.current = monac;
              }}
              keepCurrentModel={true}
              defaultLanguage={getMonacoLanguage(editingFile?.language ?? '')}
              theme="vs-dark"
              language={getMonacoLanguage(editingFile?.language ?? '')}
              value={content}
              onChange={value => handleContentChange(value ?? '')}
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
