# Packages
required <- c("ggplot2", "dplyr", "tidyr", "gridExtra")
new_pkg  <- required[!sapply(required, requireNamespace, quietly = TRUE)]
if (length(new_pkg)) install.packages(new_pkg, repos = "https://cloud.r-project.org")

suppressPackageStartupMessages({
  library(ggplot2)
  library(dplyr)
  library(tidyr)
  library(gridExtra)
  library(grid)
})

# Load & prepare data
CSV_PATH <- "./Data_Processing/Combined_Data.csv"
df <- read.csv(CSV_PATH, stringsAsFactors = FALSE, check.names = TRUE)

rename_by_pattern <- function(df, pattern, newname) {
  idx <- grep(pattern, names(df))
  if (length(idx) == 1) names(df)[idx] <- newname
  df
}

df <- rename_by_pattern(df, "Were\\.you\\.able", "completion_raw")
df <- rename_by_pattern(df, "I\\.felt\\.fully\\.engaged", "q_engaged")
df <- rename_by_pattern(df, "I\\.wanted\\.to\\.continue", "q_continue")
df <- rename_by_pattern(df, "I\\.paid\\.close\\.attention", "q_attention")
df <- rename_by_pattern(df, "I\\.enjoyed\\.playing", "q_enjoyed")
df <- rename_by_pattern(df, "I\\.would\\.like\\.to\\.play", "q_again")
df <- rename_by_pattern(df, "I\\.could\\.easily\\.figure", "q_figure")
df <- rename_by_pattern(df, "The\\.game\\.was\\.appropriately", "q_challenge")
df <- rename_by_pattern(df, "Preceding\\.levels\\.helped", "q_helped")
df <- rename_by_pattern(df, "Preceding\\.levels\\.prepared", "q_prepared")
df <- rename_by_pattern(df, "I\\.felt\\.confident", "q_confident")
df <- rename_by_pattern(df, "^Total\\.Stars$", "stars")
df <- rename_by_pattern(df, "^Total\\.Deaths$", "deaths")
df <- rename_by_pattern(df, "^Total\\.Time$", "total_time")
df <- rename_by_pattern(df, "Average\\.Button\\.Presses\\.per\\.Second", "bps")
df <- rename_by_pattern(df, "^Level\\.6\\.Time$", "l6_time_raw")
df <- rename_by_pattern(df, "^Level\\.7\\.Time$", "l7_time_raw")
df <- rename_by_pattern(df, "^Level\\.6\\.Button\\.Presses$", "l6_bp")
df <- rename_by_pattern(df, "^Level\\.7\\.Button\\.Presses$", "l7_bp")

df$implicitness <- factor(df$Implicitness,
                          levels = c("low", "moderate", "high"),
                          labels = c("Low", "Moderate", "High"))
df$adaptability <- factor(df$Adaptability,
                          levels = c("no", "yes"),
                          labels = c("No", "Yes"))

df$completed <- as.numeric(df$completion_raw == "Yes")

df$engagement <- rowMeans(df[, c("q_engaged", "q_attention")])
df$enjoyment <- rowMeans(df[, c("q_continue", "q_enjoyed", "q_again")])
df$scaffolding <- rowMeans(df[, c("q_figure", "q_challenge", "q_helped",
                                  "q_prepared", "q_confident")])

df$l6_time <- ifelse(df$l6_time_raw > 0, df$l6_time_raw, NA)
df$l7_time <- ifelse(df$l7_time_raw > 0, df$l7_time_raw, NA)
df$l6_bps  <- ifelse(!is.na(df$l6_time), df$l6_bp / df$l6_time, NA)
df$l7_bps  <- ifelse(!is.na(df$l7_time), df$l7_bp / df$l7_time, NA)

df_l6 <- df[!is.na(df$l6_time), ]
df_l7 <- df[!is.na(df$l7_time), ]

cat("Data Statistics\n")
cat("Total N:", nrow(df), "\n")
cat("Implicitness: Low =", sum(df$implicitness == "Low"),
    "  Moderate =", sum(df$implicitness == "Moderate"),
    "  High =", sum(df$implicitness == "High"), "\n")
cat("Adaptability: No =", sum(df$adaptability == "No"),
    "  Yes =", sum(df$adaptability == "Yes"), "\n")
cat("Completion: Yes =", sum(df$completed), "  No =", sum(1 - df$completed), "\n")
cat("L6 players:", nrow(df_l6), "| L7 players:", nrow(df_l7), "\n\n")

# Helper functions
remove_outliers <- function(x) {
  q  <- quantile(x, probs = c(0.25, 0.75), na.rm = TRUE)
  iq <- q[2] - q[1]
  ifelse(!is.na(x) & (x < q[1] - 1.5 * iq | x > q[2] + 1.5 * iq), NA, x)
}

se <- function(x) sd(x, na.rm = TRUE) / sqrt(sum(!is.na(x)))
all_results <- list()

# One-way ANOVA
do_anova <- function(y, group, label, section) {
  n_out <- sum(is.na(y))
  d     <- data.frame(y = y, group = group) |> filter(!is.na(y))
  fit   <- aov(y ~ group, data = d)
  s     <- summary(fit)[[1]]
  Fv    <- s["group", "F value"]
  pv    <- s["group", "Pr(>F)"]
  df1   <- s["group", "Df"]
  df2   <- s["Residuals", "Df"]
  sig   <- ifelse(pv < 0.05, "*", ifelse(pv < 0.10, "\u2020", "ns"))

  cat(sprintf("[ANOVA]  %-34s F(%d,%d) = %.3f  p = %.4f %s   N=%d  removed=%d\n",
              label, df1, df2, Fv, pv, sig, nrow(d), n_out))
  if (pv < 0.10) {
    cat("  Tukey HSD:\n"); print(TukeyHSD(fit)) 
  }

  all_results[[length(all_results) + 1]] <<- data.frame(
    Section = section, Variable = label, Test = "One-way ANOVA",
    Effect = "Implicitness", Stat = round(Fv, 3),
    DF = paste0(df1, ",", df2), p = round(pv, 4), Sig = sig,
    N = nrow(d), Removed = n_out, stringsAsFactors = FALSE)

  invisible(list(fit = fit, F = Fv, p = pv, df1 = df1, df2 = df2,
                 sig = sig, n = nrow(d)))
}

# Chi-square
do_chisq <- function(completed, group, label, section) {
  ct  <- table(group, completed)
  cs  <- suppressWarnings(chisq.test(ct))
  sig <- ifelse(cs$p.value < 0.05, "*", ifelse(cs$p.value < 0.10, "\u2020", "ns"))

  cat(sprintf("[CHI-SQ] %-34s chi2(%d) = %.3f  p = %.4f %s\n",
              label, cs$parameter, cs$statistic, cs$p.value, sig))

  all_results[[length(all_results) + 1]] <<- data.frame(
    Section = section, Variable = label, Test = "Chi-square",
    Effect = "Group", Stat = round(cs$statistic, 3),
    DF = as.character(cs$parameter), p = round(cs$p.value, 4), Sig = sig,
    N = sum(!is.na(completed)), Removed = 0, stringsAsFactors = FALSE)

  invisible(list(chisq = cs$statistic, df = cs$parameter,
                 p = cs$p.value, sig = sig))
}

# Welch t-test
do_ttest <- function(y, group, label, section) {
  n_out <- sum(is.na(y))
  d     <- data.frame(y = y, group = group) |> filter(!is.na(y))
  tt    <- t.test(y ~ group, data = d, var.equal = FALSE)
  sig   <- ifelse(tt$p.value < 0.05, "*", ifelse(tt$p.value < 0.10, "\u2020", "ns"))

  cat(sprintf("[T-TEST] %-34s t(%.1f) = %.3f  p = %.4f %s   N=%d  removed=%d\n",
              label, tt$parameter, tt$statistic, tt$p.value, sig, nrow(d), n_out))

  all_results[[length(all_results) + 1]] <<- data.frame(
    Section = section, Variable = label, Test = "Welch t-test",
    Effect = "Adaptability", Stat = round(tt$statistic, 3),
    DF = round(tt$parameter, 1), p = round(tt$p.value, 4), Sig = sig,
    N = nrow(d), Removed = n_out, stringsAsFactors = FALSE)

  invisible(list(t = tt$statistic, df = tt$parameter,
                 p = tt$p.value, sig = sig, n = nrow(d)))
}

# Two-way ANOVA
do_twoway <- function(y, impl, adapt, label, section) {
  n_out <- sum(is.na(y))
  d     <- data.frame(y = y, impl = impl, adapt = adapt) |> filter(!is.na(y))
  fit   <- aov(y ~ impl * adapt, data = d)
  s <- summary(fit)[[1]]

  get_r <- function(term) {
    list(F   = s[term, "F value"],
         p   = s[term, "Pr(>F)"],
         df1 = s[term, "Df"],
         df2 = s["Residuals", "Df"])
  }

  ri   <- get_r("impl")
  ra   <- get_r("adapt")
  rint <- get_r("impl:adapt")

  cat(sprintf("[2-WAY]  %-34s N=%d  removed=%d\n", label, nrow(d), n_out))

  for (ef in list(list(r = ri,   nm = "Implicitness"),
                  list(r = ra,   nm = "Adaptability"),
                  list(r = rint, nm = "Interaction"))) {
    if (!is.na(ef$r$p)) {
      sig <- ifelse(ef$r$p < 0.05, "*", ifelse(ef$r$p < 0.10, "\u2020", "ns"))
      cat(sprintf("  %-14s F(%d,%d) = %.3f  p = %.4f %s\n",
                  ef$nm, ef$r$df1, ef$r$df2, ef$r$F, ef$r$p, sig))
      all_results[[length(all_results) + 1]] <<- data.frame(
        Section = section, Variable = label, Test = "Two-way ANOVA",
        Effect = ef$nm, Stat = round(ef$r$F, 3),
        DF = paste0(ef$r$df1, ",", ef$r$df2), p = round(ef$r$p, 4), Sig = sig,
        N = nrow(d), Removed = n_out, stringsAsFactors = FALSE)
    }
  }

  sig_int <- ifelse(is.na(rint$p), "ns",
                    ifelse(rint$p < 0.05, "*",
                           ifelse(rint$p < 0.10, "\u2020", "ns")))

  invisible(list(fit = fit, impl = ri, adapt = ra,
                 int = rint, n = nrow(d), sig_int = sig_int))
}

COL3 <- c("Low" = "#185FA5", "Moderate" = "#1D9E75", "High" = "#D85A30")
COL2 <- c("No"  = "#534AB7", "Yes"       = "#BA7517")

sig_sub <- function(sig) {
  switch(sig,
         "*"  = "p < .05  *",
         "\u2020" = "p < .10  \u2020",
         "ns" = "ns",
         "")
}

# Shared dashboard-style theme (serif type, soft gridlines, tight margins)
theme_dashboard <- function(base_size = 10) {
  theme_minimal(base_size = base_size, base_family = "serif") +
    theme(
      plot.background     = element_rect(fill = "#ffffff", color = NA),
      panel.background    = element_rect(fill = "#ffffff", color = NA),
      plot.title          = element_text(size = base_size + 1, face = "plain", color = "#1a1a18"),
      axis.title          = element_text(size = base_size - 1.5, color = "#5f5e5a"),
      axis.text           = element_text(size = base_size - 1.5, color = "#888780"),
      panel.grid.major.y  = element_line(color = "#e8e6df", linewidth = 0.4),
      panel.grid.major.x  = element_blank(),
      panel.grid.minor    = element_blank(),
      legend.text         = element_text(size = base_size - 1.5, color = "#5f5e5a"),
      legend.title         = element_blank(),
      plot.margin         = margin(10, 14, 14, 10)
    )
}

# Badge-style significance colors (mirrors dashboard's sig/marg/ns pill colors)
sig_badge_col <- function(sig) {
  switch(sig, "*" = "#27500A", "\u2020" = "#633806", "ns" = "#444441", "#444441")
}
sig_badge_bg <- function(sig) {
  switch(sig, "*" = "#eaf3de", "\u2020" = "#faeeda", "ns" = "#f1efe8", "#f1efe8")
}

# Rounded, colored significance badge drawn in the top-left of the panel
sig_badge_layer <- function(sig, label_text = NULL) {
  txt <- if (is.null(label_text)) sig_sub(sig) else label_text
  annotate("label", x = -Inf, y = Inf, hjust = -0.06, vjust = 1.6,
           label = txt, fill = sig_badge_bg(sig), color = sig_badge_col(sig),
           label.size = 0, family = "mono", size = 2.6,
           label.r = unit(0.2, "lines"), label.padding = unit(0.25, "lines"))
}

pg_title <- function(txt) {
  textGrob(txt, gp = gpar(fontsize = 13, fontface = "bold", fontfamily = "serif"))
}

# Bar graph
bar_plot <- function(y, group, colors, title, ylab,
                     ylo = NA, yhi = NA, sig = "ns") {
  stats <- data.frame(y = y, group = group) |>
    filter(!is.na(y)) |>
    group_by(group) |>
    summarise(mn = mean(y), s = se(y), .groups = "drop")

  p <- ggplot(stats, aes(x = group, y = mn, fill = group)) +
    geom_col(width = 0.6, color = NA) +
    geom_errorbar(aes(ymin = mn - s, ymax = mn + s),
                  width = 0.15, color = "#5f5e5a", linewidth = 0.5) +
    scale_fill_manual(values = colors, guide = "none") +
    labs(title = title, y = ylab, x = NULL) +
    theme_dashboard() +
    sig_badge_layer(sig)
  if (!is.na(ylo)) p <- p + coord_cartesian(ylim = c(ylo, yhi))
  p
}

# Stacked bar graph
comp_bar <- function(completed, group, title, sig = "ns") {
  ct <- data.frame(completed = completed, group = group) |>
    group_by(group) |>
    summarise(pct_yes = mean(completed) * 100, .groups = "drop") |>
    mutate(pct_no = 100 - pct_yes) |>
    pivot_longer(c(pct_yes, pct_no),
                 names_to = "status", values_to = "val") |>
    mutate(status = factor(
      ifelse(status == "pct_yes", "Completed", "Not completed"),
      levels = c("Not completed", "Completed")))

  ggplot(ct, aes(x = group, y = val, fill = status)) +
    geom_col(width = 0.6) +
    scale_fill_manual(
      values = c("Completed" = "#185FA5", "Not completed" = "#B4B2A9")) +
    labs(title = title,
         y = "Percentage (%)", x = NULL, fill = NULL) +
    theme_dashboard() +
    theme(
      legend.position    = "bottom",
      legend.key.size    = unit(0.35, "cm")
    ) +
    sig_badge_layer(sig)
}

# Interaction line graph
int_plot <- function(y, impl, adapt, title, ylab,
                     ylo = NA, yhi = NA, sig_int = "ns") {
  d <- data.frame(y = y, impl = impl, adapt = adapt) |>
    filter(!is.na(y))
  stats <- d |>
    group_by(impl, adapt) |>
    summarise(mn = mean(y), s = se(y), .groups = "drop")

  p <- ggplot(stats, aes(x = impl, y = mn,
                          color = adapt, group = adapt)) +
    geom_line(linewidth = 0.9) +
    geom_point(size = 2.5) +
    geom_errorbar(aes(ymin = mn - s, ymax = mn + s),
                  width = 0.12, linewidth = 0.5) +
    scale_color_manual(values = COL2, name = "Adaptability") +
    labs(title = title, y = ylab, x = "Implicitness") +
    theme_dashboard() +
    theme(
      legend.position  = "bottom",
      legend.key.size  = unit(0.35, "cm")
    ) +
    sig_badge_layer(sig_int, label_text = paste0("Interaction: ", sig_sub(sig_int)))
  if (!is.na(ylo)) p <- p + coord_cartesian(ylim = c(ylo, yhi))
  p
}

pdf("./Data_Analysis/analysis_results.pdf", width = 14, height = 10)


# Section 1: Implicitness
cat("\nSection 1: Implicitness\n")

## 1.1 Completion
r1_1 <- do_chisq(df$completed, df$implicitness,
                 "1.1 Completion", "S1-Implicitness")
p1_1 <- comp_bar(df$completed, df$implicitness,
                 "Completion by Implicitness", r1_1$sig)

## 1.2 Enjoyment
y1_2 <- df$enjoyment
r1_2 <- do_anova(y1_2, df$implicitness, "1.2 Enjoyment", "S1-Implicitness")
p1_2 <- bar_plot(y1_2, df$implicitness, COL3,
                 "Enjoyment by Implicitness", "Mean score (1–5)",
                 1, 5, r1_2$sig)

## 1.3 Engagement
y1_3 <- df$engagement
r1_3 <- do_anova(y1_3, df$implicitness, "1.3 Engagement", "S1-Implicitness")
p1_3 <- bar_plot(y1_3, df$implicitness, COL3,
                 "Engagement by Implicitness", "Mean score (1–5)",
                 1, 5, r1_3$sig)

## 1.4 Scaffolding
y1_4 <- df$scaffolding
r1_4 <- do_anova(y1_4, df$implicitness, "1.4 Scaffolding", "S1-Implicitness")
p1_4 <- bar_plot(y1_4, df$implicitness, COL3,
                 "Scaffolding by Implicitness", "Mean score (1–5)",
                 1, 5, r1_4$sig)

## 1.5 Stars
y1_5 <- remove_outliers(df$stars)
r1_5 <- do_anova(y1_5, df$implicitness, "1.5 Stars", "S1-Implicitness")
p1_5 <- bar_plot(y1_5, df$implicitness, COL3,
                 "Stars by Implicitness", "Mean stars (0–4)",
                 0, 4, r1_5$sig)

## 1.6 Deaths
y1_6 <- remove_outliers(df$deaths)
r1_6 <- do_anova(y1_6, df$implicitness, "1.6 Deaths", "S1-Implicitness")
p1_6 <- bar_plot(y1_6, df$implicitness, COL3,
                 "Deaths by Implicitness", "Mean deaths",
                 sig = r1_6$sig)

## 1.7 Total Time
y1_7 <- remove_outliers(df$total_time)
r1_7 <- do_anova(y1_7, df$implicitness, "1.7 Total Time", "S1-Implicitness")
p1_7 <- bar_plot(y1_7, df$implicitness, COL3,
                 "Total Time by Implicitness", "Mean time (s)",
                 sig = r1_7$sig)

## 1.8 BPS
y1_8 <- remove_outliers(df$bps)
r1_8 <- do_anova(y1_8, df$implicitness, "1.8 BPS", "S1-Implicitness")
p1_8 <- bar_plot(y1_8, df$implicitness, COL3,
                 "BPS by Implicitness", "Mean button presses/s",
                 sig = r1_8$sig)

## 1.9 Per-level L6 & L7 Time and BPS
### L6 Time
y1_9a <- remove_outliers(df_l6$l6_time)
r1_9a <- do_anova(y1_9a, df_l6$implicitness, "1.9a L6 Time", "S1-Implicitness")
p1_9a <- bar_plot(y1_9a, df_l6$implicitness, COL3,
                  "L6 Time by Implicitness", "Mean time (s)", sig = r1_9a$sig)

### L6 BPS
y1_9b <- remove_outliers(df_l6$l6_bps)
r1_9b <- do_anova(y1_9b, df_l6$implicitness, "1.9b L6 BPS", "S1-Implicitness")
p1_9b <- bar_plot(y1_9b, df_l6$implicitness, COL3,
                  "L6 BPS by Implicitness", "Mean BPS", sig = r1_9b$sig)

### L7 Time
y1_9c <- remove_outliers(df_l7$l7_time)
r1_9c <- do_anova(y1_9c, df_l7$implicitness, "1.9c L7 Time", "S1-Implicitness")
p1_9c <- bar_plot(y1_9c, df_l7$implicitness, COL3,
                  "L7 Time by Implicitness", "Mean time (s)", sig = r1_9c$sig)

### L7 BPS
y1_9d <- remove_outliers(df_l7$l7_bps)
r1_9d <- do_anova(y1_9d, df_l7$implicitness, "1.9d L7 BPS", "S1-Implicitness")
p1_9d <- bar_plot(y1_9d, df_l7$implicitness, COL3,
                  "L7 BPS by Implicitness", "Mean BPS", sig = r1_9d$sig)

# PDF Pages for Section 1
grid.arrange(p1_1, p1_2, p1_3, p1_4, ncol = 2, nrow = 2,
  top = pg_title("Section 1 \u00b7 Implicitness (ANOVA) \u2014 Completion & Survey Composites"))
grid.arrange(p1_5, p1_6, p1_7, p1_8, ncol = 2, nrow = 2,
  top = pg_title("Section 1 \u00b7 Implicitness (ANOVA) \u2014 Performance Metrics"))
grid.arrange(p1_9a, p1_9b, p1_9c, p1_9d, ncol = 2, nrow = 2,
  top = pg_title("Section 1 \u00b7 Implicitness (ANOVA) \u2014 Per-Level L6 & L7"))


# Section 2: Adaptability
cat("\nSection 2: Adaptabilitiy\n")

## 2.1 Completion
r2_1 <- do_chisq(df$completed, df$adaptability,
                 "2.1 Completion", "S2-Adaptability")
p2_1 <- comp_bar(df$completed, df$adaptability,
                 "Completion by Adaptability", r2_1$sig)

## 2.2 Enjoyment
y2_2 <- df$enjoyment
r2_2 <- do_ttest(y2_2, df$adaptability, "2.2 Enjoyment", "S2-Adaptability")
p2_2 <- bar_plot(y2_2, df$adaptability, COL2,
                 "Enjoyment by Adaptability", "Mean score (1–5)",
                 1, 5, r2_2$sig)

## 2.3 Engagement
y2_3 <- df$engagement
r2_3 <- do_ttest(y2_3, df$adaptability, "2.3 Engagement", "S2-Adaptability")
p2_3 <- bar_plot(y2_3, df$adaptability, COL2,
                 "Engagement by Adaptability", "Mean score (1–5)",
                 1, 5, r2_3$sig)

## 2.4 Scaffolding
y2_4 <- df$scaffolding
r2_4 <- do_ttest(y2_4, df$adaptability, "2.4 Scaffolding", "S2-Adaptability")
p2_4 <- bar_plot(y2_4, df$adaptability, COL2,
                 "Scaffolding by Adaptability", "Mean score (1–5)",
                 1, 5, r2_4$sig)

## 2.5 Stars
y2_5 <- remove_outliers(df$stars)
r2_5 <- do_ttest(y2_5, df$adaptability, "2.5 Stars", "S2-Adaptability")
p2_5 <- bar_plot(y2_5, df$adaptability, COL2,
                 "Stars by Adaptability", "Mean stars (0–4)",
                 0, 4, r2_5$sig)

## 2.6 Deaths
y2_6 <- remove_outliers(df$deaths)
r2_6 <- do_ttest(y2_6, df$adaptability, "2.6 Deaths", "S2-Adaptability")
p2_6 <- bar_plot(y2_6, df$adaptability, COL2,
                 "Deaths by Adaptability", "Mean deaths",
                 sig = r2_6$sig)

## 2.7 Total Time
y2_7 <- remove_outliers(df$total_time)
r2_7 <- do_ttest(y2_7, df$adaptability, "2.7 Total Time", "S2-Adaptability")
p2_7 <- bar_plot(y2_7, df$adaptability, COL2,
                 "Total Time by Adaptability", "Mean time (s)",
                 sig = r2_7$sig)

## 2.8 BPS
y2_8 <- remove_outliers(df$bps)
r2_8 <- do_ttest(y2_8, df$adaptability, "2.8 BPS", "S2-Adaptability")
p2_8 <- bar_plot(y2_8, df$adaptability, COL2,
                 "BPS by Adaptability", "Mean BPS",
                 sig = r2_8$sig)

## 2.9 Per-level L6 & L7
y2_9a <- remove_outliers(df_l6$l6_time)
r2_9a <- do_ttest(y2_9a, df_l6$adaptability, "2.9a L6 Time", "S2-Adaptability")
p2_9a <- bar_plot(y2_9a, df_l6$adaptability, COL2,
                  "L6 Time by Adaptability", "Mean time (s)", sig = r2_9a$sig)

y2_9b <- remove_outliers(df_l6$l6_bps)
r2_9b <- do_ttest(y2_9b, df_l6$adaptability, "2.9b L6 BPS", "S2-Adaptability")
p2_9b <- bar_plot(y2_9b, df_l6$adaptability, COL2,
                  "L6 BPS by Adaptability", "Mean BPS", sig = r2_9b$sig)

y2_9c <- remove_outliers(df_l7$l7_time)
r2_9c <- do_ttest(y2_9c, df_l7$adaptability, "2.9c L7 Time", "S2-Adaptability")
p2_9c <- bar_plot(y2_9c, df_l7$adaptability, COL2,
                  "L7 Time by Adaptability", "Mean time (s)", sig = r2_9c$sig)

y2_9d <- remove_outliers(df_l7$l7_bps)
r2_9d <- do_ttest(y2_9d, df_l7$adaptability, "2.9d L7 BPS", "S2-Adaptability")
p2_9d <- bar_plot(y2_9d, df_l7$adaptability, COL2,
                  "L7 BPS by Adaptability", "Mean BPS", sig = r2_9d$sig)

# PDF Pages for Section 2
grid.arrange(p2_1, p2_2, p2_3, p2_4, ncol = 2, nrow = 2,
  top = pg_title("Section 2 \u00b7 Adaptability (t-test) \u2014 Completion & Survey Composites"))
grid.arrange(p2_5, p2_6, p2_7, p2_8, ncol = 2, nrow = 2,
  top = pg_title("Section 2 \u00b7 Adaptability (t-test) \u2014 Performance Metrics"))
grid.arrange(p2_9a, p2_9b, p2_9c, p2_9d, ncol = 2, nrow = 2,
  top = pg_title("Section 2 \u00b7 Adaptability (t-test) \u2014 Per-Level L6 & L7"))


# Section 3: Interaction
cat("\nSection 3: Interaction\n")

## 3.1 Completion
r3_1 <- do_twoway(df$completed, df$implicitness, df$adaptability,
                  "3.1 Completion", "S3-Interaction")
p3_1 <- int_plot(df$completed, df$implicitness, df$adaptability,
                 "Completion Interaction", "Proportion completed",
                 0, 1, r3_1$sig_int)

## 3.2 Enjoyment
y3_2 <- df$enjoyment
r3_2 <- do_twoway(y3_2, df$implicitness, df$adaptability,
                  "3.2 Enjoyment", "S3-Interaction")
p3_2 <- int_plot(y3_2, df$implicitness, df$adaptability,
                 "Enjoyment Interaction", "Mean score (1–5)",
                 1, 5, r3_2$sig_int)

## 3.3 Engagement
y3_3 <- df$engagement
r3_3 <- do_twoway(y3_3, df$implicitness, df$adaptability,
                  "3.3 Engagement", "S3-Interaction")
p3_3 <- int_plot(y3_3, df$implicitness, df$adaptability,
                 "Engagement Interaction", "Mean score (1–5)",
                 1, 5, r3_3$sig_int)

## 3.4 Scaffolding
y3_4 <- df$scaffolding
r3_4 <- do_twoway(y3_4, df$implicitness, df$adaptability,
                  "3.4 Scaffolding", "S3-Interaction")
p3_4 <- int_plot(y3_4, df$implicitness, df$adaptability,
                 "Scaffolding Interaction", "Mean score (1–5)",
                 1, 5, r3_4$sig_int)

## 3.5 Stars
y3_5 <- remove_outliers(df$stars)
r3_5 <- do_twoway(y3_5, df$implicitness, df$adaptability,
                  "3.5 Stars", "S3-Interaction")
p3_5 <- int_plot(y3_5, df$implicitness, df$adaptability,
                 "Stars Interaction", "Mean stars (0–4)",
                 0, 4, r3_5$sig_int)

## 3.6 Deaths
y3_6 <- remove_outliers(df$deaths)
r3_6 <- do_twoway(y3_6, df$implicitness, df$adaptability,
                  "3.6 Deaths", "S3-Interaction")
p3_6 <- int_plot(y3_6, df$implicitness, df$adaptability,
                 "Deaths Interaction", "Mean deaths",
                 sig_int = r3_6$sig_int)

## 3.7 Total Time
y3_7 <- remove_outliers(df$total_time)
r3_7 <- do_twoway(y3_7, df$implicitness, df$adaptability,
                  "3.7 Total Time", "S3-Interaction")
p3_7 <- int_plot(y3_7, df$implicitness, df$adaptability,
                 "Total Time Interaction", "Mean time (s)",
                 sig_int = r3_7$sig_int)

## 3.8 BPS
y3_8 <- remove_outliers(df$bps)
r3_8 <- do_twoway(y3_8, df$implicitness, df$adaptability,
                  "3.8 BPS", "S3-Interaction")
p3_8 <- int_plot(y3_8, df$implicitness, df$adaptability,
                 "BPS Interaction", "Mean BPS",
                 sig_int = r3_8$sig_int)

## 3.9 Per-level L6 & L7
y3_9a <- remove_outliers(df_l6$l6_time)
r3_9a <- do_twoway(y3_9a, df_l6$implicitness, df_l6$adaptability,
                   "3.9a L6 Time", "S3-Interaction")
p3_9a <- int_plot(y3_9a, df_l6$implicitness, df_l6$adaptability,
                  "L6 Time Interaction", "Mean time (s)", sig_int = r3_9a$sig_int)

y3_9b <- remove_outliers(df_l6$l6_bps)
r3_9b <- do_twoway(y3_9b, df_l6$implicitness, df_l6$adaptability,
                   "3.9b L6 BPS", "S3-Interaction")
p3_9b <- int_plot(y3_9b, df_l6$implicitness, df_l6$adaptability,
                  "L6 BPS Interaction", "Mean BPS", sig_int = r3_9b$sig_int)

y3_9c <- remove_outliers(df_l7$l7_time)
r3_9c <- do_twoway(y3_9c, df_l7$implicitness, df_l7$adaptability,
                   "3.9c L7 Time", "S3-Interaction")
p3_9c <- int_plot(y3_9c, df_l7$implicitness, df_l7$adaptability,
                  "L7 Time Interaction", "Mean time (s)", sig_int = r3_9c$sig_int)

y3_9d <- remove_outliers(df_l7$l7_bps)
r3_9d <- do_twoway(y3_9d, df_l7$implicitness, df_l7$adaptability,
                   "3.9d L7 BPS", "S3-Interaction")
p3_9d <- int_plot(y3_9d, df_l7$implicitness, df_l7$adaptability,
                  "L7 BPS Interaction", "Mean BPS", sig_int = r3_9d$sig_int)

# PDF Pages for Section 3
grid.arrange(p3_1, p3_2, p3_3, p3_4, ncol = 2, nrow = 2,
  top = pg_title("Section 3 \u00b7 Interaction (2-way ANOVA) \u2014 Completion & Survey"))
grid.arrange(p3_5, p3_6, p3_7, p3_8, ncol = 2, nrow = 2,
  top = pg_title("Section 3 \u00b7 Interaction (2-way ANOVA) \u2014 Performance Metrics"))
grid.arrange(p3_9a, p3_9b, p3_9c, p3_9d, ncol = 2, nrow = 2,
  top = pg_title("Section 3 \u00b7 Interaction (2-way ANOVA) \u2014 Per-Level L6 & L7"))


# Summary Table
cat("\nSummary Table\n")

summary_df <- do.call(rbind, all_results)
rownames(summary_df) <- NULL
print(summary_df, row.names = FALSE)

# Save CSV
write.csv(summary_df, "./Data_Analysis/analysis_summary.csv", row.names = FALSE)

# Render summary table in PDF (chunked at 20 rows per page)
chunk_size <- 20
n_chunks   <- ceiling(nrow(summary_df) / chunk_size)

for (pg in seq_len(n_chunks)) {
  idx   <- ((pg - 1) * chunk_size + 1):min(pg * chunk_size, nrow(summary_df))
  chunk <- summary_df[idx, , drop = FALSE]

  tt <- tableGrob(
    chunk, rows = NULL,
    theme = ttheme_minimal(
      base_size = 8,
      core    = list(fg_params = list(hjust = 0, x = 0.03)),
      colhead = list(fg_params = list(hjust = 0, x = 0.03,
                                      fontface = "bold"))))

  grid.arrange(tt,
    top = pg_title(
      paste0("Summary of All Tests  (page ", pg, " of ", n_chunks, ")")))
}

dev.off()

cat("\nOutputs written:\n")
cat("  analysis_results.pdf: all plots (", n_chunks + 9, " pages)\n", sep = "")
cat("  analysis_summary.csv: full results table\n")