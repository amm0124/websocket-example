// src/services/executionService.js
import { requestExecutionInit } from '../api/executionApi';

// 이거 안 씀;
export const initExecution = async (languageId, sourceCode) => {
  const body = {
    languageId,
    name: "main.cpp",
    type: "FILE",
    content: sourceCode,
    children: [],
    entrypoint: "main.cpp"
  };

  return await requestExecutionInit(body);
};