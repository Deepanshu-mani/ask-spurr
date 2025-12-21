<script lang="ts">
  export let onNewChat: () => void;
</script>

<div class="glass sticky top-0 z-40 border-b border-white/30">
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 flex justify-between items-center"
  >
    <div class="flex items-center gap-2.5 sm:gap-3.5">
      <img
        src="/robot.png"
        alt="Ask AI"
        class="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-lg transform transition-transform duration-300 hover:scale-110"
      />
      <div>
        <h1
          class="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight"
        >
          Ask AI
        </h1>
        <p class="text-[10px] sm:text-xs text-slate-600 mt-0.5 hidden xs:block">
          AI-Powered Customer Service
        </p>
      </div>
    </div>
    <button
      onclick={onNewChat}
      class="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/30 hover:scale-105 active:scale-95"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="transition-transform duration-200 group-hover:rotate-90 sm:w-4 sm:h-4"
      >
        <path
          d="M8 1V15M1 8H15"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <span class="hidden sm:inline">New Chat</span>
      <span class="sm:hidden">New</span>
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
