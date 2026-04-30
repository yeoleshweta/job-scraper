# Shweta Sharma

**AI Safety & Alignment Researcher | NLP, Bias Detection, Trustworthy ML** | shwetayeole09@gmail.com | [shwetasharma.tech](https://shwetasharma.tech) | [LinkedIn](https://linkedin.com/in/sharmashweta08/) | Philadelphia, PA

---

## Summary

Applied ML researcher focused on **trustworthy AI and algorithmic fairness** in high-stakes domains. Currently building bias-detection frameworks and synthetic data pipelines for clinical NLP systems at ABIM (American Board of Internal Medicine), using fine-tuned transformers (ClinicalBERT, RoBERTa) to identify and measure systematic disparities in model outputs. MS in AI & Machine Learning from Drexel (March 2026). Bridging 7+ years of mixed-methods research practice with modern ML research — a track record of turning ambiguous problems into rigorous, methodologically-sound, evaluable systems.

---

## Education

**Drexel University** — MS, Artificial Intelligence & Machine Learning
_Expected March 2026 | Philadelphia, PA_
College of Computing & Informatics. Coursework: machine learning, deep learning, NLP, applied statistics, experimental design.

**G.H. Raisoni College** — BS, Computer Science
_2010–2015 | Pune, India_

---

## Research Experience

### ABIM (American Board of Internal Medicine) — Data Scientist (Research Co-op)

_Sep 2025 – Present | Philadelphia, PA_

- **Bias detection in clinical language models.** Engineered supervised NLP pipelines using fine-tuned transformers (ClinicalBERT, RoBERTa) on 3,500+ clinical records to identify systematic disparities in physician-patient communication patterns across demographic groups. Output drives fairer downstream physician assessment decisions — a direct analog to alignment research on model behavior across populations.
- **Synthetic data workflows with leakage detection.** Designed automated pipelines that generate privacy-preserving synthetic training data for clinical NLP, with explicit validation against membership-inference-style leakage and statistical-parity checks. Motivated by the same concerns behind model-training data hygiene and PHI/PII safety.
- **Annotation taxonomy and inter-rater reliability protocols.** Built the labeling framework (Label Studio) behind the above models — formal annotation schema, multi-rater agreement metrics (Cohen's κ, Fleiss' κ), gold-standard benchmarks — to ensure training signal is defensible against noisy or biased labeling.
- **Evaluation frameworks for model trustworthiness.** Developed calibration + fairness evaluation protocols (AUC, ECE, demographic-parity across subgroups) before any model reaches production decision points.
- Stack: Python, PyTorch, Hugging Face Transformers, scikit-learn, Label Studio, SQL.

### John Deere — Senior Technical Lead & Applied Researcher

_Nov 2022 – Aug 2024 | Pune, India_

- Architected survey + behavioral-analytics platform serving 250+ product teams; cut data-collection setup time 60% and raised signal quality via template-driven sampling + automated validation.
- Developed cross-team methodology standards (research design, experimental rigor, measurement reliability) adopted by PM and engineering groups — analogous to ML experiment-design discipline.

### Capita (Arcadia Group) — Personalization / A/B Experiments

_Jan 2018 – Aug 2019 | Pune, India_

- Designed and shipped A/B experiments across 7 consumer brands driving 11% conversion lift. Validated via statistical significance testing with control methodology.
- Built behavioral-cohort segmentation models on user-level event data.

---

## Selected Projects

- **Bias-audit framework for clinical transformers** — open work at ABIM. Systematic evaluation of demographic disparities in model outputs; reproducible methodology for auditing domain-specific fine-tuned LLMs.
- **Synthetic-data leakage detection** — automated membership-inference-style checks for generated clinical corpora; quantified re-identification risk before data release.
- **Annotation reliability toolkit** — agreement-metric reporting, annotator-drift detection, active-learning hooks for label efficiency.

---

## Technical Skills

**ML / NLP:** PyTorch, Hugging Face Transformers, ClinicalBERT, RoBERTa, fine-tuning, LoRA-style adaptation, model evaluation (AUC, calibration, demographic parity), synthetic data generation, bias/fairness metrics
**Languages:** Python, SQL
**Research Infrastructure:** Label Studio, annotation taxonomy design, inter-rater reliability protocols (Cohen's κ, Fleiss' κ), gold-standard benchmark construction
**Experimentation:** A/B and multivariate testing, statistical significance, power analysis, causal inference basics
**Data:** Pandas, NumPy, scikit-learn, relational + clinical data, responsible data handling (PHI-adjacent)

---

## Research Interests (relevant to Fellows teams)

- **AI Safety & Alignment:** Systematic evaluation of fairness and demographic robustness in fine-tuned LLMs; where model behavior diverges from intended alignment objectives.
- **Economics & Societal Impacts:** High-stakes domain deployments (healthcare, certification, assessment) where model errors have direct human consequences; methodology for auditing these systems.
- **Mechanistic Interpretability (adjacent):** Bias-detection as an observational lens into learned representations.

---

## Certifications

- Google UX Design Specialization
- Research Methods (University of London) — formal research methodology, measurement theory, experimental design
