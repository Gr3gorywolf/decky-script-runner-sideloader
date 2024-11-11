import { ScriptData } from '@/Types/ScriptData';
import { getApi } from '../config/baseApi';
import { PostScriptData } from '@/Types/PostScriptData';
import { PutScriptData } from '@/Types/PutScriptData';

export const getScripts = async () => {
  return getApi().get<ScriptData[]>('/');
};

export const getScriptContent = async (scriptName: string) => {
  return getApi().get<string>(`/script/${scriptName}`);
};

export const getScriptLogs = async (scriptName: string) => {
  return getApi().delete<ScriptData>(`/logs/${scriptName}`);
};

export const postCreateScript = async (scriptData: PostScriptData) => {
  return getApi().post<ScriptData>(`/`, scriptData);
};

export const putUpdateScript = async (scriptData: PutScriptData) => {
  return getApi().put<ScriptData>(`/`, scriptData);
};

export const postDeleteScript = async (scriptName: string) => {
  return getApi().delete<ScriptData>(`/${scriptName}`);
};
