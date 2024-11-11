import { FileIcon } from 'lucide-react';

export const NoFilePlaceholder = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-[#1a1a1a] text-white">
      <div className="text-center space-y-6 p-8  rounded-2xl  max-w-md w-full">
        <div className="flex justify-center">
          <div className="p-4">
            <FileIcon className="w-16 h-16 text-gray-400" aria-hidden="true" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-200">No script Selected</h2>
        <p className="text-gray-200 text-lg">Select a file to start editing</p>
      </div>
    </div>
  );
};
