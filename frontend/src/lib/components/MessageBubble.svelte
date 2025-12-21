<script lang="ts">
  import { marked } from "marked";
  import type { Message } from "$lib/types";

  export let sender: Message["sender"];
  export let text: string;
  export let status: Message["status"] = "sent";
  export let onRetry: () => void = () => {};
</script>

<div class="animate-slide-up {status === 'sending' ? 'opacity-65' : ''}">
  {#if sender === "ai"}
    <div class="flex gap-2 sm:gap-3 items-end max-w-[95%] sm:max-w-3xl">
      <div
        class="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 self-start shadow-lg"
      >
        <img
          src="/robot.png"
          alt="AI"
          class="w-6 h-6 sm:w-8 sm:h-8 object-contain"
        />
      </div>
      <div
        class="glass flex-1 px-3.5 sm:px-5 py-3 sm:py-4 rounded-2xl sm:rounded-3xl rounded-bl-md shadow-glass"
      >
        <div
          class="text-sm sm:text-[0.9375rem] text-slate-700 markdown-content leading-relaxed"
        >
          {@html marked.parse(text)}
        </div>
      </div>
    </div>
  {:else}
    <div class="flex justify-end">
      <div class="relative flex flex-col items-end max-w-[85%] sm:max-w-2xl">
        <div
          class="px-3.5 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl sm:rounded-3xl rounded-br-md shadow-lg shadow-brand-500/20 font-medium leading-relaxed {status ===
          'error'
            ? 'opacity-60'
            : ''}"
        >
          <div class="text-sm sm:text-[0.9375rem]">{text}</div>
        </div>
        {#if status === "error"}
          <button
            on:click={onRetry}
            title="Retry sending"
            class="absolute -left-8 sm:-left-10 top-1/2 -translate-y-1/2 bg-white/80 border border-slate-200 text-slate-500 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:bg-brand-500 hover:text-white hover:border-brand-500 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="sm:w-[14px] sm:h-[14px]"
            >
              <path d="M21.5 2v6h-6"></path>
              <path d="M2.5 22v-6h6"></path>
              <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8"></path>
              <path d="M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16"></path>
            </svg>
          </button>
          <div
            class="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-1.5 font-medium"
          >
            Failed to send
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Markdown Styles */
  :global(.markdown-content) {
    font-family: "SNPro", system-ui, sans-serif;
  }

  :global(.markdown-content p) {
    margin: 0 0 0.625rem 0;
    line-height: 1.7;
  }

  :global(.markdown-content p:last-child) {
    margin-bottom: 0;
  }

  :global(.markdown-content ul),
  :global(.markdown-content ol) {
    margin: 0.625rem 0;
    padding-left: 1.5rem;
  }

  :global(.markdown-content li) {
    margin-bottom: 0.375rem;
    line-height: 1.6;
  }

  :global(.markdown-content strong) {
    font-weight: 600;
    color: #0f172a;
  }

  :global(.markdown-content code) {
    background: rgba(79, 125, 255, 0.1);
    color: #4f7dff;
    padding: 0.125rem 0.375rem;
    border-radius: 0.375rem;
    font-size: 0.875em;
    font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
  }

  :global(.markdown-content a) {
    color: #4f7dff;
    text-decoration: none;
    transition: color 150ms;
  }

  :global(.markdown-content a:hover) {
    color: #3b5fe0;
    text-decoration: underline;
  }
</style>
