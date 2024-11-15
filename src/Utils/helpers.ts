import { ScriptData } from '@/Types/ScriptData';
import axios from 'axios';

export const TestDeviceConnection = async (ip: string) => {
  try {
    await axios.get(`http://${ip}:9696/status`);
    return true;
  } catch (error) {
    return false;
  }
};

export const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

export const humanizeFileName = (fileName: string) => {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
  const withSpaces = nameWithoutExtension.replace(/[_-]/g, ' ');
  const spacedCamelCase = withSpaces.replace(/([a-z])([A-Z])/g, '$1 $2');
  const humanized = spacedCamelCase.replace(/\b\w/g, char =>
    char.toUpperCase()
  );
  return humanized;
};

export const getFileExtension = (fileName:string, returnDots = true) =>{
  const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  return returnDots ? fileExtension : fileExtension.slice(1);
} 

export const getDefaultScriptData = (name:string) =>{
  return {
    name,
    author: '',
    description: '',
    image: '',
    language: getFileExtension(name, false),
    root: false,
    title:humanizeFileName(name),
    version: '0.0.0',
  } as ScriptData
}

export const readFile = (): Promise<{ content: string; name: string }> => {
  return new Promise((resolve, reject) => {
    // Create an input element to select a file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js, .py, .lua, .rb, .sh, .pl';

    // Set up an event listener to handle the file selection
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      // Create a FileReader to read the file's content
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({ content: reader.result, name: file.name });
        } else {
          reject(new Error('Failed to read file content as text'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      // Read the file as text
      reader.readAsText(file);
    };

    // Trigger the file input dialog
    input.click();
  });
};
