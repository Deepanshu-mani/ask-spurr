<script lang="ts">
  export let value: string;
  export let onSend: () => void;
  export let onKeyPress: (event: KeyboardEvent) => void;
  export let disabled: boolean = false;

  let isFocused = false;
</script>

<div class="input-wrap">
  <div class="input-bar {isFocused ? 'focused' : ''}">
    <input
      type="text"
      bind:value
      onkeypress={onKeyPress}
      onfocus={() => (isFocused = true)}
      onblur={() => (isFocused = false)}
      placeholder="Type your message..."
      {disabled}
      class="message-input"
      aria-label="Type a message"
    />
    <button
      onclick={onSend}
      disabled={disabled || !value.trim()}
      class="send-btn"
      aria-label="Send message"
    >
      <!-- Paper plane icon matching Spur's actual UI -->
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 2L11 13"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M22 2L15 22L11 13L2 9L22 2Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
  <div class="powered-by">
    <img
      src="https://cdn.spurnow.com/360/7799_spurlogobluebg.svg"
      alt="Spur"
      class="powered-logo"
    />
    <span>Powered by spurnow.com</span>
  </div>
</div>

<style>
  .input-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(
      180deg,
      rgba(245, 247, 250, 0) 0%,
      rgba(245, 247, 250, 0.7) 25%,
      rgba(245, 247, 250, 0.95) 100%
    );
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: none;
    padding: 32px 16px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
  }

  .input-bar {
    width: 100%;
    max-width: 800px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    border-radius: 24px;
    padding: 8px 8px 8px 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .input-bar.focused {
    border-color: #3b7ef8;
    box-shadow:
      0 0 0 3px rgba(59, 126, 248, 0.15),
      0 4px 24px rgba(0, 0, 0, 0.04);
  }

  .message-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.9375rem;
    color: #1e293b;
    font-family: inherit;
    line-height: 1.4;
    min-width: 0;
  }

  .message-input::placeholder {
    color: #94a3b8;
  }

  .message-input:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .send-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb 0%, #3b7ef8 100%);
    border: none;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
  }

  .send-btn:hover:not(:disabled) {
    transform: scale(1.08);
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
  }

  .send-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .send-btn:disabled {
    background: linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%);
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.7;
  }

  .powered-by {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 8px;
    padding-bottom: max(4px, env(safe-area-inset-bottom, 4px));
    font-size: 0.6875rem;
    color: #94a3b8;
    font-weight: 400;
  }

  .powered-logo {
    width: 16px;
    height: 16px;
    object-fit: contain;
    border-radius: 3px;
  }
</style>
