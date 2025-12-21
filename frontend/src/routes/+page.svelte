<script lang="ts">
  import { onMount, tick } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import ChatHeader from "$lib/components/ChatHeader.svelte";
  import MessageBubble from "$lib/components/MessageBubble.svelte";
  import TypingIndicator from "$lib/components/TypingIndicator.svelte";
  import ChatInput from "$lib/components/ChatInput.svelte";
  import WelcomeScreen from "$lib/components/WelcomeScreen.svelte";
  import { chatStore } from "$lib/stores/chatStore.svelte";

  let messagesContainer = $state<HTMLDivElement>();
  let mounted = $state(false);

  onMount(() => {
    chatStore.init();
    setTimeout(() => (mounted = true), 50);
    return () => chatStore.destroy();
  });

  // Auto-scroll with smooth behavior
  $effect(() => {
    chatStore.messages.length;
    chatStore.isLoading;

    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: "smooth",
        });
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

<div class="relative w-screen h-screen overflow-hidden" style="height: 100dvh;">
  <!-- Gradient Mesh Background -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100/50 to-white"
  ></div>

  <!-- Rectangle.png pattern overlay -->
  <div class="absolute inset-0 pointer-events-none opacity-80">
    <img src="/Rectangle.png" alt="" class="w-full h-full object-center" />
  </div>

  <!-- Main Content with fade-in animation -->
  {#if mounted}
    <div class="relative z-10 flex flex-col h-full" in:fade={{ duration: 400 }}>
      <ChatHeader onNewChat={() => chatStore.startNewConversation()} />

      <div class="flex-1 overflow-hidden min-h-0">
        <div
          class="h-full overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-300/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-400/60"
          bind:this={messagesContainer}
        >
          {#if chatStore.messages.length === 0}
            <WelcomeScreen onSuggestionClick={setSuggestion} />
          {:else}
            <div class="flex flex-col gap-4 sm:gap-6 max-w-6xl mx-auto">
              {#each chatStore.messages as message, i (message.id)}
                {#if message.sender === "user"}
                  <!-- User messages appear instantly -->
                  <div>
                    <MessageBubble
                      sender={message.sender}
                      text={message.text}
                      status={message.status}
                      onRetry={() => chatStore.retryMessage(message.id)}
                    />
                  </div>
                {:else}
                  <!-- AI messages have smooth animation -->
                  <div in:fly={{ y: 10, duration: 400, easing: cubicOut }}>
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
                <div in:fly={{ y: 10, duration: 400, easing: cubicOut }}>
                  <TypingIndicator />
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      {#if chatStore.error}
        <div
          class="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-auto max-w-md"
          in:fly={{ y: -20, duration: 300 }}
        >
          <div
            class="glass flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              class="text-red-500 flex-shrink-0 sm:w-5 sm:h-5"
            >
              <path
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                fill="currentColor"
              />
            </svg>
            <span
              class="text-xs sm:text-sm font-medium text-red-600 line-clamp-2"
              >{chatStore.error}</span
            >
          </div>
        </div>
      {/if}

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
  /* Custom scrollbar */
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }

  .scrollbar-track-transparent::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thumb-slate-300\/50::-webkit-scrollbar-thumb {
    background: rgba(203, 213, 225, 0.5);
    border-radius: 3px;
  }

  .scrollbar-thumb-slate-300\/50::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.6);
  }
</style>
