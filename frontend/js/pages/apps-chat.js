/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Apps Chat
 */
import user2 from '@/images/users/user-2.jpg'
import user3 from '@/images/users/user-3.jpg'
import user4 from '@/images/users/user-4.jpg'
import user5 from '@/images/users/user-5.jpg'
import user6 from '@/images/users/user-6.jpg'
import user7 from '@/images/users/user-7.jpg'
import user8 from '@/images/users/user-8.jpg'
import user9 from '@/images/users/user-9.jpg'
import user10 from '@/images/users/user-10.jpg'

class Chat {
    constructor({
                    sidebarSelector = '#chat-sidebar',
                    sidebarContactAttribute = 'data-chat-id',
                    sidebarContactSelector = `[${sidebarContactAttribute}]`,
                    searchSelector = '[data-chat-search]',
                    contentSelector = '[data-chat]',
                    inputSelector = '[data-chat-input]',
                    sendSelector = '[data-send]',
                    errorSelector = '[data-error]',
                    usernameSelector = '[data-chat-username]',
                    data = []
                } = {}) {
        this.sidebar = document.querySelector(sidebarSelector);
        this.sidebarContactAttribute = sidebarContactAttribute
        this.sidebarContactSelector = sidebarContactSelector
        this.searchInput = document.querySelector(searchSelector);
        this.chatContent = document.querySelector(contentSelector);
        this.chatInput = document.querySelector(inputSelector);
        this.sendButton = document.querySelector(sendSelector);
        this.errorElement = document.querySelector(errorSelector);
        this.usernameElement = document.querySelector(usernameSelector);
        this.activeChatId = null;
        this.chatData = Array.isArray(data) ? data : [];

        this.init();
    }

    init() {
        // Load first chat
        const defaultChat = this.chatData[0];

        this.setupSearch()

        // Sidebar click
        if (this.sidebar) {
            this.sidebar.addEventListener('click', (e) => {
                const link = e.target.closest(this.sidebarContactSelector);
                if (link) this.switchChat(link.dataset.chatId, link);
            });

            if (defaultChat) {
                const defaultEl = this.sidebar.querySelector(`[${this.sidebarContactAttribute}="${defaultChat.id}"]`);
                this.switchChat(defaultChat.id, defaultEl);
            }
        }

        // Send button click
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }

        // Input "Enter" and enable/disable button
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            this.chatInput.addEventListener('input', () => {
                const text = this.chatInput.value.trim();
                this.sendButton.disabled = !text;

                if (this.errorElement && text) {
                    this.errorElement.classList.remove('d-block');
                    this.errorElement.classList.add('d-none');
                    if (this.errorTimeout) clearTimeout(this.errorTimeout);
                }
            });
        }

    }

    getChatById(id) {
        return this.chatData.find(c => c.id === id);
    }

    switchChat(chatId, clickedEl = null) {
        const chat = this.getChatById(chatId);
        if (!chat) return;

        this.activeChatId = chatId;
        this.renderMessages(chat.messages);

        // Highlight sidebar
        if (this.sidebar) {
            this.sidebar.querySelectorAll(this.sidebarContactSelector).forEach(el => el.classList.remove('active'));
        }
        if (clickedEl) clickedEl.classList.add('active');

        // Focus input
        this.chatInput?.focus();

        if (this.usernameElement) this.usernameElement.innerHTML = chat.contact.name

        setTimeout(() => {
            const simpleBar = window.SimpleBar?.instances?.get(this.chatContent);
            const scrollEl = simpleBar ? simpleBar.getScrollElement() : this.chatContent;
            scrollEl.scrollTop = scrollEl.scrollHeight;
        }, 50);
    }

    renderMessages(messages) {
        if (!messages || !this.chatContent) return;

        const simpleBar = window.SimpleBar?.instances?.get(this.chatContent);
        const scrollContent = simpleBar ? simpleBar.getContentElement() : this.chatContent;

        scrollContent.innerHTML = messages.map(msg => {
            const isSelf = msg.from === 'me';
            const alignment = isSelf ? 'text-end justify-content-end' : '';
            const bubbleClass = isSelf ? 'bg-info-subtle' : 'bg-warning-subtle';

            return `
                <div class="d-flex align-items-start gap-2 my-3 chat-item ${alignment}">
                    ${!isSelf ? `<img src="${msg.avatar}" class="avatar-md rounded-circle" alt="User">` : ''}
                    <div>
                        <div class="chat-message py-2 px-3 ${bubbleClass} rounded">${msg.text}</div>
                        <div class="text-muted fs-xs mt-1"><i class="ti ti-clock"></i> ${msg.time || ''}</div>
                    </div>
                    ${isSelf ? `<img src="${msg.avatar}" class="avatar-md rounded-circle" alt="User">` : ''}
                </div>
            `;
        }).join('');

        if (simpleBar) {
            simpleBar.recalculate();
            const el = simpleBar.getScrollElement();
            el.scrollTop = el.scrollHeight;
        } else {
            this.chatContent.scrollTop = this.chatContent.scrollHeight;
        }
    }

    sendMessage() {
        if (!this.chatInput || !this.activeChatId) return;

        const text = this.chatInput.value.trim();

        // Clear previous timeout
        if (this.errorTimeout) clearTimeout(this.errorTimeout);

        // Show error if empty
        if (!text) {
            if (this.errorElement) {
                this.errorElement.textContent = 'Message cannot be empty.';
                this.errorElement.classList.remove('d-none');
                this.errorElement.classList.add('d-block');

                // Auto-hide after 3 seconds
                this.errorTimeout = setTimeout(() => {
                    this.errorElement.classList.remove('d-block');
                    this.errorElement.classList.add('d-none');
                }, 3000);
            }
            return;
        }

        // Hide error if any
        if (this.errorElement) {
            this.errorElement.classList.remove('d-block');
            this.errorElement.classList.add('d-none');
        }

        const chat = this.getChatById(this.activeChatId);
        if (!chat) return;

        const now = new Date();
        const time = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}).toLowerCase();

        const msg = {
            from: "me",
            text,
            time,
            avatar: user2
        };

        chat.messages.push(msg);
        this.renderMessages(chat.messages);
        this.chatInput.value = '';
        this.sendButton.disabled = true;

        this.simulateIncomingMessage(chat.id);
    }

    setupSearch() {
        if (this.searchInput) {
            this.searchInput.addEventListener('keyup', (e) => {
                const query = e.target.value.toLowerCase();

                const list = document.querySelector('.list-group');
                const items = list.querySelectorAll('.list-group-item');

                items.forEach(item => {
                    const fields = item.querySelectorAll('[data-chat-search-field]');
                    const match = [...fields].some(el => el.textContent.toLowerCase().includes(query));
                    item.style.setProperty('display', match ? '' : 'none', 'important');
                });

            });
        }
    }

    simulateIncomingMessage(chatId) {
        const chat = this.getChatById(chatId);
        if (!chat) return;

        const responses = [
            "Can't chat, calls only",
            "😑😑😑",
            "👍",
            "Thanks!",
            "Talk soon.",
            "No worries 😄"
        ];

        const now = new Date();
        const time = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}).toLowerCase();

        const reply = {
            from: chat.contact.name,
            text: responses[Math.floor(Math.random() * responses.length)],
            time,
            avatar: chat.contact.avatar
        };

        setTimeout(() => {
            chat.messages.push(reply);
            if (this.activeChatId === chatId) {
                this.renderMessages(chat.messages);
            }
        }, Math.random() * 2000 + 1000);
    }
}

const chatData = [
    {
        id: "chat1",
        contact: {
            name: "Ava Thompson",
            avatar: user4
        },
        messages: [
            {
                from: "Ava Thompson",
                text: "Hey! Are you available for a quick call? 📞",
                time: "08:55 am",
                avatar: user4
            },
            {
                from: "me",
                text: "Sure, give me 5 minutes. Just wrapping something up.",
                time: "08:57 am",
                avatar: user2
            },
            {
                from: "Ava Thompson",
                text: "Perfect. Let me know when you're ready 👍",
                time: "08:58 am",
                avatar: user4
            },
            {
                from: "me",
                text: "Ready now. Calling you!",
                time: "09:00 am",
                avatar: user2
            },
            {
                from: "Ava Thompson",
                text: "Thanks for your time earlier!",
                time: "09:45 am",
                avatar: user4
            },
            {
                from: "me",
                text: "Of course! It was a productive discussion.",
                time: "09:46 am",
                avatar: user2
            },
            {
                from: "Ava Thompson",
                text: "I’ll send over the updated files by noon.",
                time: "09:50 am",
                avatar: user4
            },
            {
                from: "me",
                text: "Great, I’ll review them once they arrive.",
                time: "09:52 am",
                avatar: user2
            },
            {
                from: "Ava Thompson",
                text: "Just sent them via Drive. Let me know if you have issues accessing.",
                time: "12:03 pm",
                avatar: user4
            },
            {
                from: "me",
                text: "Got them. Everything looks good so far!",
                time: "12:10 pm",
                avatar: user2
            },
            {
                from: "Ava Thompson",
                text: "Awesome 😊 Looking forward to your feedback!",
                time: "12:12 pm",
                avatar: user4
            },
            {
                from: "me",
                text: "Will get back to you after lunch 🍴",
                time: "12:13 pm",
                avatar: user2
            },
            {
                from: "Ava Thompson",
                text: "No rush, enjoy your lunch! 😄",
                time: "12:14 pm",
                avatar: user4
            },
            {
                from: "me",
                text: "Thanks! Talk soon.",
                time: "12:15 pm",
                avatar: user2
            }
        ]
    },
    {
        id: "chat2",
        contact: {
            name: "Noah Smith",
            avatar: user5
        },
        messages: [
            {
                from: "Noah Smith",
                text: "Hey, quick question—did you check the latest design mockups?",
                time: "10:05 am",
                avatar: user5
            },
            {
                from: "me",
                text: "Not yet, just logging in now. Want me to prioritize that?",
                time: "10:06 am",
                avatar: user2
            },
            {
                from: "Noah Smith",
                text: "Yes please. I need your feedback before the client review at noon.",
                time: "10:07 am",
                avatar: user5
            },
            {
                from: "me",
                text: "Got it. I’ll go through them and send notes in a bit.",
                time: "10:08 am",
                avatar: user2
            },
            {
                from: "Noah Smith",
                text: "Thanks a ton!",
                time: "10:08 am",
                avatar: user5
            },
            {
                from: "me",
                text: "First impression: very clean. Minor spacing issues though.",
                time: "10:20 am",
                avatar: user2
            },
            {
                from: "Noah Smith",
                text: "Noted. Fixing those now.",
                time: "10:21 am",
                avatar: user5
            },
            {
                from: "me",
                text: "Sent detailed feedback via email too 📬",
                time: "10:25 am",
                avatar: user2
            },
            {
                from: "Noah Smith",
                text: "Got it. Appreciate the quick turnaround!",
                time: "10:26 am",
                avatar: user5
            }
        ]
    },
    {
        id: "chat3",
        contact: {
            name: "Liam Turner",
            avatar: user7
        },
        messages: [
            {
                from: "Liam Turner",
                text: "Morning! Did you update the backend endpoints yet?",
                time: "09:15 am",
                avatar: user7
            },
            {
                from: "me",
                text: "Morning! Just pushed the changes to dev branch.",
                time: "09:16 am",
                avatar: user2
            },
            {
                from: "Liam Turner",
                text: "Awesome, I’ll pull and test on my side.",
                time: "09:17 am",
                avatar: user7
            },
            {
                from: "me",
                text: "Let me know if anything breaks ⚠️",
                time: "09:18 am",
                avatar: user2
            },
            {
                from: "Liam Turner",
                text: "Looks good so far. Just one CORS error.",
                time: "09:20 am",
                avatar: user7
            },
            {
                from: "me",
                text: "Ah, forgot the whitelist entry. Fixing now.",
                time: "09:21 am",
                avatar: user2
            },
            {
                from: "Liam Turner",
                text: "Reloaded… and it's working. All green ✅",
                time: "09:23 am",
                avatar: user7
            },
            {
                from: "me",
                text: "Nice! That wraps our side for this sprint then?",
                time: "09:24 am",
                avatar: user2
            },
            {
                from: "Liam Turner",
                text: "Yep. Good work 💪",
                time: "09:25 am",
                avatar: user7
            }
        ]
    },
    {
        id: "chat4",
        contact: {
            name: "Emma Wilson",
            avatar: user4
        },
        messages: [
            {
                from: "Ava Thompson",
                text: "Hey! Are you available for a quick call? 📞",
                time: "08:55 am",
                avatar: user4
            },
            {
                from: "me",
                text: "Sure, give me 5 minutes. Just wrapping something up.",
                time: "08:57 am",
                avatar: user2
            },
            {
                from: "Ava Thompson",
                text: "Perfect. Let me know when you're ready 👍",
                time: "08:58 am",
                avatar: user4
            },
            {
                from: "me",
                text: "Ready now. Calling you!",
                time: "09:00 am",
                avatar: user2
            },
            {
                from: "Ava Thompson",
                text: "Thanks for your time earlier!",
                time: "09:45 am",
                avatar: user4
            },
            {
                from: "me",
                text: "Of course! It was a productive discussion.",
                time: "09:46 am",
                avatar: user2
            },
            {
                from: "Ava Thompson",
                text: "I’ll send over the updated files by noon.",
                time: "09:50 am",
                avatar: user4
            },
            {
                from: "me",
                text: "Great, I’ll review them once they arrive.",
                time: "09:52 am",
                avatar: user2
            }
        ]
    },
    {
        id: "chat5",
        contact: {
            name: "Olivia Martinez",
            avatar: user8
        },
        messages: [
            {
                from: "Olivia Martinez",
                text: "Thanks a ton!",
                time: "10:08 am",
                avatar: user8
            },
            {
                from: "me",
                text: "First impression: very clean. Minor spacing issues though.",
                time: "10:20 am",
                avatar: user2
            },
            {
                from: "Olivia Martinez",
                text: "Noted. Fixing those now.",
                time: "10:21 am",
                avatar: user8
            },
            {
                from: "me",
                text: "Sent detailed feedback via email too 📬",
                time: "10:25 am",
                avatar: user2
            },
            {
                from: "Olivia Martinez",
                text: "Got it. Appreciate the quick turnaround!",
                time: "10:26 am",
                avatar: user8
            }
        ]
    },
    {
        id: "chat6",
        contact: {
            name: "William Davis",
            avatar: user7
        },
        messages: [
            {
                from: "William Davis",
                text: "Looks good so far. Just one CORS error.",
                time: "09:20 am",
                avatar: user7
            },
            {
                from: "me",
                text: "Ah, forgot the whitelist entry. Fixing now.",
                time: "09:21 am",
                avatar: user2
            },
            {
                from: "William Davis",
                text: "Reloaded… and it's working. All green ✅",
                time: "09:23 am",
                avatar: user7
            },
            {
                from: "me",
                text: "Nice! That wraps our side for this sprint then?",
                time: "09:24 am",
                avatar: user2
            },
            {
                from: "William Davis",
                text: "Yep. Good work 💪",
                time: "09:25 am",
                avatar: user7
            }
        ]
    },
    {
        id: "chat7",
        contact: {
            name: "Sophia Moore",
            avatar: user10
        },
        messages: [
            {
                from: "me",
                text: "Of course! It was a productive discussion.",
                time: "09:46 am",
                avatar: user2
            },
            {
                from: "Sophia Moore",
                text: "I’ll send over the updated files by noon.",
                time: "09:50 am",
                avatar: user10
            },
            {
                from: "me",
                text: "Great, I’ll review them once they arrive.",
                time: "09:52 am",
                avatar: user2
            },
            {
                from: "Sophia Moore",
                text: "Just sent them via Drive. Let me know if you have issues accessing.",
                time: "12:03 pm",
                avatar: user10
            },
            {
                from: "me",
                text: "Got them. Everything looks good so far!",
                time: "12:10 pm",
                avatar: user2
            },
            {
                from: "Sophia Moore",
                text: "Awesome 😊 Looking forward to your feedback!",
                time: "12:12 pm",
                avatar: user10
            },
            {
                from: "me",
                text: "Will get back to you after lunch 🍴",
                time: "12:13 pm",
                avatar: user2
            },
            {
                from: "Sophia Moore",
                text: "No rush, enjoy your lunch! 😄",
                time: "12:14 pm",
                avatar: user10
            },
            {
                from: "me",
                text: "Thanks! Talk soon.",
                time: "12:15 pm",
                avatar: user2
            }
        ]
    },
    {
        id: "chat8",
        contact: {
            name: "Jackson Lee",
            avatar: user2
        },
        messages: [
            {
                from: "Jackson Lee",
                text: "Thanks a ton!",
                time: "10:08 am",
                avatar: user2
            },
            {
                from: "me",
                text: "First impression: very clean. Minor spacing issues though.",
                time: "10:20 am",
                avatar: user2
            },
            {
                from: "Jackson Lee",
                text: "Noted. Fixing those now.",
                time: "10:21 am",
                avatar: user2
            },
            {
                from: "me",
                text: "Sent detailed feedback via email too 📬",
                time: "10:25 am",
                avatar: user2
            },
            {
                from: "Jackson Lee",
                text: "Got it. Appreciate the quick turnaround!",
                time: "10:26 am",
                avatar: user2
            }
        ]
    },
    {
        id: "chat9",
        contact: {
            name: "Chloe Anderson",
            avatar: user3
        },
        messages: [
            {
                from: "Chloe Anderson",
                text: "Looks good so far. Just one CORS error.",
                time: "09:20 am",
                avatar: user3
            },
            {
                from: "me",
                text: "Ah, forgot the whitelist entry. Fixing now.",
                time: "09:21 am",
                avatar: user2
            },
            {
                from: "Chloe Anderson",
                text: "Reloaded… and it's working. All green ✅",
                time: "09:23 am",
                avatar: user3
            },
            {
                from: "me",
                text: "Nice! That wraps our side for this sprint then?",
                time: "09:24 am",
                avatar: user2
            },
            {
                from: "Chloe Anderson",
                text: "Yep. Good work 💪",
                time: "09:25 am",
                avatar: user3
            }
        ]
    },
    {
        id: "chat10",
        contact: {
            name: "Lucas Wright",
            avatar: user4
        },
        messages: [
            {
                from: "me",
                text: "Great, I’ll review them once they arrive.",
                time: "09:52 am",
                avatar: user2
            },
            {
                from: "Lucas Wright",
                text: "Just sent them via Drive. Let me know if you have issues accessing.",
                time: "12:03 pm",
                avatar: user4
            },
            {
                from: "me",
                text: "Got them. Everything looks good so far!",
                time: "12:10 pm",
                avatar: user2
            },
            {
                from: "Lucas Wright",
                text: "Awesome 😊 Looking forward to your feedback!",
                time: "12:12 pm",
                avatar: user4
            },
            {
                from: "me",
                text: "Will get back to you after lunch 🍴",
                time: "12:13 pm",
                avatar: user2
            },
            {
                from: "Lucas Wright",
                text: "No rush, enjoy your lunch! 😄",
                time: "12:14 pm",
                avatar: user4
            },
            {
                from: "me",
                text: "Thanks! Talk soon.",
                time: "12:15 pm",
                avatar: user2
            }
        ]
    },
    {
        id: "chat11",
        contact: {
            name: "Mia Scott",
            avatar: user6
        },
        messages: [
            {
                from: "me",
                text: "First impression: very clean. Minor spacing issues though.",
                time: "10:20 am",
                avatar: user2
            },
            {
                from: "Mia Scott",
                text: "Noted. Fixing those now.",
                time: "10:21 am",
                avatar: user6
            },
            {
                from: "me",
                text: "Sent detailed feedback via email too 📬",
                time: "10:25 am",
                avatar: user2
            },
            {
                from: "Mia Scott",
                text: "Got it. Appreciate the quick turnaround!",
                time: "10:26 am",
                avatar: user6
            }
        ]
    },
    {
        id: "chat12",
        contact: {
            name: "Benjamin Clark",
            avatar: user9
        },
        messages: [
            {
                from: "Benjamin Clark",
                text: "Looks good so far. Just one CORS error.",
                time: "09:20 am",
                avatar: user9
            },
            {
                from: "me",
                text: "Ah, forgot the whitelist entry. Fixing now.",
                time: "09:21 am",
                avatar: user2
            },
            {
                from: "Benjamin Clark",
                text: "Reloaded… and it's working. All green ✅",
                time: "09:23 am",
                avatar: user9
            },
            {
                from: "me",
                text: "Nice! That wraps our side for this sprint then?",
                time: "09:24 am",
                avatar: user2
            },
            {
                from: "Benjamin Clark",
                text: "Yep. Good work 💪",
                time: "09:25 am",
                avatar: user9
            }
        ]
    },
];

document.addEventListener("DOMContentLoaded", () => {
    new Chat({
        data: chatData
    });
})