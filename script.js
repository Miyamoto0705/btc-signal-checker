
const priceEl = document.getElementById("btc-price");
let currentPrice = null;

// CoinGecko APIでリアルタイム価格取得
async function fetchPrice() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=jpy");
    const data = await res.json();
    currentPrice = data.bitcoin.jpy;
    priceEl.textContent = currentPrice.toLocaleString() + " 円";
  } catch (err) {
    priceEl.textContent = "取得失敗";
  }
}

// 売買判定
function judge() {
  const buyPrice = Number(document.getElementById("buy-price").value);
  const resultEl = document.getElementById("result");
  if (!buyPrice || !currentPrice) {
    resultEl.textContent = "価格情報を取得できませんでした。";
    return;
  }
  const diff = ((currentPrice - buyPrice) / buyPrice) * 100;
  if (diff >= 5) {
    resultEl.textContent = `✅ 今は売り時！ 利益率：+${diff.toFixed(2)}%`;
  } else if (diff <= -3) {
    resultEl.textContent = `📉 下がっています（${diff.toFixed(2)}%） 買い増しを検討？`;
  } else {
    resultEl.textContent = `😐 様子見がおすすめ（差：${diff.toFixed(2)}%）`;
  }
}

// グラフ描画
async function drawChart() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=jpy&days=1");
    const data = await res.json();
    const labels = data.prices.map(p => new Date(p[0]).toLocaleTimeString());
    const prices = data.prices.map(p => p[1]);

    const ctx = document.getElementById("btcChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "BTC価格推移（24時間）",
          data: prices,
          borderColor: "#ff9900",
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 10
            }
          }
        }
      }
    });
  } catch (err) {
    console.error("グラフ取得失敗", err);
  }
}

fetchPrice();
drawChart();
setInterval(fetchPrice, 60000); // 1分ごとに更新