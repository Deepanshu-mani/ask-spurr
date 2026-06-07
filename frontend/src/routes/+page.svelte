<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import ChatHeader from '$lib/components/ChatHeader.svelte';
  import MessageBubble from '$lib/components/MessageBubble.svelte';
  import TypingIndicator from '$lib/components/TypingIndicator.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import WelcomeScreen from '$lib/components/WelcomeScreen.svelte';
  import { chatStore } from '$lib/stores/chatStore.svelte';

  let messagesContainer = $state<HTMLDivElement>();
  let mounted = $state(false);

  onMount(() => {
    chatStore.init();
    setTimeout(() => (mounted = true), 50);
    return () => chatStore.destroy();
  });

  // Auto-scroll to bottom on new messages / loading state changes
  $effect(() => {
    chatStore.messages.length;
    chatStore.isLoading;

    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: 'smooth',
        });
      }, 80);
    }
  });

  function setSuggestion(text: string) {
    chatStore.inputMessage = text;
    setTimeout(() => {
      const input = document.querySelector('.message-input') as HTMLInputElement;
      input?.focus();
    }, 0);
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      chatStore.sendMessage();
    }
  }
</script>

<!-- Page background -->
<div class="page-bg">
  <!-- Widget container -->
  {#if mounted}
    <div class="widget-shell" in:fade={{ duration: 350 }}>
      <!-- Header -->
      <ChatHeader onNewChat={() => chatStore.startNewConversation()} serviceStatus={chatStore.serviceStatus} />

      <!-- Error toast -->
      {#if chatStore.error}
        <div
          class="error-toast"
          in:fly={{ y: -16, duration: 250 }}
          out:fly={{ y: -16, duration: 200 }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"
              fill="#ef4444"
            />
          </svg>
          <span>{chatStore.error}</span>
        </div>
      {/if}

      <!-- Messages area -->
      <div class="messages-area" bind:this={messagesContainer}>
        <div class="chat-container">
          {#if chatStore.messages.length === 0}
            <WelcomeScreen onSuggestionClick={setSuggestion} />
          {:else}
            <div class="messages-list">
              {#each chatStore.messages as message (message.id)}
                {#if message.sender === 'user'}
                  <div>
                    <MessageBubble
                      sender={message.sender}
                      text={message.text}
                      status={message.status}
                      onRetry={() => chatStore.retryMessage(message.id)}
                    />
                  </div>
                {:else}
                  <div in:fly={{ y: 8, duration: 320, easing: cubicOut }}>
                    <MessageBubble
                      sender={message.sender}
                      text={message.text}
                      status={message.status}
                      onRetry={() => chatStore.retryMessage(message.id)}
                    />
                  </div>
                {/if}
              {/each}

              {#if chatStore.isLoading}
                <div in:fly={{ y: 8, duration: 280, easing: cubicOut }}>
                  <TypingIndicator />
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      <!-- Offline banner + Input -->
      {#if chatStore.serviceStatus === 'offline'}
        <div class="offline-banner">
          🔴 Offline. Messages will be sent when reconnected.
        </div>
      {/if}

      <!-- Input -->
      <ChatInput
        bind:value={chatStore.inputMessage}
        onSend={() => chatStore.sendMessage()}
        onKeyPress={handleKeyPress}
        disabled={chatStore.isLoading}
      />
    </div>
  {/if}
</div>

<style>
  /* Page background */
  .page-bg {
    min-height: 100dvh;
    background:
      radial-gradient(circle at top left, rgba(37, 99, 235, 0.22), transparent 30%),
      radial-gradient(circle at top right, rgba(14, 165, 233, 0.16), transparent 24%),
      linear-gradient(180deg, #eef4ff 0%, #f7f9fc 26%, #eef2f7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  /* Full screen app shell */
  .widget-shell {
    position: relative;
    width: 100%;
    max-width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.36), rgba(255, 255, 255, 0.18)),
      radial-gradient(circle at top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2));
    border-radius: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: none;
  }

  /* Scrollable messages */
  .messages-area {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background: transparent;
    scroll-behavior: smooth;

    /* Thin scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.4) transparent;
  }

  .chat-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .messages-area::-webkit-scrollbar {
    width: 4px;
  }

  .messages-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .messages-area::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.4);
    border-radius: 2px;
  }

  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 0 140px; /* Large bottom padding so messages scroll past the floating input */
    min-height: 100%;
  }

  .offline-banner {
    position: absolute;
    bottom: 80px; /* Position above the chat input */
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
    padding: 10px 20px;
    font-size: 0.85rem;
    text-align: center;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    white-space: nowrap;
  }

  /* Error toast */
  .error-toast {
    position: absolute;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    background: #fff;
    border: 1px solid #fee2e2;
    border-radius: 10px;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8125rem;
    color: #ef4444;
    font-weight: 500;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
