import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Check, RefreshCw, Search, ChevronDown } from 'lucide-react';
import { STORAGE_KEYS, DEFAULT_CONFIG, fetchModels } from '../../../api';

interface Model {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

function Settings() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Model List & Testing States
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [modelList, setModelList] = useState<Model[]>([]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [modelSearch, setModelSearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load from localStorage on mount
    setApiKey(localStorage.getItem(STORAGE_KEYS.API_KEY) || '');
    setBaseUrl(localStorage.getItem(STORAGE_KEYS.BASE_URL) || DEFAULT_CONFIG.BASE_URL);
    setModelName(localStorage.getItem(STORAGE_KEYS.MODEL_NAME) || DEFAULT_CONFIG.MODEL_NAME);
    setSystemPrompt(localStorage.getItem('systemPrompt') || '');

    // Load cached models
    const cachedModels = localStorage.getItem(STORAGE_KEYS.MODEL_LIST);
    if (cachedModels) {
      try {
        setModelList(JSON.parse(cachedModels));
      } catch (e) {
        console.error('Failed to parse cached models', e);
      }
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    localStorage.setItem(STORAGE_KEYS.BASE_URL, baseUrl);
    localStorage.setItem(STORAGE_KEYS.MODEL_NAME, modelName);
    localStorage.setItem('systemPrompt', systemPrompt);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      const models = await fetchModels(apiKey, baseUrl);
      setModelList(models);
      localStorage.setItem(STORAGE_KEYS.MODEL_LIST, JSON.stringify(models));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error: any) {
      setTestError(error.message || '连接测试失败');
    } finally {
      setIsTesting(false);
    }
  };

  const filteredModels = useMemo(() => {
    if (!modelSearch) return modelList;
    return modelList.filter(m => m.id.toLowerCase().includes(modelSearch.toLowerCase()));
  }, [modelList, modelSearch]);

  return (
    <div className="flex flex-col h-full bg-[#f2f2f7] safe-area-inset-bottom relative">
      {/* 顶部标题栏 */}
      <header className="flex-none bg-white/80 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-between px-4 sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="text-[#007aff] flex items-center -ml-2 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-[17px]">返回</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">设置</h1>
        <button 
          onClick={handleSave}
          className="text-[#007aff] font-medium hover:opacity-70 transition-opacity"
        >
          保存
        </button>
      </header>

      {/* Settings Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        
        {/* API Configuration Section */}
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-gray-500 uppercase ml-3">API 配置</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center px-4 py-3 border-b border-gray-100 last:border-0">
              <label className="w-24 text-[15px] text-gray-900">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 text-[15px] text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center px-4 py-3 border-b border-gray-100 last:border-0">
              <label className="w-24 text-[15px] text-gray-900">Base URL</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com/v1"
                className="flex-1 text-[15px] text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
          </div>
          
          {/* Test Connection Button */}
          <div className="px-1">
             <button
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey || !baseUrl}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[15px] font-medium transition-all ${
                testError 
                  ? 'bg-red-50 text-red-600 border border-red-100' 
                  : 'bg-white text-[#007aff] border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  正在连接...
                </>
              ) : testError ? (
                <>重试 ({testError})</>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  测试连接并获取模型
                </>
              )}
            </button>
          </div>

          <div 
            ref={dropdownRef}
            className="bg-white shadow-sm mt-4 relative z-50"
            style={{ 
              borderRadius: showModelDropdown ? '12px 12px 0 0' : '12px',
              transition: 'border-radius 0.2s'
            }}
          >
             <div 
              className="flex items-center px-4 py-3 cursor-pointer"
              onClick={() => setShowModelDropdown(!showModelDropdown)}
             >
              <label className="w-24 text-[15px] text-gray-900">Model</label>
              <div className="flex-1 flex items-center justify-between">
                <span className={`text-[15px] ${modelName ? 'text-gray-900' : 'text-gray-400'}`}>
                  {modelName || '点击选择或输入模型...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Dropdown Menu */}
            {showModelDropdown && (
              <div 
                className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 max-h-60 flex flex-col animate-in fade-in zoom-in-95 duration-100 rounded-b-xl"
                style={{ top: '100%' }}
              >
                <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2 py-1.5">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="text"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="搜索模型..."
                      className="flex-1 text-[14px] outline-none bg-transparent"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                   {filteredModels.length > 0 ? (
                    filteredModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setModelName(model.id);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-gray-50 flex items-center justify-between ${
                          modelName === model.id ? 'bg-blue-50 text-[#007aff]' : 'text-gray-700'
                        }`}
                      >
                        {model.id}
                        {modelName === model.id && <Check className="w-4 h-4" />}
                      </button>
                    ))
                   ) : (
                     <div className="px-4 py-3 text-center text-gray-400 text-sm">
                       {modelList.length === 0 ? '暂无模型，请先测试连接' : '未找到匹配模型'}
                     </div>
                   )}
                   {/* Custom Input Option */}
                   {modelSearch && !filteredModels.find(m => m.id === modelSearch) && (
                      <button
                        onClick={() => {
                          setModelName(modelSearch);
                          setShowModelDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-[14px] text-[#007aff] hover:bg-blue-50 border-t border-gray-100"
                      >
                        使用 "{modelSearch}"
                      </button>
                   )}
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 ml-3">
            请从服务提供商处获取 API Key 和 Base URL。
          </p>
        </div>

        {/* System Prompt Section */}
        <div className="space-y-2 relative z-0">
          <h2 className="text-xs font-medium text-gray-500 uppercase ml-3">AI 人设 (System Prompt)</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="例如：你是一个幽默的程序员助手，喜欢用 emoji 回复..."
              className="w-full h-32 text-[15px] text-gray-900 placeholder-gray-400 outline-none bg-transparent resize-none"
            />
          </div>
          <p className="text-xs text-gray-500 ml-3">
            这个人设将作为背景指令发送给 AI，告诉它如何表现。
          </p>
        </div>

      </main>

      {/* Success Toast */}
      {showSuccess && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in fade-in zoom-in duration-200">
          <div className="bg-black/75 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center gap-2">
            <Check className="w-8 h-8 text-white" />
            <span className="text-sm font-medium">配置已更新</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
