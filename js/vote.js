// 2. **【重要】** Firebase 專案設定 (請替換為您的專案資訊)
const firebaseConfig = {
    apiKey: "AIzaSyAMbn7QRcJ5ql4KOUa6Ml21m5c3n-k_FjE",
    authDomain: "givenvote-test.firebaseapp.com",
    projectId: "givenvote-test",
    storageBucket: "givenvote-test.firebasestorage.app",
    messagingSenderId: "703448094692",
    appId: "1:703448094692:web:0074124348db6fbb8d99f1",
    measurementId: "G-BS16W1L2RK"
};

// 3. 初始化 Firebase 和 Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const VOTES_COLLECTION = 'given_character_votes'; 

// 4. 定義角色資料
const characters = [
    { id: 'mafuyu', name: '佐藤真冬', img: '../image/真冬vote.png' },
    { id: 'ritsuka', name: '上山立夏', img: '../image/立夏vote.png' },
    { id: 'haruki', name: '中山春樹', img: '../image/春樹vote.png' },
    { id: 'akihiko', name: '梶秋彥', img: '../image/秋彥vote.png' },
    { id: 'uenoyama', name: '八木玄純', img: '../image/玄純vote.png' },
    { id: 'murata', name: '鹿島柊', img: '../image/柊vote.png' },
    { id: 'shizusumi', name: '村田雨月', img: '../image/雨月vote.png' },
    { id: 'yuki', name: '吉田由紀', img: '../image/由紀vote.png' }
];

let currentVotes = {}; 

// ====== Pop-up 處理函數 ======

/**
 * 顯示自定義 Pop-up 視窗
 * @param {string} message - 顯示在視窗中的訊息
 */
function showPopup(message) {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupMessage = document.getElementById('popup-message');
    
    popupMessage.textContent = message;
    popupOverlay.style.display = 'flex'; 

    // 延遲 3 秒後自動關閉 Pop-up
    setTimeout(() => {
        // 檢查是否仍然顯示，避免用戶手動關閉後又彈出
        if (popupOverlay.style.display === 'flex') {
            closePopup();
        }
    }, 3000); 
}

/**
 * 關閉 Pop-up 視窗
 */
function closePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
}

/**
 * 渲染角色投票卡片到網頁上 (加入卡片入場動畫延遲)
 */
function renderCards() {
    const container = document.querySelector('.voting-container');
    container.innerHTML = ''; 

    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'character-card';
        // 動態設定動畫延遲
        card.style.animationDelay = `${index * 0.05}s`; 
        
        card.innerHTML = `
            <img src="${char.img}" alt="${char.name} 圖片">
            <div class="card-info">
                <h3>${char.name}</h3>
                <button class="vote-button" data-id="${char.id}">投給 ${char.name}</button>
            </div>
        `;
        container.appendChild(card);
    });

    // 確保所有按鈕有正確的點擊事件監聽器
    document.querySelectorAll('.vote-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const charId = event.target.getAttribute('data-id');
            castVote(charId);
        });
    });
}

/**
 * 處理投票邏輯 - 使用 Firestore 交易更新票數
 */
async function castVote(charId) {
    const charName = characters.find(c => c.id === charId).name;
    const voteRef = db.collection(VOTES_COLLECTION).doc(charId);

    // 禁用所有按鈕，防止重複點擊
    document.querySelectorAll('.vote-button').forEach(btn => btn.disabled = true);

    try {
        await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(voteRef);

            if (!doc.exists) {
                // 如果文件不存在，則初始化為 1 票
                transaction.set(voteRef, { name: charName, count: 1 });
            } else {
                // 如果文件存在，將票數加 1
                const newCount = (doc.data().count || 0) + 1;
                transaction.update(voteRef, { count: newCount });
            }
        });
        
        // 成功後，顯示 Pop-up 
        showPopup(`已成功投給 ${charName} 一票！`);

    } catch (error) {
        console.error("投票失敗: ", error);
        // 失敗時顯示錯誤訊息
        showPopup("投票失敗，請檢查連線或 Firebase 設定。"); 
    } finally {
        // 重新啟用所有按鈕
        document.querySelectorAll('.vote-button').forEach(btn => btn.disabled = false);
    }
}

/**
 * 渲染投票結果到網頁上 (加入結果項目淡入動畫延遲)
 */
function renderResults(votesData) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; 
    
    const combinedResults = characters.map(char => ({
        name: char.name,
        count: votesData[char.id] ? votesData[char.id].count : 0
    }));

    const totalVotes = combinedResults.reduce((sum, item) => sum + item.count, 0);

    const sortedResults = combinedResults
        .map(item => ({
            ...item,
            percentage: totalVotes > 0 ? (item.count / totalVotes) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

    sortedResults.forEach((item, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        // 動態設定動畫延遲
        resultItem.style.animationDelay = `${index * 0.1}s`;
        
        resultItem.innerHTML = `
            <span class="result-name">${item.name}</span>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${item.percentage}%;"></div>
            </div>
            <span class="result-count">${item.count} 票 (${item.percentage.toFixed(1)}%)</span>
        `;
        resultsList.appendChild(resultItem);
    });
}

/**
 * 使用 Firestore 即時監聽投票數據
 */
function setupRealtimeListener() {
    db.collection(VOTES_COLLECTION).onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added" || change.type === "modified") {
                const data = change.doc.data();
                currentVotes[change.doc.id] = { count: data.count, name: data.name };
            }
        });
        renderResults(currentVotes);
    }, (error) => {
        console.error("即時監聽失敗:", error);
    });
}

// 5. 網頁啟動時的主要執行函數
document.addEventListener('DOMContentLoaded', () => {
    // 渲染投票卡片
    renderCards();     

    // 啟動 Firestore 即時監聽
    setupRealtimeListener();
});

// 使用 window.load 來確保頁面完全載入後移除 is-loading 類別
window.addEventListener("load", function () {
    document.body.classList.remove("is-loading");
});
