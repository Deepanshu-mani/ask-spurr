<script lang="ts">
  import { scale, fly } from "svelte/transition";

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
    {
      emoji: "🛍️",
      title: "My Orders",
      subtitle: "View active orders and tracking",
      query: "Show me my active orders and their statuses.",
    },
  ];
</script>

<div class="welcome-wrap">
  <div class="welcome-hero" in:fly={{ y: -10, duration: 400, delay: 100 }}>
    <h1 class="welcome-title">Welcome to Ask-Spurr!</h1>
    <p class="welcome-sub">How can we help you today?</p>
  </div>

  <div class="cards-grid">
    {#each cards as card, i}
      <button
        class="suggestion-card"
        onclick={() => onSuggestionClick(card.query)}
        in:scale={{ duration: 280, delay: 200 + i * 80, start: 0.9 }}
      >
        <span class="card-emoji">{card.emoji}</span>
        <div class="card-text">
          <span class="card-title">{card.title}</span>
          <span class="card-sub">{card.subtitle}</span>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .welcome-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px 20px;
    width: 100%;
    margin: 0 auto;
    gap: 40px;
  }

  .welcome-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .welcome-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #2563eb;
    margin: 0;
    letter-spacing: -0.03em;
  }

  .welcome-sub {
    font-size: 1rem;
    color: #475569;
    margin: 0;
  }

  .cards-grid {
    display: grid;
    /* Force exactly 2 columns to create a 2x2 layout */
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    width: 100%;
    max-width: 700px;
  }

  .suggestion-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    background: #f4f8fc;
    border: 1px solid transparent;
    border-radius: 16px;
    padding: 24px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  }

  .suggestion-card:hover {
    border-color: rgba(37, 99, 235, 0.2);
    background: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.08);
  }

  .suggestion-card:active {
    transform: scale(0.98);
  }

  .card-emoji {
    font-size: 1.8rem;
    line-height: 1;
  }

  .card-text {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .card-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #0f172a;
  }

  .card-sub {
    font-size: 0.85rem;
    color: #64748b;
  }

  @media (max-width: 600px) {
    .welcome-wrap {
      padding: 30px 16px 20px;
      gap: 24px;
    }

    .welcome-title {
      font-size: 1.75rem;
    }

    .cards-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .suggestion-card {
      padding: 16px 12px;
      gap: 10px;
    }

    .card-emoji {
      font-size: 1.5rem;
    }

    .card-title {
      font-size: 0.95rem;
    }

    .card-sub {
      font-size: 0.75rem;
    }
  }
</style>
