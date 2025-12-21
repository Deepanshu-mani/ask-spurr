<div class="animate-slide-up flex gap-3 items-start max-w-3xl">
  <div
    class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
  >
    <img src="/robot.png" alt="AI" class="w-8 h-8 object-contain" />
  </div>
  <div class="glass px-6 py-4 rounded-3xl rounded-tl-md shadow-glass">
    <div class="flex gap-1.5 items-center h-6">
      <span
        class="w-2 h-2 bg-brand-500 rounded-full animate-wave"
        style="animation-delay: 0ms"
      ></span>
      <span
        class="w-2 h-2 bg-brand-500 rounded-full animate-wave"
        style="animation-delay: 150ms"
      ></span>
      <span
        class="w-2 h-2 bg-brand-500 rounded-full animate-wave"
        style="animation-delay: 300ms"
      ></span>
    </div>
  </div>
</div>

<style>
  @keyframes wave {
    0%,
    60%,
    100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-8px);
    }
  }

  .animate-wave {
    animation: wave 1.4s ease-in-out infinite;
  }
</style>
