import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { FC, useState } from 'react';
import { ScriptData } from '@/Types/ScriptData';
import {  putUpdateScript } from '@/Api/endpoints/scriptsApi';
import { queryClient } from '@/App';
import { useToast } from '@/Hooks/use-toast';
interface props {
  selectedScript: ScriptData;
  onClose: () => void;
  isOpen: boolean;
}

export const FileEditDialog: FC<props> = ({
  selectedScript,
  onClose,
  isOpen,
}) => {
  const [editingFile, setEditingFile] = useState<ScriptData>(selectedScript);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      await putUpdateScript(editingFile);
      queryClient.refetchQueries('scripts-fetch');
    } catch (err:any) {
      toast({
        title: 'Failed to edit the script',
        description: err?.response?.data?.error,
        duration: 2000,
        variant: 'destructive',
      });
      console.log(err.response); 
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] dark text-white">
        <DialogHeader>
          <DialogTitle>Edit File Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={editingFile?.description || ''}
              onChange={e =>
                setEditingFile(prev => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <Button
            className="w-full"
            disabled={isSaving}
            onClick={handleSaveEdit}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
