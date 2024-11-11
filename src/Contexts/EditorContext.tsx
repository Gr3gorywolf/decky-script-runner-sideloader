import { ScriptData } from '@/Types/ScriptData';
import { createContext, ReactNode, useState } from 'react';

interface EditorContextType {
  files: ScriptData[];
  setFiles: React.Dispatch<React.SetStateAction<ScriptData[]>>;
  editingFile: ScriptData | null;
  setEditingFile: React.Dispatch<React.SetStateAction<ScriptData | null>>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  deviceIp?: string;
  setDeviceIp: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Create the context with an initial value (use `undefined` as the default value)
export const EditorContext = createContext<EditorContextType>({
  editingFile: null,
  files: [],
  isConnected: false,
  setDeviceIp: () => null,
  setEditingFile: () => null,
  setFiles: () => null,
  setIsConnected: () => null,
  deviceIp: undefined,
});

// Create a provider component
interface EditorProviderProps {
  children: ReactNode;
}

export const EditorContextProvider: React.FC<EditorProviderProps> = ({
  // eslint-disable-next-line react/prop-types
  children,
}) => {
  const [files, setFiles] = useState<ScriptData[]>([]);
  const [editingFile, setEditingFile] = useState<ScriptData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceIp, setDeviceIp] = useState<string | undefined>();

  return (
    <EditorContext.Provider
      value={{
        files,
        setFiles,
        editingFile,
        setEditingFile,
        isConnected,
        setIsConnected,
        deviceIp,
        setDeviceIp,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
