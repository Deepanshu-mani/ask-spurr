<div class="message-wrapper ai">
	<div class="message-row">
		<div class="message-avatar">
			<img src="/robot.png" alt="AI" class="avatar-icon" />
		</div>
		<div class="message-bubble ai-bubble typing-bubble">
			<div class="typing-indicator">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
	</div>
</div>

<style>
	.message-wrapper {
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.message-row {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.message-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.avatar-icon {
		width: 35px;
		height: 35px;
		object-fit: contain;
	}

	.message-bubble {
		max-width: 75%;
		border-radius: 18px;
		padding: 1rem 1.25rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.ai-bubble {
		background: white;
		border: 1px solid #e2e8f0;
	}

	.typing-bubble {
		padding: 1rem 1.5rem;
	}

	.typing-indicator {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	.typing-indicator span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #667eea;
		animation: verticalBounce 1.4s infinite ease-in-out;
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: 0s;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: 0.2s;
	}

	.typing-indicator span:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes verticalBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
