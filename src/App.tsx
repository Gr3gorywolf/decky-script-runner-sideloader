import Editor from './Pages/Editor';
import { EditorContextProvider } from './Contexts/EditorContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from './Components/ui/toaster';

export const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EditorContextProvider>
        <Toaster />
        <Editor />
      </EditorContextProvider>
    </QueryClientProvider>
  );
};

export default App;
