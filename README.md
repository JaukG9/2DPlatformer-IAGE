# Implicitness & Adaptability in Gamified Education

> A 3×2 between-subjects experiment examining how tutorial design affects engagement, enjoyment, scaffolding perception, and gameplay performance in a custom educational game.

---

## Overview

This repository contains the custom game, processing files, and analysis files for a study investigating two dimensions of video game tutorial design and their effects on high school learners:

- **Implicitness:** the degree to which instructions are embedded in gameplay vs. stated explicitly (Low / Moderate / High)
- **Adaptability:** whether the game dynamically adjusts difficulty in real time based on player performance (No / Yes)

N = 90 gifted & talented high school students (ages 14–18) were randomly assigned to one of six conditions in a 3×2 factorial design and played a custom 7-level 2D web platformer. Gameplay was auto-logged and participants completed a 10-item post-play Likert survey.

---

## Repository Contents

| Folder | Contents | Description |
|---|---|---|
| `Data Analysis` | `analysis_results.pdf`<br>`analysis_summary.csv`<br>`data_analysis.R` | Code and results for the statistical analysis of the processed data
| `Data Processing` | `CSVProcessor.java`<br>`Combined_Data.csv`<br>`IAGEData.csv`<br>`Processed_IAGEData.csv`<br>`surveyResponses.csv` | Code and files for the processing of survey and playthrough data into a combined CSV file
| `Game` | `images/BGs`<br>`index.html`<br>`sript.js`<br>`style.css` | Code for the custom game played by participants in the study, and hosted on GitHub Pages
|  | `research_dashboard.html` | Interactive results dashboard with 8 tabbed sections and Chart.js visualizations.

### Access GitHub Pages
> Access the [game here](https://jaukg9.github.io/2DPlatformer-IAGE/Game)<br>
> Access the [research dashboard here](https://jaukg9.github.io/2DPlatformer-IAGE/research_dashboard.html)

---

## Study Design

### Conditions

| Factor | Conditions |
|---|---|
| Implicitness | Low (n=25) · Moderate (n=37) · High (n=28) |
| Adaptability | No (n=52) · Yes (n=38) |

**Low implicitness:** direct written instructions + visible, immediate performance feedback  
**Moderate implicitness:** guidance partially embedded in mechanics; reduced feedback  
**High implicitness:** fully integrated guidance; no explicit instruction provided  

**Non-adaptive:** fixed difficulty and progression throughout all 7 levels  
**Adaptive:** enemy difficulty, jump intensity, and scoring thresholds adjusted in real time based on prior level performance

### The Game

A custom 7-level 2D web platformer built in HTML/CSS/JavaScript. Players progressed sequentially through levels of increasing difficulty. All gameplay events were automatically logged server-side.

### Measures

**Subjective (10-item Likert survey, 1–5 scale):**
- *Enjoyment composite:* Enjoyed · Want to continue · Play again
- *Engagement composite:* Felt engaged · Paid attention
- *Scaffolding composite:* Easy to figure out · Appropriate challenge · Levels helped · Levels prepared · Felt confident

**Objective (auto-logged):**
- Completion rate (yes/no per level and overall)
- Stars earned (boolean per level, L4–L7; max = 4)
- Total deaths and per-level deaths
- Total time and per-level time (seconds)
- Total button presses and per-level button presses
- Average button presses per second (BPS)

### Statistical Approach

- One-way ANOVA and independent-samples t-tests for continuous outcomes by group
- Chi-square tests of independence for completion (categorical outcome)
- Two-way ANOVA (OLS dummy coding) for main effects and Implicitness × Adaptability interactions
- Outlier removal via IQR × 1.5 per variable (6 removed for stars collected, 7 removed for deaths and time, 3 for BPS)

---

## Key Findings

### Implicitness

- **Completion:** Low (60%) · Moderate (51%) · High (29%) || marginally significant χ²=5.796, p=0.0551†
- **Engagement:** Low vs. High pairwise p=0.047\* || high implicitness consistently scored lowest
- **Scaffolding:** Low vs. High pairwise p=0.0293\*
- **Late-game button presses (L7):** Low implicitness pressed significantly more than High (p=0.014\*) and Moderate (p=0.049\*), suggesting greater persistence and effort at peak difficulty
- No other significant differences in stars, deaths, total time, or BPS

### Adaptability

- **Engagement:** No-adaptability significantly higher (p=0.034\*)
- **Scaffolding:** No-adaptability significantly higher (p=0.027\*)
- **Enjoyment:** No-adaptability marginally higher (p=0.074†)
- **L6 button presses:** No-adaptability pressed more (t=−2.07, p=0.041\*)
- No improvement in any objective performance metric under the adaptive condition

### Interaction (Implicitness × Adaptability)

- Enjoyment showed a marginal disordinal interaction (p=0.0631†): adaptability reversed direction at high implicitness
- Worst subgroup: High implicitness + adaptability; only 16.7% completion rate (2 of 12)
- No other significant interactions detected

---

## Results Dashboard

Open `research_dashboard.html` in any modern browser (no build step or server required).

The dashboard contains 7 tabbed sections:

1. **Overview:** headline metrics and summary charts
2. **Survey composites:** Enjoyment, Engagement, Scaffolding by condition
3. **All 10 items:** individual item means as horizontal bar charts
4. **Performance:** Stars, deaths, time, BPS before and after outlier removal
5. **Per-level analysis:** time, button presses, and BPS broken down by level (L1–L7)
6. **Completion:** completion rates and interaction breakdown
7. **Interactions:** two-way ANOVA summary table and interaction plots

---

## Dataset Structure (`Combined_Data.csv`)

The CSV merges the survey form responses with the auto-logged gameplay telemetry on a per-participant basis.

**Key columns:**

| Column | Description |
|---|---|
| `Implicitness` | Condition assigned: `low` / `moderate` / `high` |
| `Adaptability` | Condition assigned: `yes` / `no` |
| `Level N Time` | Time spent on level N in seconds |
| `Level N Deaths` | Number of deaths on level N |
| `Level N Button Presses` | Total button presses on level N |
| `Level N Star` | Whether the star was earned (L4–L7 only) |
| `Total Time` | Sum of all level times |
| `Total Deaths` | Sum of all level deaths |
| `Total Stars` | Sum of L4–L7 star booleans (max = 4) |
| `Average Button Presses per Second` | Total button presses ÷ total time |
| Items 1–10 | Likert responses (1–5) for each survey item |

> **Note:** 6 participants were removed as outliers for stars collected (N→84), 7 were removed for deaths and time analyses (N→83); 3 were removed for BPS analyses (N→87). Outliers were identified independently per variable using IQR × 1.5.

---

## Limitations

- **Survival bias:** Only 44 of 90 players reached Level 7; late-level data reflects the most persistent players only
- **Sample:** Gifted & talented high schoolers from one region in the Southern US; findings may not generalize
- **Adaptivity type:** The adaptive condition scaled difficulty (enemy behavior, jump physics, scoring thresholds), not instructional content. Results may not generalize to other forms of adaptivity (e.g., AI-driven hint systems)
- **External validity:** The custom game lacks external validation; condition perception was not directly measured

---

## Significance Notation

| Symbol | Threshold |
|---|---|
| \* | p < 0.05 |
| † | p < 0.10 (marginal) |
| ns | Not significant |

---

## File Structure:
```plaintext
2DPlatformer-IAGE/
│
├── Data_Analysis/
│   ├── analysis_results.pdf
│   ├── analysis_summary.csv
│   └── data_analysis.R
|
├── Data_Processing/
│   ├── Combined_Data.csv
│   ├── CSVProcessor.java
│   ├── IAGEData.csv
│   ├── Processed_IAGEData.csv
│   └── surveyResponses.csv
│
├── Game/
│   ├── images/BGs      # IMAGE FILES
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── README.md
│
└── research_dashboard.html
```

---

## Citation

If referencing this work, please cite accordingly based on the final report associated with this study.
