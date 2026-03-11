/* ==========================================
   ワラビーくんの やることボード - アプリロジック
   ========================================== */

// --- タスクデータ（ひらがな・カタカナのみ） ---
const defaultTasks = [
    { id: 1, text: 'はみがき',       icon: '🪥', done: false },
    { id: 2, text: 'おきがえ',       icon: '👕', done: false },
    { id: 3, text: 'あさごはん',     icon: '🍚', done: false },
    { id: 4, text: 'もちものチェック', icon: '🎒', done: false },
    { id: 5, text: 'おでかけ',       icon: '🚶', done: false },
    { id: 6, text: 'おひるごはん',   icon: '🍙', done: false },
    { id: 7, text: 'おふろ',         icon: '🛁', done: false },
    { id: 8, text: 'はみがき（よる）', icon: '🌙', done: false },
];

// --- コアラさんの褒めセリフ ---
const praiseMessages = [
    'できたね！',
    'すごい！',
    'やったね！',
    'えらい！',
    'がんばったね！',
    'いいね！',
    'バッチリ！',
    'さすが！',
];

// --- 状態管理 ---
let tasks = [];

// --- 初期化 ---
function init() {
    // ローカルストレージから復元、なければデフォルト
    const saved = localStorage.getItem('warabies_tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    } else {
        tasks = JSON.parse(JSON.stringify(defaultTasks));
    }
    renderTasks();
    updateProgress();
}

// --- タスクカードの描画 ---
function renderTasks() {
    const listEl = document.getElementById('taskList');
    listEl.innerHTML = '';

    tasks.forEach((task, index) => {
        const card = document.createElement('div');
        card.className = `task-card ${task.done ? 'done' : ''}`;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${task.text} ${task.done ? 'かんりょう' : 'まだ'}`);
        card.setAttribute('tabindex', '0');

        card.innerHTML = `
            <div class="task-checkbox">${task.done ? '✓' : ''}</div>
            <div class="task-icon">${task.icon}</div>
            <div class="task-text">${task.text}</div>
        `;

        card.addEventListener('click', () => toggleTask(index));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTask(index);
            }
        });

        // 登場アニメーション（初回のみ）
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);

        listEl.appendChild(card);
    });
}

// --- タスクのチェック/解除 ---
function toggleTask(index) {
    const task = tasks[index];
    task.done = !task.done;

    // 保存
    saveTasks();

    // カードのアニメーション
    const cards = document.querySelectorAll('.task-card');
    const card = cards[index];

    if (task.done) {
        card.classList.add('completing');
        setTimeout(() => card.classList.remove('completing'), 500);

        // コアラさんの褒め
        showPraise();
    }

    // 再描画
    setTimeout(() => {
        card.className = `task-card ${task.done ? 'done' : ''}`;
        card.querySelector('.task-checkbox').textContent = task.done ? '✓' : '';
        card.setAttribute('aria-label', `${task.text} ${task.done ? 'かんりょう' : 'まだ'}`);
    }, 100);

    // 進捗バー更新
    updateProgress();

    // 全クリアチェック
    if (task.done) {
        setTimeout(() => checkAllDone(), 800);
    }
}

// --- 進捗バーの更新 ---
function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const percent = total > 0 ? (done / total) * 100 : 0;

    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('progressText').textContent = `${done} / ${total} できたよ！`;
}

// --- コアラさんの褒めポップアップ ---
function showPraise() {
    const popup = document.getElementById('praisePopup');
    const textEl = document.getElementById('praiseText');

    // ランダムなセリフ
    const msg = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
    textEl.textContent = msg;

    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 1200);
}

// --- 全クリアチェック ---
function checkAllDone() {
    const allDone = tasks.every(t => t.done);
    if (allDone) {
        showCelebration();
    }
}

// --- 全クリア演出 ---
function showCelebration() {
    const overlay = document.getElementById('celebrationOverlay');
    overlay.classList.add('show');

    // 紙吹雪を散らす
    createConfetti();
}

function closeCelebration() {
    const overlay = document.getElementById('celebrationOverlay');
    overlay.classList.remove('show');
}

// --- 紙吹雪 ---
function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#45B7AA', '#FF9FF3', '#54A0FF'];

    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 8 + 6}px`;
            confetti.style.height = `${Math.random() * 8 + 6}px`;
            confetti.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

// --- データ保存 ---
function saveTasks() {
    localStorage.setItem('warabies_tasks', JSON.stringify(tasks));
}

// --- リセット機能（開発用） ---
function resetTasks() {
    tasks = JSON.parse(JSON.stringify(defaultTasks));
    saveTasks();
    renderTasks();
    updateProgress();
}

// --- 起動 ---
document.addEventListener('DOMContentLoaded', init);
