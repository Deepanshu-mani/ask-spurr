<script lang="ts">
  export let onNewChat: () => void;
</script>

<div class="glass sticky top-0 z-40 border-b border-white/30">
  <div class="max-w-7xl mx-auto  py-5 flex justify-between items-center">
    <div class="flex items-center gap-3.5">
      <img
        src="/robot.png"
        alt="Ask AI"
        class="w-10 h-10 object-contain drop-shadow-lg transform transition-transform duration-300 hover:scale-110"
      />
      <div>
        <h1 class="text-xl font-semibold text-slate-900 tracking-tight">
          Ask AI
        </h1>
        <p class="text-xs text-slate-600 mt-0.5">AI-Powered Customer Service</p>
      </div>
    </div>
    <button
      onclick={onNewChat}
      class="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/30 hover:scale-105 active:scale-95"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="transition-transform duration-200 group-hover:rotate-90"
      >
        <path
          d="M8 1V15M1 8H15"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      New Chat
    </button>
  </div>
</div>

<style>
  @keyframes glow {
    0%,
    100% {
      filter: drop-shadow(0 0 8px rgba(79, 125, 255, 0.4));
    }
    50% {
      filter: drop-shadow(0 0 16px rgba(79, 125, 255, 0.6));
    }
  }

  .group:hover svg {
    animation: glow 2s ease-in-out infinite;
  }
</style>
