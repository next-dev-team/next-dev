/**
 * ChatPanel — Real-time AI chat panel for DesignForge
 *
 * Features:
 * - Message thread with user/assistant/system bubbles
 * - Live streaming text with typing indicator
 * - Real-time visual preview via @next-dev/json-render
 * - JSON operations inspector with syntax highlighting
 * - Accept / Reject buttons for AI-generated changes
 * - Provider settings (Mock, OpenAI/Local LLM, MCP)
 * - Mode selector (Ask, Edit, Generate)
 * - Suggested prompts for quick start
 */

import { useEffect, useRef, useState } from 'react';
import { useChatStore, type ChatMessage, type ChatMode } from '@/chat-store';
import type { AIOperation, ProviderType } from '@/ai-providers';
import { renderOperations } from '@next-dev/json-render';
import {
  Send,
  Square,
  Trash2,
  Settings,
  Check,
  X,
  Bot,
  User,
  Info,
  Sparkles,
  MessageSquare,
  Pencil,
  Wand2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Zap,
  Server,
  Globe,
  Eye,
  Code,
} from 'lucide-react';

// ─── Suggested Prompts ──────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  'Create a login form',
  'Add a Card with title "Settings"',
  'Add a Button with text "Submit"',
  'Add a Text heading "Welcome"',
  'Add a Badge "New"',
  'Create a profile card',
];

// ─── Mode Config ────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<ChatMode, { icon: typeof Sparkles; label: string; placeholder: string; color: string }> = {
  ask: { icon: MessageSquare, label: 'Ask', placeholder: 'Ask about your design...', color: 'var(--color-chat-ask)' },
  edit: { icon: Pencil, label: 'Edit', placeholder: 'Describe what to change...', color: 'var(--color-chat-edit)' },
  generate: { icon: Wand2, label: 'Generate', placeholder: 'Describe what to create...', color: 'var(--color-chat-generate)' },
};

// ─── Provider Icons ─────────────────────────────────────────────────────────

const PROVIDER_ICONS: Record<ProviderType, typeof Zap> = {
  mock: Zap,
  openai: Globe,
  mcp: Server,
};

const PROVIDER_LABELS: Record<ProviderType, string> = {
  mock: 'Mock (Offline)',
  openai: 'OpenAI / Local LLM',
  mcp: 'MCP Server',
};

// ─── Visual Preview (via json-render) ───────────────────────────────────────

function VisualPreview({ operations }: { operations: AIOperation[] }) {
  if (operations.length === 0) return null;

  return (
    <div className="op-preview">
      <div className="op-preview-header">
        <Eye size={10} />
        <span>Live Preview</span>
      </div>
      <div className="op-preview-canvas">
        {renderOperations(operations, { scale: 0.55, interactive: false })}
      </div>
    </div>
  );
}

// ─── JSON Renderer ──────────────────────────────────────────────────────────

function JsonRenderer({ data }: { data: unknown }) {
  const [collapsed, setCollapsed] = useState(true);
  const json = JSON.stringify(data, null, 2);

  return (
    <div className="json-renderer">
      <button
        type="button"
        className="json-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        <span className="json-badge">JSON</span>
        <span className="json-count">{Array.isArray(data) ? `${(data as unknown[]).length} ops` : 'object'}</span>
      </button>
      {!collapsed && (
        <pre className="json-content">
          {json}
        </pre>
      )}
    </div>
  );
}

// ─── Operation Preview Card ─────────────────────────────────────────────────

function OperationCard({ message }: { message: ChatMessage }) {
  const acceptOps = useChatStore((s) => s.acceptOperations);
  const rejectOps = useChatStore((s) => s.rejectOperations);
  const [viewMode, setViewMode] = useState<'preview' | 'json'>('preview');

  if (!message.operations || message.operations.length === 0) return null;

  return (
    <div className="op-card" data-applied={message.applied}>
      <div className="op-card-header">
        <Sparkles size={14} className="op-card-icon" />
        <span className="op-card-title">
          {message.operations.length} operation{message.operations.length > 1 ? 's' : ''}
        </span>
        {message.applied && <span className="op-card-applied">✓ Applied</span>}
        {!message.applied && (
          <div className="op-card-view-toggle">
            <button
              type="button"
              className="op-view-btn"
              data-active={viewMode === 'preview'}
              onClick={() => setViewMode('preview')}
              title="Visual preview"
            >
              <Eye size={11} />
            </button>
            <button
              type="button"
              className="op-view-btn"
              data-active={viewMode === 'json'}
              onClick={() => setViewMode('json')}
              title="JSON inspector"
            >
              <Code size={11} />
            </button>
          </div>
        )}
      </div>

      {viewMode === 'preview' ? (
        <VisualPreview operations={message.operations} />
      ) : (
        <JsonRenderer data={message.operations} />
      )}

      {!message.applied && (
        <div className="op-card-actions">
          <button
            type="button"
            className="op-accept"
            onClick={() => acceptOps(message.id)}
          >
            <Check size={14} /> Accept
          </button>
          <button
            type="button"
            className="op-reject"
            onClick={() => rejectOps(message.id)}
          >
            <X size={14} /> Reject
          </button>
        </div>
      )}

      {message.applied && (
        <JsonRenderer data={message.operations} />
      )}
    </div>
  );
}

// ─── Message Bubble ─────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isAssistant = message.role === 'assistant';

  const Icon = isUser ? User : isSystem ? Info : Bot;

  return (
    <div className="chat-message" data-role={message.role}>
      <div className="chat-message-avatar">
        <Icon size={14} />
      </div>
      <div className="chat-message-body">
        <div className="chat-message-content">
          {message.content}
          {message.streaming && <span className="typing-cursor" />}
        </div>
        {isAssistant && message.operations && <OperationCard message={message} />}
      </div>
    </div>
  );
}

// ─── Settings Panel ─────────────────────────────────────────────────────────

function SettingsPanel() {
  const config = useChatStore((s) => s.providerConfig);
  const updateConfig = useChatStore((s) => s.updateProviderConfig);
  const setShowSettings = useChatStore((s) => s.setShowSettings);

  return (
    <div className="chat-settings animate-slide-down">
      <div className="chat-settings-header">
        <Settings size={14} />
        <span>AI Provider Settings</span>
        <button type="button" className="chat-settings-close" onClick={() => setShowSettings(false)}>
          <X size={14} />
        </button>
      </div>

      <div className="chat-settings-field">
        <label className="chat-settings-label" htmlFor="provider-select">Provider</label>
        <div className="chat-settings-providers" id="provider-select">
          {(['mock', 'openai', 'mcp'] as ProviderType[]).map((type) => {
            const ProvIcon = PROVIDER_ICONS[type];
            return (
              <button
                key={type}
                type="button"
                className="provider-btn"
                data-active={config.type === type}
                onClick={() => updateConfig({ type })}
              >
                <ProvIcon size={14} />
                {PROVIDER_LABELS[type]}
              </button>
            );
          })}
        </div>
      </div>

      {config.type === 'openai' && (
        <>
          <div className="chat-settings-field">
            <label className="chat-settings-label" htmlFor="ai-base-url">Base URL</label>
            <input
              id="ai-base-url"
              className="chat-settings-input"
              value={config.baseUrl ?? 'http://localhost:11434/v1'}
              placeholder="http://localhost:11434/v1"
              onChange={(e) => updateConfig({ baseUrl: e.target.value })}
            />
          </div>
          <div className="chat-settings-field">
            <label className="chat-settings-label" htmlFor="ai-model">Model</label>
            <input
              id="ai-model"
              className="chat-settings-input"
              value={config.model ?? ''}
              placeholder="llama3, gpt-4o, etc."
              onChange={(e) => updateConfig({ model: e.target.value })}
            />
          </div>
          <div className="chat-settings-field">
            <label className="chat-settings-label" htmlFor="ai-key">API Key (optional)</label>
            <input
              id="ai-key"
              className="chat-settings-input"
              type="password"
              value={config.apiKey ?? ''}
              placeholder="sk-..."
              onChange={(e) => updateConfig({ apiKey: e.target.value })}
            />
          </div>
        </>
      )}

      <div className="chat-settings-hint">
        {config.type === 'mock' && '🧪 Mock mode — uses heuristic parsing, no API needed.'}
        {config.type === 'openai' && '🌐 Works with OpenAI, Ollama, LM Studio, or any OpenAI-compatible API.'}
        {config.type === 'mcp' && '🔌 Routes through the DesignForge MCP server via Electron IPC.'}
      </div>
    </div>
  );
}

// ─── Chat Panel ─────────────────────────────────────────────────────────────

export function ChatPanel() {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const mode = useChatStore((s) => s.mode);
  const showSettings = useChatStore((s) => s.showSettings);
  const inputValue = useChatStore((s) => s.inputValue);
  const providerConfig = useChatStore((s) => s.providerConfig);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const cancelStream = useChatStore((s) => s.cancelStream);
  const clearChat = useChatStore((s) => s.clearChat);
  const setMode = useChatStore((s) => s.setMode);
  const setShowSettings = useChatStore((s) => s.setShowSettings);
  const setInputValue = useChatStore((s) => s.setInputValue);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on any message change
  useEffect(() => {
    const unsub = useChatStore.subscribe(
      (s) => s.messages,
      () => {
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        });
      },
    );
    return unsub;
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!inputValue.trim() || isStreaming) return;
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const modeConfig = MODE_CONFIG[mode];
  const ModeIcon = modeConfig.icon;
  const ProvIcon = PROVIDER_ICONS[providerConfig.type];

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <Bot size={16} className="chat-header-icon" />
          <span className="chat-header-title">AI Chat</span>
          <span className="chat-provider-badge">
            <ProvIcon size={10} />
            {providerConfig.type}
          </span>
        </div>
        <div className="chat-header-actions">
          <button
            type="button"
            className="chat-action-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
            data-active={showSettings}
          >
            <Settings size={14} />
          </button>
          <button
            type="button"
            className="chat-action-btn"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Settings */}
      {showSettings && <SettingsPanel />}

      {/* Mode Selector */}
      <div className="chat-modes">
        {(['ask', 'edit', 'generate'] as ChatMode[]).map((m) => {
          const cfg = MODE_CONFIG[m];
          const Icon = cfg.icon;
          return (
            <button
              key={m}
              type="button"
              className="chat-mode-btn"
              data-active={mode === m}
              onClick={() => setMode(m)}
            >
              <Icon size={12} /> {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isStreaming && (
          <div className="chat-typing">
            <Loader2 size={14} className="chat-typing-spin" />
            <span>Thinking...</span>
          </div>
        )}

        {/* Suggested prompts when empty */}
        {messages.length <= 1 && !isStreaming && (
          <div className="chat-suggestions">
            <div className="chat-suggestions-title">Try a prompt:</div>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chat-suggestion-btn"
                onClick={() => sendMessage(prompt)}
              >
                <Sparkles size={12} />
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <ModeIcon size={14} className="chat-input-mode-icon" style={{ color: modeConfig.color }} />
          <textarea
            ref={inputRef}
            className="chat-input"
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={modeConfig.placeholder}
            disabled={isStreaming}
          />
          {isStreaming ? (
            <button type="button" className="chat-send-btn chat-cancel-btn" onClick={cancelStream}>
              <Square size={14} />
            </button>
          ) : (
            <button
              type="button"
              className="chat-send-btn"
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
            >
              <Send size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
