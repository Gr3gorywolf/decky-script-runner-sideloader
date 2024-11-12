/* eslint-disable indent */
import { Button } from '@/Components/ui/button';
import {
  Upload,
  FileIcon,
  FileCode,
  FileJson,
  FileText,
  Terminal,
  MoreVertical,
  Plus,
  Pencil,
  Delete,
  Download,
} from 'lucide-react';
import { FileEditDialog } from './FileEditDialog';
import { SCRIPTS_QUERY_KEY, useGetScripts } from '@/Hooks/useGetScripts';
import { useContext, useState } from 'react';
import { EditorContext } from '@/Contexts/EditorContext';
import { humanizeFileName, readFile } from '@/Utils/helpers';
import {
  getScriptContent,
  postCreateScript,
  postDeleteScript,
  putUpdateScript,
} from '@/Api/endpoints/scriptsApi';
import { queryClient } from '@/App';
import { ScriptData } from '@/Types/ScriptData';
import { PostScriptData } from '@/Types/PostScriptData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { useToast } from '@/Hooks/use-toast';

export const FileList = () => {
  const { isConnected, editingFile, setEditingFile } =
    useContext(EditorContext);
  const { data: scripts } = useGetScripts(isConnected);
  const [editingScript, setEditingScript] = useState<ScriptData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
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
    try {
      const { content, name } = await readFile();
      setIsSubmitting(true);
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
    } catch (err:any) {
      toast({
        title: 'Failed to upload the script',
        description: err?.response?.data?.error,
        duration: 2000,
        variant: 'destructive',
      });
      console.log(err);
    }

    setIsSubmitting(false);
  };

  const handleCreateScript = async () => {
    const name = prompt('Enter the name of the script');
    if (!name) return;
    setIsCreating(true);
    try {
      const fileExtension = name.slice(name.lastIndexOf('.')).toLowerCase();
      const foundScript = scripts?.find(script => script.name == name);
      if (foundScript) {
        console.error('Script already exists');
        return;
      } else {
        const newScript: PostScriptData = {
          name,
          description: '',
          content: '',
          author: '',
          language: fileExtension.slice(1),
        };
        await postCreateScript(newScript);
        setEditingFile(newScript);
      }
      queryClient.refetchQueries(SCRIPTS_QUERY_KEY);
    } catch (err:any) {
      console.log(err);
      toast({
        title: 'Failed to create the script',
        description: err?.response?.data?.error,
        duration: 2000,
        variant: 'destructive',
      });
    }

    setIsCreating(false);
  };

  const handleDelete = async (script: ScriptData) => {
    if (!confirm('Are you sure you want to delete this script?')) return;
    try {
      await postDeleteScript(script.name);
      if (script.name === editingFile?.name) {
        setEditingFile(null);
      }
      queryClient.refetchQueries(SCRIPTS_QUERY_KEY);
    } catch (err:any) {
      toast({
        title: 'Failed to delete the script',
        description: err?.response?.data?.error,
        duration: 2000,
        variant: 'destructive',
      });
      console.log(err.response);
    }
  };

  const handleDownload = async (script: ScriptData) => {
    try{
      const scriptData = await getScriptContent(script.name);

      const element = document.createElement('a');
      const file = new Blob([scriptData.data], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = script.name;
      document.body.appendChild(element);
      element.click();
    }catch(err:any){
      toast({
        title: 'Failed to download the script',
        description: err?.response?.data?.error,
        duration: 2000,
        variant: 'destructive',
      });
      console.log(err.response);
    }
    
  }

  return (
    <>
      <div className="w-90 bg-gray-900 p-4 flex flex-col">
        {isConnected && (
          <div className="flex flex-row gap-2">
            <Button
              onClick={handleFileUpload}
              className="mb-4 w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />{' '}
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </Button>

            <Button
              onClick={handleCreateScript}
              className="mb-4 w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />{' '}
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        )}
        <div className="overflow-y-auto flex-grow">
          {scripts &&
            isConnected &&
            scripts.map((script, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-800 rounded ${
                  editingFile?.name === script.name ? 'bg-gray-800' : ''
                }`}
                onClick={() => setEditingFile(script)}
              >
                <div className="flex items-center">
                  {getFileIcon(script.language)}
                  <div>
                    <div>{script.title}</div>
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-24 dark">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation();
                          handleDownload(script);
                        }}
                      >
                        <Download />
                        <span>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(script);
                        }}
                      >
                        <Delete />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
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