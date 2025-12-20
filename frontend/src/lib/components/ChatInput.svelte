<script lang="ts">
	export let value: string;
	export let onSend: () => void;
	export let onKeyPress: (event: KeyboardEvent) => void;
	export let disabled: boolean = false;
</script>

<div class="input-area">
	<div class="input-wrapper">
		<input
			type="text"
			bind:value
			onkeypress={onKeyPress}
			placeholder="Ask anything about our store..."
			{disabled}
			class="message-input"
		/>
		<button
			onclick={onSend}
			disabled={disabled || !value.trim()}
			class="send-button"
			aria-label="Send message"
		>
			<img src="/send.png" alt="Send" class="send-icon" />
		</button>
	</div>
</div>

<style>
	.input-area {
		background: white;
		padding: 1.5rem 2rem 1.25rem;
		border-top: 1px solid #e2e8f0;
		flex-shrink: 0;
	}

	.input-wrapper {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		background: #f7fafc;
		border: 2px solid #e2e8f0;
		border-radius: 16px;
		padding: 0.5rem;
		transition: all 0.2s;
	}

	.input-wrapper:focus-within {
		border-color: #667eea;
		background: white;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.message-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		padding: 0.75rem 1rem;
		font-size: 0.95rem;
		color: #2d3748;
		font-family: inherit;
	}

	.message-input::placeholder {
		color: #a0aec0;
	}

	.message-input:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.send-button {
		width: 44px;
		height: 44px;
		padding: 0;
		background: linear-gradient(135deg, #167adf 0%, #1366c0 100%);
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(22, 122, 223, 0.3);
	}

	.send-button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(22, 122, 223, 0.4);
	}

	.send-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.send-button:disabled {
		background: #cbd5e0;
		cursor: not-allowed;
		box-shadow: none;
	}

	.send-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}

</style>
