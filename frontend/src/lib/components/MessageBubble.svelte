<script lang="ts">
  import { marked } from 'marked';
  import type { Message } from '$lib/types';
  import { demoOrders } from '$lib/demo/agentSnapshot';

  export let sender: Message['sender'];
  export let text: string;
  export let status: Message['status'] = 'sent';
  export let onRetry: () => void = () => {};

  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  function formatTime(date?: string) {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  // Parse text into segments: text or order_card
  $: segments = text.split(/(\[ORDER_CARD:[^\]]+\])/g).map((part) => {
    const match = part.match(/\[ORDER_CARD:([^\]]+)\]/);
    if (match) {
      const orderId = match[1];
      const order = demoOrders.find((o) => o.id === orderId);
      return { type: 'order', id: orderId, order };
    }
    return { type: 'text', content: part };
  });

  function statusTone(status: string) {
    if (status === 'Delivered') return 'delivered';
    if (status === 'Out for Delivery') return 'out';
    return 'moving';
  }
</script>

<div
  class="msg-row {sender === 'user' ? 'msg-user' : 'msg-ai'} {status === 'sending'
    ? 'msg-sending'
    : ''}"
>
  {#if sender === 'ai'}
    <div class="ai-avatar">
      <img
        src="https://cdn.spurnow.com/360/7799_spurlogobluebg.svg"
        alt="Spur"
        class="avatar-img"
      />
    </div>
    <div class="ai-bubble-wrap">
      <div class="ai-bubble">
        {#each segments as segment}
          {#if segment.type === 'text' && segment.content.trim()}
            <div class="markdown-content">
              {@html marked.parse(segment.content)}
            </div>
          {:else if segment.type === 'order' && segment.order}
            <div class="rich-order-card">
              <div class="order-top">
                <div class="order-meta">
                  <span class="order-id">Order Number: {segment.order.id}</span>
                  <span class="order-date">Order Date: {segment.order.orderDate}</span>
                </div>
              </div>
              <div class="order-body">
                <img src={segment.order.thumbnail} alt="Product" class="order-thumb" />
                <div class="order-details">
                  <div class="status-wrap">
                    <span class="status-text">{segment.order.status}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                      ><path
                        d="M6 12L10 8L6 4"
                        stroke="#9ca3af"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      /></svg
                    >
                  </div>
                  <p class="order-summary">{segment.order.summary}</p>
                </div>
              </div>
            </div>
          {/if}
        {/each}
      </div>
      <span class="msg-time">{formatTime()}</span>
    </div>
  {:else}
    <div class="user-bubble-wrap">
      {#if status === 'error'}
        <button onclick={onRetry} class="retry-btn" title="Retry">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21.5 2v6h-6"></path>
            <path d="M2.5 22v-6h6"></path>
            <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8"></path>
            <path d="M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16"></path>
          </svg>
        </button>
      {/if}
      <div class="user-bubble {status === 'error' ? 'bubble-error' : ''}">
        {text}
      </div>
      <span class="msg-time user-time">
        {#if status === 'error'}
          <span class="error-label">Failed ·</span>
        {/if}
        {formatTime()}
      </span>
    </div>
  {/if}
</div>

<style>
  .msg-row {
    display: flex;
    margin-bottom: 8px;
    width: 100%;
    animation: fadeIn 0.3s ease;
  }

  /* User rows - keep aligned to the right */
  .msg-user {
    justify-content: flex-end;
  }

  /* AI rows - left aligned, full width layout */
  .msg-ai {
    justify-content: flex-start;
    gap: 16px;
    padding: 12px 0;
  }

  .msg-sending {
    opacity: 0.8;
  }

  /* AI avatar */
  .ai-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
    margin-top: 2px;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ai-bubble-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ai-bubble {
    background: #ffffff;
    border: 1px solid #e8edf5;
    border-radius: 14px;
    padding: 14px 18px;
    box-shadow: 0 2px 12px rgba(15, 23, 42, 0.05);
    width: 100%;
  }

  /* User bubble */
  .user-bubble-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    max-width: min(72%, 460px);
    position: relative;
  }

  .retry-btn {
    position: absolute;
    left: -28px;
    top: 50%;
    transform: translateY(-60%);
    background: #fff;
    border: 1px solid #e2e8f0;
    color: #94a3b8;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }

  .retry-btn:hover {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
  }

  .user-bubble {
    background: linear-gradient(135deg, #2563eb 0%, #3b7ef8 100%);
    color: #ffffff;
    border-radius: 18px 18px 4px 18px;
    padding: 12px 16px;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.5;
    box-shadow: 0 2px 12px rgba(37, 99, 235, 0.3);
    word-break: break-word;
  }

  .bubble-error {
    opacity: 0.7;
    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    box-shadow: 0 2px 12px rgba(239, 68, 68, 0.25);
  }

  /* Timestamps */
  .msg-time {
    font-size: 0.6875rem;
    color: #94a3b8;
    font-weight: 400;
    padding: 0 4px;
    white-space: nowrap;
  }

  .user-time {
    text-align: right;
  }

  .error-label {
    color: #f87171;
    font-weight: 500;
  }

  /* Markdown Styles */
  :global(.markdown-content) {
    font-size: 0.9375rem;
    color: #1e293b;
    line-height: 1.7;
  }

  :global(.markdown-content p) {
    margin: 0 0 0.5rem 0;
    line-height: 1.65;
  }

  :global(.markdown-content p:last-child) {
    margin-bottom: 0;
  }

  :global(.markdown-content ul),
  :global(.markdown-content ol) {
    margin: 0.6rem 0;
    padding-left: 1.3rem;
  }

  :global(.markdown-content li) {
    margin-bottom: 0.25rem;
    line-height: 1.55;
  }

  :global(.markdown-content h1),
  :global(.markdown-content h2),
  :global(.markdown-content h3),
  :global(.markdown-content h4) {
    margin: 0.65rem 0 0.35rem;
    color: #0f172a;
    line-height: 1.25;
    font-weight: 700;
  }

  :global(.markdown-content h1) {
    font-size: 1.15rem;
  }

  :global(.markdown-content h2) {
    font-size: 1.07rem;
  }

  :global(.markdown-content h3) {
    font-size: 0.99rem;
  }

  :global(.markdown-content blockquote) {
    margin: 0.75rem 0;
    padding: 0.75rem 0.9rem;
    border-left: 3px solid #2563eb;
    background: rgba(37, 99, 235, 0.05);
    border-radius: 0 14px 14px 0;
    color: #334155;
  }

  :global(.markdown-content hr) {
    margin: 0.9rem 0;
    border: 0;
    border-top: 1px solid rgba(148, 163, 184, 0.3);
  }

  :global(.markdown-content pre) {
    margin: 0.8rem 0;
    padding: 0.9rem 1rem;
    border-radius: 14px;
    background: #0f172a;
    color: #e2e8f0;
    overflow-x: auto;
    font-size: 0.8rem;
    line-height: 1.55;
  }

  :global(.markdown-content pre code) {
    background: transparent;
    color: inherit;
    padding: 0;
    font-size: inherit;
    font-family: 'SF Mono', Monaco, monospace;
  }

  :global(.markdown-content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0.75rem 0;
    font-size: 0.875rem;
    overflow: hidden;
    border-radius: 14px;
  }

  :global(.markdown-content th),
  :global(.markdown-content td) {
    border: 1px solid rgba(148, 163, 184, 0.22);
    padding: 0.55rem 0.7rem;
    text-align: left;
  }

  :global(.markdown-content th) {
    background: rgba(37, 99, 235, 0.06);
    font-weight: 700;
    color: #0f172a;
  }

  :global(.markdown-content strong) {
    font-weight: 600;
    color: #0f172a;
  }

  :global(.markdown-content code) {
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
    padding: 0.1rem 0.35rem;
    border-radius: 0.3rem;
    font-size: 0.875em;
    font-family: 'SF Mono', Monaco, monospace;
  }

  :global(.markdown-content a) {
    color: #2563eb;
    text-decoration: underline;
  }
  /* Rich Order Card */
  .rich-order-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .rich-order-card:hover {
    border-color: #93c5fd;
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.08);
  }

  .order-top {
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }

  .order-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .order-id {
    font-size: 0.9rem;
    color: #4b5563;
  }

  .order-date {
    font-size: 0.9rem;
    color: #4b5563;
  }

  .order-body {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .order-thumb {
    width: 72px;
    height: 96px;
    object-fit: cover;
    border-radius: 4px;
    background: #f3f4f6;
  }

  .order-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .status-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-text {
    font-weight: 700;
    font-size: 1rem;
    color: #111827;
  }

  .order-summary {
    margin: 0;
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.4;
  }
</style>
