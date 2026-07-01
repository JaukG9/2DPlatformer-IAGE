const BL = '#185FA5', TL = '#1D9E75', CO = '#D85A30', PU = '#534AB7', AM = '#BA7517';
const BLA = 'rgba(24,95,165,0.38)', TLA = 'rgba(29,158,117,0.38)', COA = 'rgba(216,90,48,0.38)';
const PUA = 'rgba(83,74,183,0.38)', AMA = 'rgba(186,117,23,0.38)';
const GY = '#B4B2A9', GR = 'rgba(136,135,128,0.15)', TS = '#888780';
const LVLS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
const IL = ['Low', 'Moderate', 'High'];

// Tab navigation
document.getElementById('nav').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById('tab-' + e.target.dataset.tab).classList.add('active');
});

const sc = (yMin, yMax) => ({
    x: { grid: { display: false }, ticks: { color: TS, font: { size: 11 } } },
    y: { min: yMin, max: yMax, grid: { color: GR }, ticks: { color: TS, font: { size: 11 } } }
});

const bp = (id, labels, data, cols, yMin, yMax, suf = '') => {
    new Chart(document.getElementById(id), {
        type: 'bar',
        data: { labels, datasets: [{ data, backgroundColor: cols, borderRadius: 4, maxBarThickness: 55 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: c => ' ' + c.parsed.y.toFixed(2) + (suf ? ' ' + suf : '') } }
            },
            scales: sc(yMin, yMax)
        }
    });
};

const ln = (id, labels, datasets, yMin, yMax, suf = '') => {
    new Chart(document.getElementById(id), {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: c => ' ' + c.dataset.label + ': ' + c.parsed.y.toFixed(2) + (suf ? ' ' + suf : '') } }
            },
            elements: { point: { radius: 4, hoverRadius: 6 }, line: { tension: 0.2 } },
            scales: sc(yMin, yMax)
        }
    });
};

const grp = (id, labels, datasets, yMin, yMax) => {
    new Chart(document.getElementById(id), {
        type: 'bar',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: c => ' ' + c.dataset.label + ': ' + c.parsed.y.toFixed(2) } }
            },
            scales: sc(yMin, yMax)
        }
    });
};

const stk = (id, labels, datasets) => {
    new Chart(document.getElementById(id), {
        type: 'bar',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: c => ' ' + c.dataset.label + ': ' + c.parsed.y.toFixed(1) + '%' } }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: TS, font: { size: 11 } }, stacked: true },
                y: { grid: { color: GR }, ticks: { color: TS, font: { size: 11 }, callback: v => v + '%' }, stacked: true, max: 100 }
            }
        }
    });
};

const ds = (l, d, c) => ({ label: l, data: d, backgroundColor: c, borderColor: c, borderRadius: 4, maxBarThickness: 48, fill: false, pointBackgroundColor: c });

// Stats pulled in from analysis_summary.csv
const STATS_CSV = 'Data_Analysis/analysis_summary.csv';

function parseStatsCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    const byKey = {};
    lines.slice(1).forEach(line => {
        const cells = line.match(/(".*?"|[^,]+)(?=,|$)/g).map(c => c.replace(/^"|"$/g, ''));
        const [Section, Variable, Test, Effect, Stat, DF, p, Sig, N, Removed] = cells;
        byKey[Variable + '|' + Effect] = { Section, Test, Effect, Stat: +Stat, DF, p: +p, Sig, N: +N, Removed: +Removed };
    });
    return byKey;
}

function fmtStat(row) {
    const statStr = (row.Stat < 0 ? '−' : '') + Math.abs(row.Stat).toFixed(3);
    const head = row.Test === 'Chi-square' ? `χ²(${row.DF})=${statStr}`
        : row.Test === 'Welch t-test' ? `t(${row.DF})=${statStr}`
        : `F(${row.DF})=${statStr}`;
    const cls = row.Sig === '*' ? 'sig' : row.Sig === '†' ? 'marg' : 'ns';
    return { text: `${head}, p=${row.p.toFixed(3)} ${row.Sig}`, cls };
}

function applyStats(stats) {
    document.querySelectorAll('[data-stat]').forEach(el => {
        const row = stats[el.dataset.stat];
        if (!row) return;
        const { text, cls } = fmtStat(row);
        el.textContent = (el.dataset.prefix || '') + text + (el.dataset.suffix || '');
        el.className = el.className.replace(/\b(sig|marg|ns)\b/, cls);
    });
}

fetch(STATS_CSV)
    .then(r => r.ok ? r.text() : Promise.reject(r.status))
    .then(text => applyStats(parseStatsCsv(text)))
    .catch(err => console.warn('Could not load', STATS_CSV, '— badges are showing their fallback values.', err));

// Overview tab
bp('ov_comp', ['Low', 'Moderate', 'High'], [60, 51.4, 28.6], [BL, TL, CO], 0, 80, '%');
grp('ov_adapt', ['Enjoyment', 'Engagement', 'Clarity'], [
    ds('No adapt.', [3.54, 3.87, 3.85], PU),
    ds('With adapt.', [3.10, 3.41, 3.38], AM)
], 2.0, 4.5);

// Survey composites
bp('s_enj_i', IL, [3.467, 3.523, 3.024], [BL, TL, CO], 2.0, 4.5);
bp('s_eng_i', IL, [3.920, 3.730, 3.375], [BL, TL, CO], 2.0, 4.5);
bp('s_scaf_i', IL, [3.928, 3.605, 3.464], [BL, TL, CO], 2.0, 4.5);
bp('s_enj_a', ['No adaptability', 'With adaptability'], [3.538, 3.096], [PU, AM], 2.0, 4.5);
bp('s_eng_a', ['No adaptability', 'With adaptability'], [3.865, 3.408], [PU, AM], 2.0, 4.5);
bp('s_scaf_a', ['No adaptability', 'With adaptability'], [3.846, 3.384], [PU, AM], 2.0, 4.5);

// All 10 items
const iLbls = ['Felt engaged', 'Want to continue', 'Paid attention', 'Enjoyed', 'Play again', 'Easy to figure out', 'Appropriate challenge', 'Levels helped', 'Levels prepared', 'Felt confident'];
new Chart(document.getElementById('items_i'), {
    type: 'bar',
    data: {
        labels: iLbls,
        datasets: [
            { label: 'Low', data: [4.08, 3.28, 3.76, 3.92, 3.20, 3.92, 3.76, 4.12, 4.20, 3.64], backgroundColor: BL, borderRadius: 3, maxBarThickness: 16 },
            { label: 'Moderate', data: [3.919, 3.514, 3.541, 3.703, 3.351, 3.351, 3.351, 3.919, 3.730, 3.676], backgroundColor: TL, borderRadius: 3, maxBarThickness: 16 },
            { label: 'High', data: [3.536, 2.786, 3.214, 3.321, 2.964, 3.286, 3.321, 3.786, 3.679, 3.250], backgroundColor: CO, borderRadius: 3, maxBarThickness: 16 }
        ]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { min: 1, max: 5, grid: { color: GR }, ticks: { color: TS, font: { size: 11 } } },
            y: { grid: { display: false }, ticks: { color: TS, font: { size: 10 } } }
        }
    }
});
new Chart(document.getElementById('items_a'), {
    type: 'bar',
    data: {
        labels: iLbls,
        datasets: [
            { label: 'No adaptability', data: [4.019, 3.423, 3.712, 3.808, 3.385, 3.615, 3.750, 4.077, 4.058, 3.731], backgroundColor: PU, borderRadius: 3, maxBarThickness: 20 },
            { label: 'With adaptability', data: [3.605, 2.947, 3.211, 3.421, 2.921, 3.316, 3.053, 3.737, 3.553, 3.263], backgroundColor: AM, borderRadius: 3, maxBarThickness: 20 }
        ]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { min: 1, max: 5, grid: { color: GR }, ticks: { color: TS, font: { size: 11 } } },
            y: { grid: { display: false }, ticks: { color: TS, font: { size: 10 } } }
        }
    }
});

// Performance
bp('p_st_i', IL, [0.880, 1.297, 1.143], [BL, TL, CO], 0, 2.0);
bp('p_st_a', ['No adaptability', 'With adaptability'], [1.269, 0.947], [PU, AM], 0, 2.0);
new Chart(document.getElementById('p_d_i'), {
    type: 'bar',
    data: {
        labels: IL,
        datasets: [
            { label: 'Before', data: [10.28, 14.46, 7.07], backgroundColor: [BL, TL, CO], borderRadius: 4, maxBarThickness: 26 },
            { label: 'After', data: [9.04, 7.07, 7.07], backgroundColor: [BLA, TLA, COA], borderRadius: 4, maxBarThickness: 26 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: sc(0, 18) }
});
new Chart(document.getElementById('p_d_a'), {
    type: 'bar',
    data: {
        labels: ['No adaptability', 'With adaptability'],
        datasets: [
            { label: 'Before', data: [11.35, 10.53], backgroundColor: [PU, AM], borderRadius: 4, maxBarThickness: 30 },
            { label: 'After', data: [6.94, 8.56], backgroundColor: [PUA, AMA], borderRadius: 4, maxBarThickness: 30 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: sc(0, 16) }
});
new Chart(document.getElementById('p_t_i'), {
    type: 'bar',
    data: {
        labels: IL,
        datasets: [
            { label: 'Before', data: [518, 577, 242], backgroundColor: [BL, TL, CO], borderRadius: 4, maxBarThickness: 26 },
            { label: 'After', data: [278, 231, 213], backgroundColor: [BLA, TLA, COA], borderRadius: 4, maxBarThickness: 26 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: sc(0, 700) }
});
new Chart(document.getElementById('p_t_a'), {
    type: 'bar',
    data: {
        labels: ['No adaptability', 'With adaptability'],
        datasets: [
            { label: 'Before', data: [418, 509], backgroundColor: [PU, AM], borderRadius: 4, maxBarThickness: 30 },
            { label: 'After', data: [248, 224], backgroundColor: [PUA, AMA], borderRadius: 4, maxBarThickness: 30 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: sc(0, 700) }
});
new Chart(document.getElementById('p_b_i'), {
    type: 'bar',
    data: {
        labels: IL,
        datasets: [
            { label: 'Before', data: [1.769, 1.867, 1.871], backgroundColor: [BL, TL, CO], borderRadius: 4, maxBarThickness: 26 },
            { label: 'After', data: [1.769, 1.738, 1.783], backgroundColor: [BLA, TLA, COA], borderRadius: 4, maxBarThickness: 26 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: sc(1.4, 2.2) }
});
new Chart(document.getElementById('p_b_a'), {
    type: 'bar',
    data: {
        labels: ['No adaptability', 'With adaptability'],
        datasets: [
            { label: 'Before', data: [1.863, 1.811], backgroundColor: [PU, AM], borderRadius: 4, maxBarThickness: 30 },
            { label: 'After', data: [1.814, 1.685], backgroundColor: [PUA, AMA], borderRadius: 4, maxBarThickness: 30 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: sc(1.4, 2.2) }
});

// Per-level
ln('l_ti_i', LVLS, [
    { label: 'Low', data: [38.72, 6.85, 5.13, 29.28, 20.90, 51.82, 96.25], borderColor: BL, pointBackgroundColor: BL, fill: false },
    { label: 'Moderate', data: [37.95, 7.47, 5.03, 23.47, 19.41, 28.88, 49.53], borderColor: TL, pointBackgroundColor: TL, fill: false },
    { label: 'High', data: [43.22, 10.39, 5.64, 27.23, 16.94, 32.63, 37.23], borderColor: CO, pointBackgroundColor: CO, fill: false }
], 0, 120, 's');
ln('l_ti_a', LVLS, [
    { label: 'No adapt.', data: [40.30, 8.00, 5.18, 27.00, 18.88, 42.19, 51.66], borderColor: PU, pointBackgroundColor: PU, fill: false },
    { label: 'With adapt.', data: [39.29, 8.40, 5.29, 25.40, 19.30, 29.22, 66.13], borderColor: AM, pointBackgroundColor: AM, fill: false }
], 0, 120, 's');
ln('l_bp_i', LVLS, [
    { label: 'Low', data: [0.180, 2.645, 1.759, 3.503, 1.969, 2.319, 2.599], borderColor: BL, pointBackgroundColor: BL, fill: false },
    { label: 'Moderate', data: [0.186, 2.739, 1.868, 3.371, 2.021, 2.628, 2.584], borderColor: TL, pointBackgroundColor: TL, fill: false },
    { label: 'High', data: [0.244, 2.753, 2.209, 3.049, 1.920, 2.450, 2.554], borderColor: CO, pointBackgroundColor: CO, fill: false }
], 0, 4.5, 'BPS');
ln('l_bp_a', LVLS, [
    { label: 'No adapt.', data: [0.192, 2.639, 1.899, 3.443, 1.968, 2.440, 2.674], borderColor: PU, pointBackgroundColor: PU, fill: false },
    { label: 'With adapt.', data: [0.212, 2.824, 1.989, 3.154, 1.988, 2.560, 2.427], borderColor: AM, pointBackgroundColor: AM, fill: false }
], 0, 4.5, 'BPS');
new Chart(document.getElementById('l_n'), {
    type: 'bar',
    data: { labels: LVLS, datasets: [{ label: 'N', data: [90, 83, 80, 77, 72, 65, 44], backgroundColor: BL, borderRadius: 4, maxBarThickness: 36 }] },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ' N = ' + c.parsed.y } } },
        scales: sc(0, 95)
    }
});

// Completion
stk('c_i', IL, [
    { label: 'Completed', data: [60, 51.4, 28.6], backgroundColor: BL, borderRadius: 4, maxBarThickness: 55 },
    { label: 'Did not', data: [40, 48.6, 71.4], backgroundColor: GY, borderRadius: 4, maxBarThickness: 55 }
]);
stk('c_a', ['No adaptability', 'With adaptability'], [
    { label: 'Completed', data: [51.9, 39.5], backgroundColor: PU, borderRadius: 4, maxBarThickness: 65 },
    { label: 'Did not', data: [48.1, 60.5], backgroundColor: GY, borderRadius: 4, maxBarThickness: 65 }
]);
grp('c_int', ['Low implicitness', 'Moderate implicitness', 'High implicitness'], [
    ds('No adapt.', [56.2, 60.0, 37.5], PU),
    ds('With adapt.', [66.7, 41.2, 16.7], AM)
], 0, 80, '%');

// Interaction tab
grp('int_bar', IL, [
    ds('No adapt.', [2.854, 3.917, 3.750], PU),
    ds('With adapt.', [3.250, 3.059, 2.963], AM)
], 2.0, 4.5);
ln('int_line', IL, [
    { label: 'No adapt.', data: [2.854, 3.917, 3.750], borderColor: PU, pointBackgroundColor: PU, fill: false },
    { label: 'With adapt.', data: [3.250, 3.059, 2.963], borderColor: AM, pointBackgroundColor: AM, fill: false }
], 2.0, 4.5);
ln('int_eng', IL, [
    { label: 'No adapt.', data: [3.438, 4.075, 4.031], borderColor: PU, pointBackgroundColor: PU, fill: false },
    { label: 'With adapt.', data: [3.292, 3.324, 3.722], borderColor: AM, pointBackgroundColor: AM, fill: false }
], 2.5, 4.5);
ln('int_scaf', IL, [
    { label: 'No adapt.', data: [3.588, 3.960, 3.962], borderColor: PU, pointBackgroundColor: PU, fill: false },
    { label: 'With adapt.', data: [3.300, 3.188, 3.867], borderColor: AM, pointBackgroundColor: AM, fill: false }
], 2.5, 4.5);

// Demographics
const gCols = [BL, CO, GY];
const grCols = [BL, TL, CO, PU];
bp('d_ge_enj', ['Male', 'Female', 'Other'], [3.558, 3.067, 3.333], gCols, 2.0, 4.5);
bp('d_ge_eng', ['Male', 'Female', 'Other'], [3.908, 3.329, 3.750], gCols, 2.0, 4.5);
bp('d_ge_scaf', ['Male', 'Female', 'Other'], [3.902, 3.280, 3.767], gCols, 2.0, 4.5);
bp('d_ge_comp', ['Male', 'Female', 'Other'], [61.2, 22.9, 66.7], gCols, 0, 80, '%');
bp('d_ge_stars', ['Male', 'Female', 'Other'], [1.286, 1.000, 0.667], gCols, 0, 2.0);
bp('d_gr_deaths', ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'], [8.47, 5.67, 6.38, 13.92], grCols, 0, 18);
bp('d_gr_time', ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'], [265, 201, 204, 341], grCols, 0, 400, 's');
bp('d_gr_enj', ['Gr 9', 'Gr 10', 'Gr 11', 'Gr 12'], [3.519, 3.289, 3.295, 3.375], grCols, 2.0, 4.5);
bp('d_gr_eng', ['Gr 9', 'Gr 10', 'Gr 11', 'Gr 12'], [3.889, 3.500, 3.615, 3.844], grCols, 2.0, 4.5);
bp('d_gr_comp', ['Gr 9', 'Gr 10', 'Gr 11', 'Gr 12'], [61.1, 33.3, 53.8, 43.8], grCols, 0, 80, '%');
bp('d_age_deaths', ['Age 14', 'Age 15', 'Age 16', 'Age 17', 'Age 18'], [11.29, 5.64, 5.50, 11.50, 10.86], [BL, TL, CO, PU, GY], 0, 16);
grp('d_age_subj', ['Age 14', 'Age 15', 'Age 16', 'Age 17', 'Age 18'], [
    { label: 'Enjoyment', data: [3.810, 3.385, 3.267, 3.133, 3.762], backgroundColor: BL, borderRadius: 4, maxBarThickness: 28 },
    { label: 'Engagement', data: [4.071, 3.615, 3.500, 3.775, 3.929], backgroundColor: TL, borderRadius: 4, maxBarThickness: 28 }
], 2.0, 4.5);