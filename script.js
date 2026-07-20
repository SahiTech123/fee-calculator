/*
============================================
PROJECT: Kikokotoo cha Makato Tanzania
VERSION: 1.0
CREATED: Julai 2026
DEVELOPER: [Jina Lako]
============================================
*/

// ============================================================
// KIKOKOTOO CHA MAKATO + USALAMA - TOLEO RAHISI
// ============================================================

// ============================================================
// DATA ZA MAKATO - TANZANIA
// ============================================================
const feeData = {
    'M-Pesa': {
        send: [
            { min: 0, max: 5000, fee: 0 },
            { min: 5001, max: 30000, fee: 350 },
            { min: 30001, max: 250000, fee: 850 },
            { min: 250001, max: 500000, fee: 1500 },
            { min: 500001, max: 1000000, fee: 2000 },
            { min: 1000001, max: 5000000, fee: 4000 },
        ],
        withdraw: [
            { min: 0, max: 5000, fee: 0 },
            { min: 5001, max: 10000, fee: 1450 },
            { min: 10001, max: 14999, fee: 1450 },
            { min: 15000, max: 30000, fee: 1800 },
            { min: 30001, max: 50000, fee: 2300 },
            { min: 50001, max: 100000, fee: 2800 },
            { min: 100001, max: 300000, fee: 4500 },
            { min: 300001, max: 500000, fee: 7000 },
        ]
    },
    'Mixx by Yas': {
        send: [
            { min: 0, max: 50000, fee: 200 },
            { min: 50001, max: 500000, fee: 500 },
            { min: 500001, max: 1000000, fee: 1000 },
            { min: 1000001, max: 5000000, fee: 2000 },
        ],
        withdraw: [
            { min: 0, max: 50000, fee: 300 },
            { min: 50001, max: 500000, fee: 800 },
            { min: 500001, max: 1000000, fee: 1500 },
            { min: 1000001, max: 5000000, fee: 2500 },
        ]
    },
    'Airtel Money': {
        send: [
            { min: 0, max: 2000, fee: 0 },
            { min: 2001, max: 2999, fee: 70 },
            { min: 3000, max: 3999, fee: 100 },
            { min: 4000, max: 5000, fee: 150 },
            { min: 5001, max: 10000, fee: 200 },
            { min: 10001, max: 20000, fee: 500 },
            { min: 20001, max: 29999, fee: 920 },
            { min: 30000, max: 100000, fee: 1200 },
        ],
        withdraw: [
            { min: 0, max: 10000, fee: 0 },
            { min: 10001, max: 20000, fee: 500 },
            { min: 20001, max: 30000, fee: 920 },
            { min: 30001, max: 100000, fee: 1200 },
            { min: 100001, max: 300000, fee: 4500 },
            { min: 300001, max: 500000, fee: 7000 },
        ]
    },
    'AzamPesa': {
        send: [
            { min: 0, max: 7000, fee: 122 },
            { min: 7001, max: 20000, fee: 350 },
            { min: 20001, max: 50000, fee: 600 },
            { min: 50001, max: 100000, fee: 1000 },
            { min: 100001, max: 500000, fee: 1900 },
        ],
        withdraw: [
            { min: 0, max: 7000, fee: 122 },
            { min: 7001, max: 20000, fee: 350 },
            { min: 20001, max: 50000, fee: 600 },
            { min: 50001, max: 100000, fee: 1000 },
            { min: 100001, max: 500000, fee: 1900 },
        ]
    },
    'Selcom Pesa': {
        send: [
            { min: 0, max: 5000000, fee: 1900 }
        ],
        withdraw: [
            { min: 0, max: 5000000, fee: 1900 }
        ]
    },
    'HaloPesa': {
        send: [
            { min: 0, max: 5000000, fee: 0 }
        ],
        withdraw: [
            { min: 0, max: 100000, fee: 500 },
            { min: 100001, max: 500000, fee: 1000 }
        ]
    }
};

// ============================================================
// KAZI ZA KUKOKOTOA
// ============================================================
function calculateFee(provider, type, amount) {
    const tiers = feeData[provider]?.[type];
    if (!tiers) return 0;
    for (const tier of tiers) {
        if (amount >= tier.min && amount <= tier.max) {
            return tier.fee;
        }
    }
    return tiers.length > 0 ? tiers[tiers.length - 1].fee : 0;
}

function formatFee(fee) {
    return 'TZS ' + fee.toLocaleString();
}

function getColorClass(provider) {
    const colors = {
        'M-Pesa': 'green',
        'Mixx by Yas': 'blue',
        'Airtel Money': 'orange',
        'AzamPesa': 'purple',
        'Selcom Pesa': 'teal',
        'HaloPesa': 'red'
    };
    return colors[provider] || 'gray';
}

// ============================================================
// SMART SPLIT
// ============================================================
function findBestSplit(amount, type, provider = 'M-Pesa') {
    const results = [];
    for (let i = 10000; i <= amount / 2; i += 5000) {
        const first = i;
        const second = amount - i;
        const fee1 = calculateFee(provider, type, first);
        const fee2 = calculateFee(provider, type, second);
        const total = fee1 + fee2;
        const original = calculateFee(provider, type, amount);
        if (total < original) {
            results.push({
                split: [first, second],
                totalFee: total,
                savings: original - total,
                originalFee: original
            });
        }
    }
    results.sort((a, b) => b.savings - a.savings);
    return results[0];
}
// ============================================================
// ONYESHA MATOKEO YA MAKATO
// ============================================================
function displayResults(amount, type) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) {
        console.error('❌ Element ya "results" haipatikani!');
        return;
    }

    const providers = Object.keys(feeData);
    const results = providers.map(provider => {
        const fee = calculateFee(provider, type, amount);
        return { provider, fee };
    });

    const minFee = Math.min(...results.map(r => r.fee));

    let html = `<h3 style="margin-bottom:15px;color:#1a2a3a;font-size:18px;">📊 Matokeo</h3>`;

    results.forEach(({ provider, fee }) => {
        const isBest = (fee === minFee && fee > 0);
        const feeClass = getColorClass(provider);
        const bestLabel = isBest ? `<span class="best-label">⭐ Nafuu</span>` : '';

        html += `
            <div class="result-card ${isBest ? 'best' : ''}">
                <span class="provider">${provider} ${bestLabel}</span>
                <span class="fee ${feeClass}">${formatFee(fee)}</span>
            </div>
        `;
    });

    resultsDiv.innerHTML = html;
}

    // Smart Split
    if (amount > 50000) {
        const bestSplit = findBestSplit(amount, type, 'M-Pesa');
        const originalFee = calculateFee('M-Pesa', type, amount);
        if (bestSplit && bestSplit.savings > 0) {
            const [part1, part2] = bestSplit.split;
            html += `
                <div class="split-tip">
                    <strong>💡 Kidokezo cha Smart Split</strong>
                    <div style="margin-top:8px;padding:10px;background:white;border-radius:8px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                            <span>Mara moja:</span>
                            <span style="color:#dc2626;font-weight:700;">${formatFee(originalFee)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                            <span>Gawanya TZS ${amount.toLocaleString()} → TZS ${part1.toLocaleString()} + TZS ${part2.toLocaleString()}:</span>
                            <span style="color:#16a34a;font-weight:700;">${formatFee(bestSplit.totalFee)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;border-top:2px solid #e2e8f0;padding-top:8px;margin-top:5px;">
                            <span style="font-size:16px;font-weight:700;">💰 UNAOKOA:</span>
                            <span style="color:#16a34a;font-size:18px;font-weight:700;">${formatFee(bestSplit.savings)}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    resultsDiv.innerHTML = html;
    console.log('✅ Matokeo yameonyeshwa!');


// ============================================================
// EVENT LISTENERS - KIKOKOTOO
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const amount = parseInt(document.getElementById('amount').value) || 0;
            const type = document.getElementById('type').value;
            if (amount < 1) {
                alert('Tafadhali ingiza kiasi sahihi.');
                return;
            }
            displayResults(amount, type);
        });
    }

    // Onyesha matokeo ya awali
    const amount = parseInt(document.getElementById('amount').value) || 10000;
    const type = document.getElementById('type').value || 'send';
    displayResults(amount, type);
});
