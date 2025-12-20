<script lang="ts">
  export let onSuggestionClick: (text: string) => void;
</script>

<div class="welcome-screen">
  <div class="welcome-icon">👋</div>
  <h2>Welcome to Ask AI!</h2>
  <p class="welcome-subtitle">How can we help you today?</p>

  <div class="suggestions-grid">
    <button
      class="suggestion-card"
      onclick={() => onSuggestionClick("What is your shipping policy?")}
    >
      <div class="suggestion-icon">📦</div>
      <div class="suggestion-content">
        <h3>Shipping Policy</h3>
        <p>Learn about our delivery options</p>
      </div>
    </button>

    <button
      class="suggestion-card"
      onclick={() => onSuggestionClick("How do I return an item?")}
    >
      <div class="suggestion-icon">↩️</div>
      <div class="suggestion-content">
        <h3>Returns & Refunds</h3>
        <p>Easy 30-day return policy</p>
      </div>
    </button>

    <button
      class="suggestion-card"
      onclick={() => onSuggestionClick("What are your support hours?")}
    >
      <div class="suggestion-icon">🕐</div>
      <div class="suggestion-content">
        <h3>Support Hours</h3>
        <p>When we're available to help</p>
      </div>
    </button>
  </div>
</div>

<style>
  .welcome-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    text-align: center;
    padding: 2rem;
    animation: fadeIn 0.8s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .welcome-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    animation: wave 2s ease-in-out infinite;
  }

  @keyframes wave {
    0%,
    100% {
      transform: rotate(0deg);
    }
    10%,
    30% {
      transform: rotate(14deg);
    }
    20%,
    40% {
      transform: rotate(-8deg);
    }
  }

  .welcome-screen h2 {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 0.75rem 0;
    letter-spacing: -0.5px;
  }

  .welcome-subtitle {
    font-size: 1.125rem;
    color: #718096;
    margin: 0 0 3rem 0;
    font-weight: 400;
  }

  .suggestions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
    width: 100%;
    max-width: 900px;
  }

  .suggestion-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.5rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .suggestion-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  }

  .suggestion-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .suggestion-content h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a202c;
  }

  .suggestion-content p {
    margin: 0;
    font-size: 0.875rem;
    color: #718096;
  }
</style>
