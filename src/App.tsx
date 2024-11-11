import Editor from './Pages/Editor';
import { EditorContextProvider } from './Contexts/EditorContext';
import { QueryClient, QueryClientProvider } from 'react-query';

export const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EditorContextProvider>
        <Editor />
      </EditorContextProvider>
    </QueryClientProvider>
  );
};

export default App;
