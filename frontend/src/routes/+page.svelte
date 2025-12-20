<script lang="ts">
  import { onMount, tick } from "svelte";
  import ChatHeader from "$lib/components/ChatHeader.svelte";
  import MessageBubble from "$lib/components/MessageBubble.svelte";
  import TypingIndicator from "$lib/components/TypingIndicator.svelte";
  import ChatInput from "$lib/components/ChatInput.svelte";
  import WelcomeScreen from "$lib/components/WelcomeScreen.svelte";
  import { chatStore } from "$lib/stores/chatStore.svelte";

  let messagesContainer: HTMLDivElement;

  onMount(() => {
    chatStore.init();
    return () => chatStore.destroy();
  });

  // Auto-scroll
  $effect(() => {
    chatStore.messages.length;
    chatStore.isLoading;

    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 100);
    }
  });

  function setSuggestion(text: string) {
    chatStore.inputMessage = text;
    setTimeout(() => {
      const input = document.querySelector(
        ".message-input"
      ) as HTMLInputElement;
      input?.focus();
    }, 0);
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      chatStore.sendMessage();
    }
  }
</script>

<div class="chat-container">
  <ChatHeader
    sessionId={chatStore.sessionId}
    onNewChat={() => chatStore.startNewConversation()}
  />

  <div class="messages-wrapper">
    <div class="messages-container" bind:this={messagesContainer}>
      {#if chatStore.messages.length === 0}
        <WelcomeScreen onSuggestionClick={setSuggestion} />
      {:else}
        <div class="messages-list">
          {#each chatStore.messages as message (message.id)}
            <MessageBubble
              sender={message.sender}
              text={message.text}
              status={message.status}
              onRetry={() => chatStore.retryMessage(message.id)}
            />
          {/each}

          {#if chatStore.isLoading}
            <TypingIndicator />
          {/if}
        </div>
      {/if}
    </div>
  </div>

  {#if chatStore.error}
    <div class="error-banner">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
          fill="currentColor"
        />
      </svg>
      <span>{chatStore.error}</span>
    </div>
  {/if}

  <ChatInput
    bind:value={chatStore.inputMessage}
    onSend={() => chatStore.sendMessage()}
    onKeyPress={handleKeyPress}
    disabled={chatStore.isLoading}
  />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }

  .chat-container {
    width: 100vw;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .messages-wrapper {
    flex: 1;
    overflow: hidden;
    background: #f8f9fa;
    min-height: 0;
  }

  .messages-container {
    height: 90%;
    overflow-y: auto;
    padding: 2rem;
    scroll-behavior: smooth;
  }

  .messages-container::-webkit-scrollbar {
    width: 8px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
  }

  .messages-container::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }

  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .error-banner {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #fff5f5;
    color: #c53030;
    padding: 0.75rem 1.5rem;
    border: 1px solid #feb2b2;
    border-radius: 99px;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(197, 48, 48, 0.15);
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
</style>
