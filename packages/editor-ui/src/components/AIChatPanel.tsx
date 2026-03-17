import { useMemo, useState } from 'react';
import { Check, Sparkles, Trash2, X } from 'lucide-react';
import { useEditorStore } from '@/store';

const SUGGESTED_PROMPTS = [
  'Add a login form with email and password',
  'Add a card with title "Project Status"',
  'Change the button variant to outline',
  'Remove all badges',
];

export function AIChatPanel() {
  const [prompt, setPrompt] = useState('');
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const messages = useEditorStore((s) => s.chatMessages);
  const isAiWorking = useEditorStore((s) => s.isAiWorking);
  const pendingAiProposal = useEditorStore((s) => s.pendingAiProposal);
  const sendAiPrompt = useEditorStore((s) => s.sendAiPrompt);
  const acceptAiProposal = useEditorStore((s) => s.acceptAiProposal);
  const rejectAiProposal = useEditorStore((s) => s.rejectAiProposal);
  const clearChat = useEditorStore((s) => s.clearChat);
  const hasPendingProposal = Boolean(pendingAiProposal);

  const selectionLabel = useMemo(() => {
    if (selectedIds.length === 0) return 'Scope: whole canvas';
    if (selectedIds.length === 1) {
      return `Scope: ${selectedIds[0].slice(0, 8)}...`;
    }
    return `Scope: ${selectedIds.length} selected elements`;
  }, [selectedIds]);

  const handleSubmit = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isAiWorking || hasPendingProposal) return;
    setPrompt('');
    await sendAiPrompt(trimmedPrompt);
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <div>
          <div className="chat-panel-title">
            <Sparkles className="chat-panel-title-icon" />
            Vibe Chat
          </div>
          <div className="chat-panel-subtitle">{selectionLabel}</div>
        </div>
        <button
          className="chat-clear-btn"
          type="button"
          onClick={() => clearChat()}
          disabled={isAiWorking || hasPendingProposal}
          title="Clear chat"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="chat-suggestions">
        {SUGGESTED_PROMPTS.map((suggestion) => (
          <button
            key={suggestion}
            className="chat-suggestion-chip"
            type="button"
            onClick={() => setPrompt(suggestion)}
            disabled={isAiWorking || hasPendingProposal}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="chat-thread">
        {hasPendingProposal && pendingAiProposal && (
          <div className="chat-preview-banner">
            <div className="chat-preview-title">Preview Ready</div>
            <div className="chat-preview-copy">
              {pendingAiProposal.description}
              {' '}
              Review the canvas, then accept or reject this draft. Press `Esc` to reject.
            </div>
            <div className="chat-ops">
              {pendingAiProposal.operations.map((operation, index) => (
                <div key={`proposal-${index}`} className="chat-op-pill">
                  {formatOperation(operation)}
                </div>
              ))}
            </div>
            <div className="chat-preview-actions">
              <button
                className="preview-btn"
                type="button"
                onClick={() => acceptAiProposal()}
              >
                <Check size={14} />
                Accept Preview
              </button>
              <button
                className="preview-btn preview-btn-secondary"
                type="button"
                onClick={() => rejectAiProposal()}
              >
                <X size={14} />
                Reject
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className="chat-message"
            data-role={message.role}
            data-status={message.status ?? 'idle'}
          >
            <div className="chat-message-role">{message.role}</div>
            <div className="chat-message-content">{message.content}</div>
            {message.operations && message.operations.length > 0 && (
              <div className="chat-ops">
                {message.operations.map((operation, index) => (
                  <div key={`${message.id}-${index}`} className="chat-op-pill">
                    {formatOperation(operation)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="chat-composer">
        <textarea
          className="chat-input"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              void handleSubmit();
            }
          }}
          disabled={hasPendingProposal}
          placeholder='Describe a screen or an edit. Example: "add a login form with email and password".'
          rows={4}
        />
        <button
          className="chat-send-btn"
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!prompt.trim() || isAiWorking || hasPendingProposal}
        >
          {isAiWorking ? 'Generating...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

function formatOperation(operation: {
  type: 'add' | 'remove' | 'move' | 'updateProps';
  elementType?: string;
  elementId?: string;
}) {
  switch (operation.type) {
    case 'add':
      return `Add ${operation.elementType ?? 'element'}`;
    case 'remove':
      return `Remove ${operation.elementId?.slice(0, 8) ?? 'element'}`;
    case 'move':
      return `Move ${operation.elementId?.slice(0, 8) ?? 'element'}`;
    case 'updateProps':
      return `Update ${operation.elementId?.slice(0, 8) ?? 'element'}`;
    default:
      return operation.type;
  }
}
