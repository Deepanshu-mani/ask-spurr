<script lang="ts">
  export let value: string;
  export let onSend: () => void;
  export let onKeyPress: (event: KeyboardEvent) => void;
  export let disabled: boolean = false;

  let isFocused = false;
</script>

<div
  class="bg-white/95 sm:bg-transparent border-t border-slate-200 sm:border-0 rounded-t-2xl sm:rounded-none shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:shadow-none px-4 sm:px-6 lg:px-8 pb-6 sm:pb-6 pt-3 sm:pt-4"
  style="padding-bottom: max(1.5rem, env(safe-area-inset-bottom, 1.5rem));"
>
  <div
    class="max-w-4xl mx-auto sm:glass rounded-full px-1.5 sm:px-2 py-1 sm:py-2 transition-all duration-300 {isFocused
      ? 'sm:shadow-glass-hover sm:ring-2 sm:ring-brand-500/30'
      : 'sm:shadow-glass'}"
  >
    <div class="flex gap-2 sm:gap-3 items-center">
      <input
        type="text"
        bind:value
        onkeypress={onKeyPress}
        onfocus={() => (isFocused = true)}
        onblur={() => (isFocused = false)}
        placeholder="Ask anything..."
        {disabled}
        class="flex-1 bg-transparent border-none outline-none px-2 sm:px-5 py-2 sm:py-3 text-base sm:text-[0.9375rem] text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 message-input"
      />
      <button
        onclick={onSend}
        disabled={disabled || !value.trim()}
        class="group w-10 h-10 sm:w-11 sm:h-11 p-0 bg-[#157adf] border-none rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
        aria-label="Send message"
      >
        <img
          src="/send.png"
          alt="Send"
          class="w-5 h-5 sm:w-6 sm:h-6 object-contain transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </button>
    </div>
  </div>
</div>

<style>
  .message-input:focus {
    outline: none;
  }
</style>
