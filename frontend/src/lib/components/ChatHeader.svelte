<script lang="ts">
  export let onNewChat: () => void;
</script>

<div class="spur-header">
  <div class="header-inner">
    <div class="header-left">
      <div class="logo-wrap">
        <img
          src="https://cdn.spurnow.com/360/7799_spurlogobluebg.svg"
          alt="Spur"
          class="logo-img"
        />
      </div>
      <div class="header-title-group">
        <h1 class="header-title">Spur Support</h1>
        <div class="online-badge">
          <span class="online-dot"></span>
          <span class="online-text">Online · AI-powered</span>
        </div>
      </div>
    </div>
    <div class="header-actions">
      <button onclick={onNewChat} class="new-chat-btn" title="New Chat">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
        <span class="new-chat-label">New Chat</span>
      </button>
    </div>
  </div>
</div>

<style>
  .spur-header {
    background: linear-gradient(135deg, #2563eb 0%, #3b7ef8 60%, #4f8fff 100%);
    position: sticky;
    top: 0;
    z-index: 40;
    box-shadow: 0 2px 16px rgba(37, 99, 235, 0.25);
  }

  .header-inner {
    max-width: 800px;
    margin: 0 auto;
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-wrap {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .logo-img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
  }

  .header-title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .header-title {
    font-size: 1.0625rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .online-badge {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .online-dot {
    width: 7px;
    height: 7px;
    background: #4ade80;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3); }
    50% { box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.15); }
  }

  .online-text {
    font-size: 0.6875rem;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .new-chat-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: rgba(255, 255, 255, 0.18);
    border: 1.5px solid rgba(255, 255, 255, 0.35);
    color: #ffffff;
    border-radius: 20px;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
    white-space: nowrap;
  }

  .new-chat-btn:hover {
    background: rgba(255, 255, 255, 0.28);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.03);
  }

  .new-chat-btn:active {
    transform: scale(0.97);
  }

  .new-chat-label {
    display: none;
  }

  @media (min-width: 480px) {
    .new-chat-label {
      display: inline;
    }
  }
</style>
