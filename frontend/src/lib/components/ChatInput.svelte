<script lang="ts">
  export let value: string;
  export let onSend: () => void;
  export let onKeyPress: (event: KeyboardEvent) => void;
  export let disabled: boolean = false;

  let isFocused = false;
</script>

<div class="px-8 pb-6 pt-4">
  <div
    class="max-w-4xl mx-auto glass rounded-full px-2 py-2 transition-all duration-300 {isFocused
      ? 'shadow-glass-hover ring-2 ring-brand-500/30'
      : 'shadow-glass'}"
  >
    <div class="flex gap-3 items-center">
      <input
        type="text"
        bind:value
        onkeypress={onKeyPress}
        onfocus={() => (isFocused = true)}
        onblur={() => (isFocused = false)}
        placeholder="Ask anything about our store..."
        {disabled}
        class="flex-1 bg-transparent border-none outline-none px-5 py-3 text-[0.9375rem] text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 message-input"
      />
      <button
        onclick={onSend}
        disabled={disabled || !value.trim()}
        class="group w-11 h-11 p-0 bg-[#157adf] border-none rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
        aria-label="Send message"
      >
        <img
          src="/send.png"
          alt="Send"
          class="w-6 h-6 object-contain transition-transform duration-200 group-hover:translate-x-0.5"
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
