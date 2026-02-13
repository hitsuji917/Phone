// api.ts
// 这是一个专门用于配置 API 的文件。
// 现在它会从 localStorage 中读取配置，而不是使用硬编码的值。

// 定义存储在 localStorage 中的键名
export const STORAGE_KEYS = {
  API_KEY: 'apiKey',
  BASE_URL: 'baseUrl',
  MODEL_NAME: 'modelName',
  MODEL_LIST: 'modelList',
};

// 默认值 (可以保留作为 fallback，或者完全留空)
export const DEFAULT_CONFIG = {
  BASE_URL: 'https://api.example.com/v1',
  MODEL_NAME: 'deepseek-chat',
};

// ------------------------------------------------------------------
// API 调用函数
// ------------------------------------------------------------------
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 获取模型列表
export async function fetchModels(apiKey: string, baseUrl: string) {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('请先输入 API Key');
  }
  if (!baseUrl || baseUrl.trim() === '') {
    throw new Error('请先输入 Base URL');
  }

  try {
    const response = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`连接失败: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.data; // 通常返回 { object: "list", data: [...] }
  } catch (error) {
    console.error('Fetch Models Error:', error);
    throw error;
  }
}

export async function chatCompletion(messages: Message[]) {
  // 从 localStorage 获取配置
  const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
  const baseUrl = localStorage.getItem(STORAGE_KEYS.BASE_URL) || DEFAULT_CONFIG.BASE_URL;
  const modelName = localStorage.getItem(STORAGE_KEYS.MODEL_NAME) || DEFAULT_CONFIG.MODEL_NAME;

  // 检查 API Key 是否存在
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API_KEY_MISSING');
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        stream: false, // 暂时不使用流式传输，简化处理
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API 请求失败: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
