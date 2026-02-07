let workloadChartInstance = null;
let confidenceChartInstance = null;


// =============================
// SUBJECT UI MANAGEMENT
// =============================

const subjectsContainer =
document.getElementById("subjectsContainer");

function addSubject() {

    const row = document.createElement("div");
    row.className = "subjectRow";

    row.innerHTML = `
        <input class="subName" placeholder="Subject Name">

        <input type="number" class="credits"
        placeholder="Credits">

        <label>Weak Topics</label>
        <input class="weakTopics"
        placeholder="e.g. Trees, Graphs">

        <label>Strong Topics</label>
        <input class="strongTopics"
        placeholder="e.g. Arrays">

        <label>Confidence (1–5)</label>
        <input type="number"
        class="confidence"
        min="1" max="5">
    `;

    subjectsContainer.appendChild(row);
}


// =============================
// FORM SUBMISSION
// =============================

document.getElementById("plannerForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const weekdayHours =
        parseFloat(document.getElementById("weekdayHours").value || 0);

    const weekendHours =
        parseFloat(document.getElementById("weekendHours").value || 0);

    const totalWeeklyHours =
        weekdayHours * 5 + weekendHours * 2;

    const subjects = collectSubjects();

    calculatePriorities(subjects);
    allocateStudyHours(subjects, totalWeeklyHours);

    const deadlineInfo =
        analyzeDeadline(totalWeeklyHours);

    renderPlanner(subjects, totalWeeklyHours, deadlineInfo);

});


// =============================
// DATA COLLECTION
// =============================

function collectSubjects() {

    const subjects = [];

    document.querySelectorAll(".subjectRow")
    .forEach(row => {

        subjects.push({
            name: row.querySelector(".subName").value || "Subject",
            credits: parseFloat(row.querySelector(".credits").value || 1),
            confidence: parseFloat(row.querySelector(".confidence").value || 3),
            weak: row.querySelector(".weakTopics").value,
            strong: row.querySelector(".strongTopics").value,
            priority: 0,
            hours: 0
        });

    });

    return subjects;
}


// =============================
// PRIORITY ENGINE
// =============================

function calculatePriorities(subjects) {

    subjects.forEach(s => {

        s.priority =
            (s.credits * 2) +
            (6 - s.confidence);

    });

}


// =============================
// HOUR ALLOCATION
// =============================

function allocateStudyHours(subjects, totalHours) {

    const totalPriority =
        subjects.reduce((sum, s) => sum + s.priority, 0);

    subjects.forEach(s => {

        s.hours =
            ((s.priority / totalPriority) * totalHours)
            .toFixed(1);

    });

}


// =============================
// DEADLINE INTELLIGENCE
// =============================

function analyzeDeadline(totalWeeklyHours) {

    const dateInput =
        document.getElementById("targetDate").value;

    if (!dateInput) return null;

    const today = new Date();
    const target = new Date(dateInput);

    const diff = target - today;

    const daysRemaining =
        Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) return null;

    const totalAvailable =
        (totalWeeklyHours / 7) * daysRemaining;

    const dailyPace =
        (totalAvailable / daysRemaining).toFixed(1);

    let urgency = "✅ Comfortable pacing.";

    if (dailyPace > 6)
        urgency = "⚠ High workload expected!";
    else if (dailyPace > 4)
        urgency = "🔥 Moderate pressure — stay consistent.";

    return {
        daysRemaining,
        totalAvailable: totalAvailable.toFixed(1),
        dailyPace,
        urgency
    };
}


// =============================
// OUTCOME SUMMARY ENGINE
// =============================

function generateOutcomeSummary(subjects, deadlineInfo) {

    let summary = [];

    if (deadlineInfo) {

        if (deadlineInfo.dailyPace <= 4)
            summary.push("✅ Deadline comfortably achievable.");
        else if (deadlineInfo.dailyPace <= 6)
            summary.push("⚠ Deadline achievable with discipline.");
        else
            summary.push("🚨 Risk of overload — adjust timeline.");
    }

    if (subjects.some(s => s.confidence <= 2))
        summary.push("🔥 Weak subjects prioritized early.");

    if (subjects.length > 1)
        summary.push("⚖ Balanced workload across subjects.");

    summary.push(
        "📈 Confidence improvement expected with consistency."
    );

    return summary;
}


// =============================
// AI PROGRESS SIMULATION ENGINE (AUTOMATED)
// =============================

function simulateProgress(subjects) {

    const progress = [];

    subjects.forEach(s => {

        let base = s.confidence;

        // Normalize influence factors
        const priorityFactor = s.priority / 10;
        const hourFactor = parseFloat(s.hours) / 10;

        // AI growth model
        let growth1 =
            (1.2 * priorityFactor) +
            (1.0 * hourFactor);

        let growth2 =
            (0.9 * priorityFactor) +
            (0.7 * hourFactor);

        let growth3 =
            (0.6 * priorityFactor) +
            (0.5 * hourFactor);

        // Weak subjects grow faster initially
        if (base <= 2) growth1 += 0.5;

        // Strong subjects plateau
        if (base >= 4) growth2 *= 0.6;

        const w1 = Math.min(base + growth1, 5);
        const w2 = Math.min(w1 + growth2, 5);
        const w3 = Math.min(w2 + growth3, 5);

        progress.push({
            subject: s.name,
            w1: w1.toFixed(1),
            w2: w2.toFixed(1),
            w3: w3.toFixed(1)
        });

    });

    return progress;
}


// =============================
// PRIORITIZATION EXPLANATION
// =============================

function explainPriorities(subjects) {

    const explanations = [];

    subjects.forEach(s => {

        let reasons = [];

        if (s.credits >= 4)
            reasons.push("high credit weight");

        if (s.confidence <= 2)
            reasons.push("low confidence");

        if (reasons.length === 0)
            reasons.push("balanced workload");

        explanations.push({
            subject: s.name,
            reason: reasons.join(", ")
        });

    });

    return explanations;
}


// =============================
// AI ADAPTIVE REBALANCING
// =============================

function adaptiveSuggestions(subjects) {

    const suggestions = [];

    subjects.forEach(s => {

        if (s.confidence <= 2) {

            suggestions.push(
                `Increase study time for ${s.name} to strengthen weak foundations.`
            );

        } else if (s.confidence >= 4) {

            suggestions.push(
                `Slightly reduce time for ${s.name} — performance is stable.`
            );

        } else {

            suggestions.push(
                `Maintain current allocation for ${s.name}.`
            );
        }

    });

    return suggestions;
}


// =============================
// AI DECISION SUMMARY
// =============================

function generateAISummary(subjects, deadlineInfo, totalHours) {

    const weakCount =
        subjects.filter(s => s.confidence <= 2).length;

    let summary = `
    AI analyzed ${subjects.length} subjects,
    total weekly availability of ${totalHours} hours,
    and student confidence levels.
    `;

    if (weakCount > 0)
        summary += `
        Weak subjects were prioritized early to
        build strong foundations.
        `;

    if (deadlineInfo)
        summary += `
        Deadline pacing was optimized to ensure
        achievable progress.
        `;

    summary += `
    Workload distribution balances performance,
    retention, and cognitive efficiency.
    `;

    return summary;
}


// =============================
// OUTPUT RENDERING
// =============================

function renderPlanner(subjects, totalHours, deadlineInfo) {

    const days = [
        "Monday","Tuesday","Wednesday",
        "Thursday","Friday","Saturday","Sunday"
    ];

    let html = `
        <h2>🤖 AI Decision Summary</h2>
        <div class="deadline-box">
            ${generateAISummary(subjects, deadlineInfo, totalHours)}
        </div>

        <h2>📊 Weekly Allocation</h2>
        <p><b>Total Study Hours:</b> ${totalHours}</p>
    <ul>`;


    subjects.forEach(s => {
        html += `<li><b>${s.name}</b> → ${s.hours} hrs/week</li>`;
    });

    html += `</ul>`;


    // Deadline panel

    if (deadlineInfo) {

        html += `
        <h2>⏳ Deadline Intelligence</h2>
        <div class="deadline-box">
            <p><b>Days Remaining:</b> ${deadlineInfo.daysRemaining}</p>
            <p><b>Total Available Hours:</b> ${deadlineInfo.totalAvailable}</p>
            <p><b>Recommended Pace:</b> ${deadlineInfo.dailyPace} hrs/day</p>
            <p>${deadlineInfo.urgency}</p>
        </div>`;
    }


    // Weekly grid

    html += `<h2>🗓 Weekly Plan</h2>
    <div class="plannerGrid">`;

    let index = 0;

    days.forEach(day => {

        const s = subjects[index];

        let color = "#22c55e";
        if (s.priority >= 10) color = "#ef4444";
        else if (s.priority >= 7) color = "#facc15";

        html += `
        <div class="dayCard"
        style="border-left:8px solid ${color}">
            <h3>${day}</h3>
            <p>${s.name}</p>
        </div>`;

        index = (index + 1) % subjects.length;

    });

    html += `</div>`;


    // Smart insights

    html += `<h2>🧠 Smart Insights</h2>`;

    subjects.forEach(s => {

        if (s.confidence <= 2)
            html += `<div class="insight-box">⚠ Focus early on ${s.name}</div>`;

        if (s.weak)
            html += `<div class="insight-box">🔍 Revise ${s.weak}</div>`;

        if (s.strong)
            html += `<div class="insight-box">✅ Maintain strengths: ${s.strong}</div>`;
    });


    // Outcome summary

    html += `<h2>📊 Outcome Summary</h2>`;

    generateOutcomeSummary(subjects, deadlineInfo)
    .forEach(point => {
        html += `<div class="insight-box">${point}</div>`;
    });


    // Progress simulation

    html += `<h2>📈 Progress Simulation</h2>`;

    simulateProgress(subjects)
    .forEach(p => {

        html += `
        <div class="insight-box">
            <b>${p.subject}</b><br>
            Week 1 → ${p.w1}<br>
            Week 2 → ${p.w2}<br>
            Week 3 → ${p.w3}
        </div>`;
    });


    // ================= AI PRIORITY EXPLANATION =================

    html += `<h2>🧠 AI Prioritization Logic</h2>`;

    explainPriorities(subjects).forEach(e => {

        html += `
            <div class="insight-box">
                <b>${e.subject}</b> prioritized due to:
                ${e.reason}
            </div>
        `;
    });


    html += `
        <h2>📊 Workload Chart</h2>
        <canvas id="workloadChart"></canvas>
    `;

    html += `
    <h2>📈 Confidence Growth Chart</h2>
    <canvas id="confidenceChart"></canvas>
    `;


    // ================= AI ADAPTIVE SUGGESTIONS =================

    html += `<h2>🤖 AI Adaptive Suggestions</h2>`;

    adaptiveSuggestions(subjects)
    .forEach(s => {

        html += `
            <div class="insight-box">
            ${s}
            </div>
        `;
    });


    document.getElementById("output").innerHTML = html;

    requestAnimationFrame(() => {

        renderWorkloadChart(subjects);
        renderConfidenceChart(subjects);

    });

}


// =============================
// WORKLOAD CHART (IMPROVED)
// =============================

function renderWorkloadChart(subjects) {

    const canvas = document.getElementById("workloadChart");
    if (!canvas) return;

    if (workloadChartInstance)
        workloadChartInstance.destroy();

    const isLight =
        document.body.classList.contains("light-mode");

    const textColor = isLight ? "#111827" : "#f9fafb";
    const gridColor = isLight ? "#dbe2f1" : "#374151";

    workloadChartInstance = new Chart(canvas, {

        type: "bar",

        data: {
            labels: subjects.map(s => s.name),

            datasets: [{
                label: "Weekly Study Hours",
                data: subjects.map(s => parseFloat(s.hours)),
                backgroundColor: "#60a5fa",
                borderRadius: 8,
                maxBarThickness: 80
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 10
                }
            },

            plugins: {
                legend: {
                    labels: { 
                        color: textColor,
                        font: {
                            size: 15,
                            weight: '600',
                            family: "'Inter', sans-serif"
                        },
                        padding: 15
                    }
                }
            },

            scales: {

                x: {
                    ticks: { 
                        color: textColor,
                        font: {
                            size: 14,
                            weight: '500',
                            family: "'Inter', sans-serif"
                        },
                        padding: 5
                    },
                    grid: { 
                        color: gridColor,
                        display: false
                    }
                },

                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        padding: 10,
                        font: {
                            size: 14,
                            weight: '500',
                            family: "'Inter', sans-serif"
                        }
                    },
                    grid: { 
                        color: gridColor,
                        lineWidth: 1
                    }
                }
            }
        }
    });
}


// =============================
// CONFIDENCE TREND CHART (IMPROVED)
// =============================

function renderConfidenceChart(subjects) {

    const canvas = document.getElementById("confidenceChart");
    if (!canvas) return;

    if (confidenceChartInstance)
        confidenceChartInstance.destroy();

    const isLight =
        document.body.classList.contains("light-mode");

    const textColor = isLight ? "#111827" : "#f9fafb";
    const gridColor = isLight ? "#dbe2f1" : "#374151";

    const colors = ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c'];

    const datasets = subjects.map((s, idx) => {

        const base = s.confidence;

        return {
            label: s.name,
            data: [
                base,
                Math.min(base + 1, 5),
                Math.min(base + 2, 5)
            ],
            tension: 0.3,
            borderColor: colors[idx % colors.length],
            backgroundColor: colors[idx % colors.length] + '33',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: colors[idx % colors.length],
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        };
    });

    confidenceChartInstance = new Chart(canvas, {

        type: "line",

        data: {
            labels: ["Week 1", "Week 2", "Week 3"],
            datasets
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 10
                }
            },

            plugins: {
                legend: {
                    labels: { 
                        color: textColor,
                        font: {
                            size: 14,
                            weight: '600',
                            family: "'Inter', sans-serif"
                        },
                        padding: 12,
                        usePointStyle: true
                    }
                }
            },

            scales: {

                x: {
                    ticks: { 
                        color: textColor,
                        font: {
                            size: 14,
                            weight: '500',
                            family: "'Inter', sans-serif"
                        },
                        padding: 5
                    },
                    grid: { 
                        color: gridColor,
                        display: false
                    }
                },

                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        color: textColor,
                        padding: 10,
                        font: {
                            size: 14,
                            weight: '500',
                            family: "'Inter', sans-serif"
                        },
                        stepSize: 1
                    },
                    grid: { 
                        color: gridColor,
                        lineWidth: 1
                    }
                }
            }
        }
    });
}


// =============================
// THEME TOGGLE
// =============================

const toggleBtn =
document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light")
document.body.classList.add("light-mode");

toggleBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light-mode")
        ? "light"
        : "dark"
    );

    // Refresh charts with new theme
    const subjects = collectSubjects();
    if (subjects.length > 0 && workloadChartInstance) {
        renderWorkloadChart(subjects);
        renderConfidenceChart(subjects);
    }

});