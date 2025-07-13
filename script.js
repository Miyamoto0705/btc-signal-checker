
async function fetchPrice() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=jpy");
        const data = await response.json();
        const price = data.bitcoin.jpy;
        document.getElementById("price").textContent = price.toLocaleString();
        return price;
    } catch (error) {
        document.getElementById("price").textContent = "取得エラー";
        return null;
    }
}

async function checkSignal() {
    const currentPrice = await fetchPrice();
    const buyPrice = parseFloat(document.getElementById("buyPrice").value);
    const resultEl = document.getElementById("result");
    const aiCommentEl = document.getElementById("aiComment");

    if (isNaN(buyPrice) || currentPrice === null) {
        resultEl.textContent = "有効な購入価格を入力してください。";
        return;
    }

    const change = ((currentPrice - buyPrice) / buyPrice) * 100;
    let signal = "";
    let comment = "";

    if (change >= 5) {
        signal = "✅ 売り時かもしれません（+" + change.toFixed(2) + "%）";
        comment = "過去の傾向から見て、短期的な利益確定の好機かもしれません。";
    } else if (change <= -3) {
        signal = "📉 買い増しのチャンスかもしれません（" + change.toFixed(2) + "%）";
        comment = "一時的な下落傾向が見られ、反発の可能性もあります。";
    } else {
        signal = "⏸ 様子見が無難かもしれません（" + change.toFixed(2) + "%）";
        comment = "大きな変動は見られず、もう少し様子を見てもよいかもしれません。";
    }

    resultEl.textContent = signal;
    aiCommentEl.textContent = "💬 AIコメント: " + comment;
}

// 初期化
fetchPrice();