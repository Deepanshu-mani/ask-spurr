<div class="typing-row">
  <div class="ai-avatar">
    <img
      src="https://cdn.spurnow.com/360/7799_spurlogobluebg.svg"
      alt="Spur"
      class="avatar-img"
    />
  </div>
  <div class="typing-bubble">
    <span class="dot" style="animation-delay: 0ms"></span>
    <span class="dot" style="animation-delay: 160ms"></span>
    <span class="dot" style="animation-delay: 320ms"></span>
  </div>
</div>

<style>
  .typing-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
  }

  .ai-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
  }

  .avatar-img {
    width: 36px;
    height: 36px;
    object-fit: cover;
    border-radius: 50%;
  }

  .typing-bubble {
    background: #ffffff;
    border-radius: 18px 18px 18px 4px;
    padding: 14px 18px;
    display: flex;
    gap: 5px;
    align-items: center;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .dot {
    width: 7px;
    height: 7px;
    background: #94a3b8;
    border-radius: 50%;
    display: block;
    animation: bounce 1.4s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 60%, 100% {
      transform: translateY(0);
      background: #cbd5e1;
    }
    30% {
      transform: translateY(-6px);
      background: #2563eb;
    }
  }
</style>
