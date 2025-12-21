import type { Message } from "$lib/types";

const API_URL = "http://localhost:3000";

class ChatStore {
    messages = $state<Message[]>([]);
    inputMessage = $state("");
    isLoading = $state(false);
    error = $state("");
    sessionId = $state("");

    // Heartbeat state
    private heartbeatTimer: any;
    private heartbeatDelay = 1000;

    constructor() {
        // We cannot access localStorage in constructor during SSR, 
        // so we rely on an init() method or checking browser env in effects.
        // However, for simplicity in a SPA/client-side context, 
        // we can initialize in onMount or just expose an init function.
    }

    init() {
        const savedSessionId = localStorage.getItem("chatSessionId");
        const savedMessages = localStorage.getItem("chatMessages");

        if (savedMessages) {
            try {
                this.messages = JSON.parse(savedMessages);
            } catch (e) {
                console.error("Failed to parse saved messages");
            }
        }

        if (savedSessionId) {
            this.sessionId = savedSessionId;
            this.loadConversationHistory(savedSessionId);
        }

        // Listen for online status
        window.addEventListener("online", () => this.syncOfflineMessages());

        if (navigator.onLine) {
            this.syncOfflineMessages();
        }

        // Auto-save effect logic fits better in the component using $effect usually, 
        // or we can set up a reaction here if we were using a slightly different pattern.
        // For this refactor, we'll keep the persistence logic simple: 
        // we'll update localStorage whenever we modify messages.
    }

    destroy() {
        if (typeof window !== "undefined") {
            window.removeEventListener("online", () => this.syncOfflineMessages());
            this.stopHeartbeat();
        }
    }

    private saveMessages() {
        if (typeof localStorage !== "undefined" && this.messages.length > 0) {
            localStorage.setItem("chatMessages", JSON.stringify(this.messages));
        }
    }

    async loadConversationHistory(id: string) {
        try {
            const response = await fetch(`${API_URL}/chat/${id}`);
            if (response.ok) {
                const data = await response.json();
                const serverMessages = data.messages.map((m: any) => ({
                    ...m,
                    status: "sent",
                }));

                const localUnsentMessages = this.messages.filter(
                    (m) => m.status === "error" || m.status === "sending"
                );

                const serverIds = new Set(serverMessages.map((m: any) => m.id));
                const uniqueLocal = localUnsentMessages.filter(
                    (m) => !serverIds.has(m.id)
                );

                this.messages = [...serverMessages, ...uniqueLocal];
                this.saveMessages();
            }
        } catch (err) {
            console.error("Failed to load history:", err);
        }
    }

    async sendMessage(text: string = this.inputMessage) {
        if (!text.trim() || this.isLoading) return;

        const userMessage = text.trim();
        const tempId = Date.now().toString();

        // Clear input if it matches what we are sending (handles retry vs new)
        if (this.inputMessage === text) {
            this.inputMessage = "";
        }

        this.error = "";

        const tempUserMsg: Message = {
            id: tempId,
            sender: "user",
            text: userMessage,
            createdAt: new Date().toISOString(),
            status: "sending",
        };

        this.messages = [...this.messages, tempUserMsg];
        this.saveMessages();

        // Set loading AFTER adding user message so it appears first
        this.isLoading = true;

        await this.processMessage(tempUserMsg, userMessage);
    }

    async retryMessage(id: string) {
        const msgIndex = this.messages.findIndex((m) => m.id === id);
        if (msgIndex === -1 || this.isLoading) return;

        const msg = this.messages[msgIndex];
        this.isLoading = true;
        this.error = "";

        const newMessages = [...this.messages];
        newMessages[msgIndex] = { ...msg, status: "sending" };
        this.messages = newMessages;
        this.saveMessages();

        await this.processMessage(msg, msg.text);
    }

    async processMessage(msgObject: Message, textContent: string) {
        try {
            const response = await fetch(`${API_URL}/chat/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: textContent,
                    sessionId: this.sessionId || undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            const data = await response.json();

            if (data.sessionId && !this.sessionId) {
                this.sessionId = data.sessionId;
                localStorage.setItem("chatSessionId", data.sessionId);
            }

            this.messages = this.messages.map((m) =>
                m.id === msgObject.id
                    ? { ...m, status: "sent", id: data.sessionId ? m.id : m.id }
                    : m
            );

            // Auto-sync others
            this.syncOfflineMessages();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                text: data.reply,
                createdAt: new Date().toISOString(),
                status: "sent",
            };
            this.messages = [...this.messages, aiMsg];
            this.saveMessages();

        } catch (err) {
            this.messages = this.messages.map((m) =>
                m.id === msgObject.id ? { ...m, status: "error" } : m
            );
            this.saveMessages();

            this.error = err instanceof Error ? err.message : "An error occurred";
            this.startHeartbeat();
        } finally {
            this.isLoading = false;
        }
    }

    async syncOfflineMessages() {
        console.log("🔄 Syncing...");
        const pendingMessages = this.messages.filter(
            (m) => m.status === "error" || m.status === "sending"
        );

        if (pendingMessages.length === 0) return;

        if (pendingMessages.length > 1) {
            await this.processBatchMessages(pendingMessages);
        } else {
            await this.retryMessage(pendingMessages[0].id);
        }
    }

    async processBatchMessages(batch: Message[]) {
        this.isLoading = true;
        this.error = "";

        const batchIds = new Set(batch.map(m => m.id));
        this.messages = this.messages.map(m =>
            batchIds.has(m.id) ? { ...m, status: 'sending' } : m
        );
        this.saveMessages();

        const combinedText = batch.map(m => m.text).join('\n');

        try {
            const response = await fetch(`${API_URL}/chat/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: combinedText,
                    sessionId: this.sessionId || undefined,
                }),
            });

            if (!response.ok) throw new Error("Failed to sync");

            const data = await response.json();

            if (data.sessionId && !this.sessionId) {
                this.sessionId = data.sessionId;
                localStorage.setItem("chatSessionId", data.sessionId);
            }

            this.messages = this.messages.map(m =>
                batchIds.has(m.id) ? { ...m, status: 'sent' } : m
            );

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                text: data.reply,
                createdAt: new Date().toISOString(),
                status: "sent",
            };
            this.messages = [...this.messages, aiMsg];
            this.saveMessages();

        } catch (err) {
            this.messages = this.messages.map(m =>
                batchIds.has(m.id) ? { ...m, status: 'error' } : m
            );
            this.saveMessages();
            this.startHeartbeat();
        } finally {
            this.isLoading = false;
        }
    }

    startHeartbeat() {
        if (this.heartbeatTimer) return;

        console.log(`💓 Heartbeat started (${this.heartbeatDelay}ms)...`);
        this.heartbeatTimer = setTimeout(async () => {
            try {
                const res = await fetch(`${API_URL}/health`);
                if (res.ok) {
                    console.log("💓 Backend recovered!");
                    this.stopHeartbeat();
                    this.syncOfflineMessages();
                    return;
                }
            } catch (e) { /* ignore */ }

            this.heartbeatDelay = Math.min(this.heartbeatDelay * 1.5, 30000);
            this.heartbeatTimer = null;
            this.startHeartbeat();
        }, this.heartbeatDelay);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearTimeout(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        this.heartbeatDelay = 1000;
    }

    startNewConversation() {
        this.messages = [];
        this.sessionId = "";
        localStorage.removeItem("chatSessionId");
        this.error = "";
        this.saveMessages();
    }
}

export const chatStore = new ChatStore();
