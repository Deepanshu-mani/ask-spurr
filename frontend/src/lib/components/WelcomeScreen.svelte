<script lang="ts">
  import { scale } from "svelte/transition";

  export let onSuggestionClick: (text: string) => void;

  const cards = [
    {
      emoji: "📦",
      title: "Shipping Policy",
      subtitle: "Learn about our delivery options",
      query: "What is your shipping policy?",
    },
    {
      emoji: "↩️",
      title: "Returns & Refunds",
      subtitle: "Easy 30-day return policy",
      query: "How do I return an item?",
    },
    {
      emoji: "🕐",
      title: "Support Hours",
      subtitle: "When we're available to help",
      query: "What are your support hours?",
    },
  ];
</script>

<div
  class="flex flex-col items-center justify-start text-center px-3 sm:px-4 lg:px-8 pt-4 sm:pt-8 lg:pt-12 pb-2 max-w-6xl mx-auto"
>
  <div
    class="text-3xl sm:text-5xl lg:text-7xl mb-2 sm:mb-4 lg:mb-6 animate-bounce-slow"
    style="animation-duration: 3s;"
  >
    👋
  </div>
  <h2
    class="text-lg sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-1 sm:mb-2 lg:mb-3 tracking-tight bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent"
  >
    Welcome to Ask AI!
  </h2>
  <p
    class="text-xs sm:text-sm lg:text-lg text-slate-600 mb-4 sm:mb-8 lg:mb-16 max-w-md"
  >
    How can we help you today?
  </p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-6 w-full">
    {#each cards as card, i}
      <button
        class="glass group relative overflow-hidden p-3 sm:p-5 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-glass-hover text-left"
        onclick={() => onSuggestionClick(card.query)}
        in:scale={{ duration: 300, delay: i * 100, start: 0.9 }}
      >
        <!-- Hover glow effect -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>

        <div class="relative z-10 flex items-center gap-3 sm:block">
          <div
            class="text-2xl sm:text-3xl lg:text-4xl sm:mb-3 lg:mb-4 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
          >
            {card.emoji}
          </div>
          <div>
            <h3
              class="text-sm sm:text-base lg:text-xl font-semibold text-slate-900 sm:mb-1 lg:mb-2"
            >
              {card.title}
            </h3>
            <p
              class="text-[10px] sm:text-xs lg:text-sm text-slate-600 hidden sm:block"
            >
              {card.subtitle}
            </p>
          </div>
        </div>

        <!-- Subtle border glow -->
        <div
          class="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-brand-300/0 group-hover:border-brand-300/50 transition-colors duration-300"
        ></div>
      </button>
    {/each}
  </div>
</div>

<style>
  @keyframes bounce-slow {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }
</style>
