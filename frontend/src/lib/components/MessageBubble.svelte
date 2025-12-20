<script lang="ts">
  import { marked } from "marked";
  import type { Message } from "$lib/types";

  export let sender: Message["sender"];
  export let text: string;
  export let status: Message["status"] = "sent";
  export let onRetry: () => void = () => {};
</script>

<div class="message-wrapper {sender} {status}">
  {#if sender === "ai"}
    <div class="message-row">
      <div class="message-avatar">
        <img src="/robot.png" alt="AI" class="avatar-icon" />
      </div>
      <div class="message-bubble ai-bubble">
        <div class="message-text markdown-content">
          {@html marked.parse(text)}
        </div>
      </div>
    </div>
  {:else}
    <div class="message-row user-row">
      <div class="bubble-container">
        <div class="message-bubble user-bubble {status}">
          <div class="message-text">{text}</div>
        </div>
        {#if status === "error"}
          <button class="retry-btn" on:click={onRetry} title="Retry sending">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21.5 2v6h-6"></path>
              <path d="M2.5 22v-6h6"></path>
              <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8"></path>
              <path d="M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16"></path>
            </svg>
          </button>
          <div class="error-label">Failed to send</div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .message-wrapper {
    animation: slideUp 0.3s ease-out;
  }

  .message-wrapper.sending {
    opacity: 0.7;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-row {
    display: flex;
    gap: 0.75rem;
    align-items: flex-end;
  }

  .user-row {
    justify-content: flex-end;
  }

  .bubble-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    align-self: flex-start;
  }

  .avatar-icon {
    width: 35px;
    height: 35px;
    object-fit: contain;
  }

  .message-bubble {
    max-width: 100%; /* controlled by wrapper width usually, but here relative to container */
    min-width: 60px;
    border-radius: 18px;
    padding: 1rem 1.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    word-wrap: break-word;
    overflow-wrap: break-word;
    position: relative;
  }

  .ai-bubble {
    background: white;
    border: 1px solid #e2e8f0;
    max-width: 75%;
  }

  .user-bubble {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 18px 18px 4px 18px;
  }

  .user-bubble.error {
    background: #fff5f5;
    border: 1px solid #feb2b2;
    color: #c53030;
  }

  .user-bubble.error .message-text {
    color: #c53030;
  }

  .retry-btn {
    position: absolute;
    left: -40px;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: 1px solid #feb2b2;
    color: #e53e3e;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
  }

  .retry-btn:hover {
    background: #c53030;
    color: white;
    transform: translateY(-50%) scale(1.1);
  }

  .error-label {
    font-size: 0.7rem;
    color: #e53e3e;
    margin-top: 4px;
    font-weight: 500;
  }

  /* Markdown Styles */
  :global(.markdown-content p) {
    margin: 0 0 0.5rem 0;
  }
  :global(.markdown-content p:last-child) {
    margin-bottom: 0;
  }
  :global(.markdown-content ul),
  :global(.markdown-content ol) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  :global(.markdown-content li) {
    margin-bottom: 0.25rem;
  }
  :global(.markdown-content strong) {
    font-weight: 600;
    color: #2d3748;
  }
</style>
