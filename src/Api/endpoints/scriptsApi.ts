import { ScriptData } from '@/Types/ScriptData';
import { getApi } from '../config/baseApi';
import { PostScriptData } from '@/Types/PostScriptData';

export const getScripts = async () => {
  return getApi().get<ScriptData[]>('/scripts');
};

export const getScriptContent = async (scriptName: string) => {
  return getApi().get<string>(`/script/${scriptName}`);
};

export const getScriptLogs = async (scriptName: string) => {
  return getApi().get<string>(`/logs/${scriptName}`);
};

export const postCreateScript = async (scriptData: PostScriptData) => {
  return getApi().post<ScriptData>(`/`, scriptData);
};

export const postRenameScript = async (scriptData: PostScriptData & {new_name:string}) => {
  return getApi().post<ScriptData>(`/rename`, scriptData);
};

export const putUpdateScript = async (scriptData: PostScriptData) => {
  return getApi().put<ScriptData>(`/`, scriptData);
};

export const postDeleteScript = async (scriptName: string) => {
  return getApi().delete<ScriptData>(`/${scriptName}`);
};
