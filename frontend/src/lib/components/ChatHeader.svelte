<script lang="ts">
	export let onNewChat: () => void;
	export let sessionId: string;
</script>

<div class="chat-header">
	<div class="header-left">
		<div class="logo">
			<img src="/robot.png" alt="ShopEase AI" class="logo-icon" />
			<div class="logo-text">
				<h1>Ask AI</h1>
				<p>AI-Powered Customer Service</p>
			</div>
		</div>
	</div>
	{#if sessionId}
		<button class="new-chat-btn" onclick={onNewChat}>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
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
	{/if}
</div>

<style>
	.chat-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 1.5rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		flex-shrink: 0;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo-icon {
		width: 48px;
		height: 48px;
		object-fit: contain;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
	}

	.logo-text h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
		letter-spacing: -0.5px;
	}

	.logo-text p {
		margin: 0.25rem 0 0 0;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 400;
	}

	.new-chat-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.95rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.new-chat-btn:hover {
		background: rgba(255, 255, 255, 0.25);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}
</style>
