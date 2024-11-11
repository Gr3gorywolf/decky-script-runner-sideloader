import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@radix-ui/react-label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FC, useState } from 'react';
import { ScriptData } from '@/Types/ScriptData';
import { postDeleteScript, putUpdateScript } from '@/Api/endpoints/scriptsApi';
import { queryClient } from '@/App';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      await putUpdateScript(editingFile);
      queryClient.refetchQueries('scripts-fetch');
    } catch (err) {
      console.log(err.response);
      onClose();
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this script?')) return;
    setIsDeleting(true);
    try {
      await postDeleteScript(editingFile.name);
      queryClient.refetchQueries('scripts-fetch');
    } catch (err) {
      console.log(err.response);
      onClose();
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
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
            className="bg-red-600 hover:bg-red-500 w-1/2"
            disabled={isSaving || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? 'Deleting...' : 'Delete script'}
          </Button>
          <Button
            className="w-1/2"
            disabled={isSaving || isDeleting}
            onClick={handleSaveEdit}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
