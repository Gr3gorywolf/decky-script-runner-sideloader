/* eslint-disable indent */
import { Button } from '@/components/ui/button';
import {
  Upload,
  FileIcon,
  FileCode,
  FileJson,
  FileText,
  Terminal,
  MoreVertical,
} from 'lucide-react';
import { FileEditDialog } from './FileEditDialog';
import { SCRIPTS_QUERY_KEY, useGetScripts } from '@/Hooks/useGetScripts';
import { useContext, useState } from 'react';
import { EditorContext } from '@/Contexts/EditorContext';
import { readFile } from '@/Utils/helpers';
import { postCreateScript, putUpdateScript } from '@/Api/endpoints/scriptsApi';
import { queryClient } from '@/App';
import { ScriptData } from '@/Types/ScriptData';

export const FileList = () => {
  const { isConnected, editingFile, setEditingFile } =
    useContext(EditorContext);
  const { data: scripts } = useGetScripts(isConnected);
  const [editingScript, setEditingScript] = useState<ScriptData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getFileIcon = (language?: string) => {
    switch (language) {
      case 'js':
        return <FileJson className="mr-2 h-4 w-4" />;
      case 'sh':
        return <Terminal className="mr-2 h-4 w-4" />;
      case 'py':
        return <FileCode className="mr-2 h-4 w-4" />;
      case 'php':
        return <FileCode className="mr-2 h-4 w-4" />;
      case 'rb':
        return <FileCode className="mr-2 h-4 w-4" />;
      case 'lua':
        return <FileText className="mr-2 h-4 w-4" />;
      default:
        return <FileIcon className="mr-2 h-4 w-4" />;
    }
  };

  const handleFileUpload = async () => {
    setIsSubmitting(true);
    try {
      const { content, name } = await readFile();
      const fileExtension = name.slice(name.lastIndexOf('.')).toLowerCase();
      const foundScript = scripts?.find(script => script.name == name);
      if (foundScript) {
        await putUpdateScript({
          ...foundScript,
          content,
        });
      } else {
        await postCreateScript({
          name,
          description: '',
          content,
          author: '',
          language: fileExtension.slice(1),
        });
      }
      if (foundScript) {
        setEditingFile(foundScript);
      }
      queryClient.refetchQueries(SCRIPTS_QUERY_KEY);
    } catch (err) {
      console.log(err);
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <div className="w-80 bg-gray-800 p-4 flex flex-col">
        {isConnected && (
          <Button
            onClick={handleFileUpload}
            className="mb-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />{' '}
            {isSubmitting ? 'Uploading...' : 'Upload script'}
          </Button>
        )}
        <div className="overflow-y-auto flex-grow">
          {scripts &&
            isConnected &&
            scripts.map((script, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-700 rounded ${
                  editingFile?.name === script.name ? 'bg-gray-700' : ''
                }`}
                onClick={() => setEditingFile(script)}
              >
                <div className="flex items-center">
                  {getFileIcon(script.language)}
                  <div>
                    <div>{script.name}</div>
                    {script.description && (
                      <div className="text-xs text-gray-400">
                        {script.description}
                      </div>
                    )}
                    {script.author && (
                      <div className="text-xs text-gray-500">
                        {script.author}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={e => {
                    e.stopPropagation();
                    setEditingScript(script);
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </div>
      </div>
      {editingScript && (
        <FileEditDialog
          isOpen={true}
          onClose={() => setEditingScript(null)}
          selectedScript={editingScript}
        />
      )}
    </>
  );
};
