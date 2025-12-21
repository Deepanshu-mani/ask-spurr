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
  class="flex flex-col items-center justify-center min-h-full text-center p-8 max-w-6xl mx-auto"
>
  <div
    class="text-7xl mb-6 animate-bounce-slow"
    style="animation-duration: 3s;"
  >
    👋
  </div>
  <h2
    class="text-5xl font-bold text-slate-900 mb-3 tracking-tight bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent"
  >
    Welcome to Ask AI!
  </h2>
  <p class="text-lg text-slate-600 mb-16 max-w-md">
    How can we help you today?
  </p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
    {#each cards as card, i}
      <button
        class="glass group relative overflow-hidden p-8 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-glass-hover text-left"
        onclick={() => onSuggestionClick(card.query)}
        in:scale={{ duration: 300, delay: i * 100, start: 0.9 }}
      >
        <!-- Hover glow effect -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>

        <div class="relative z-10">
          <div
            class="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110"
          >
            {card.emoji}
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">
            {card.title}
          </h3>
          <p class="text-sm text-slate-600">
            {card.subtitle}
          </p>
        </div>

        <!-- Subtle border glow -->
        <div
          class="absolute inset-0 rounded-3xl border border-brand-300/0 group-hover:border-brand-300/50 transition-colors duration-300"
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
