import { useContext, useEffect, useState, useCallback } from 'react';
import { EditorContext } from '@/Contexts/EditorContext';
import { getScriptContent, putUpdateScript } from '@/Api/endpoints/scriptsApi';
import { Editor } from '@monaco-editor/react';
import { getMonacoLanguage } from '@/Utils/monaco';

export const CodeEditor = () => {
  const { editingFile } = useContext(EditorContext);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
    } catch (err) {
      console.log(err.response);
    }
    setIsSaving(false);
  }, [editingFile, content]);

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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="flex-grow">
      <Editor
        height="100%"
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
          scrollBeyondLastLine: false,
          readOnly: false,
          cursorStyle: 'line',
        }}
      />
      {!editingFile && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
          Select a file to start editing
        </div>
      )}
    </div>
  );
};
