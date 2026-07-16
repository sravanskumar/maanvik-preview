# Maanvik — Architecture Repository (TOGAF-style)

**Framework:** The Open Group Architecture Framework (TOGAF) ADM — adapted for a SME digital transformation project.  
**Architecture Owner:** Sravan Kumar Sindhe  
**Architecture Board:** Sravan Kumar Sindhe + Bhagya Raju (business sign-off)  
**Last updated:** 15 July 2026 (evening — backlog v1.9, catalogue go-live blocker)

---

## How we use TOGAF here

Full enterprise TOGAF is heavier than Maanvik needs. We apply the **ADM phases** and **architecture domains** as a **governance and traceability layer** on top of the agile backlog — not as waterfall documentation.

| TOGAF concept | Maanvik artefact |
|---|---|
| Architecture Repository | This folder + linked docs |
| Architecture Vision (Phase A) | [ARCHITECTURE_VISION.md](./ARCHITECTURE_VISION.md) |
| Business Architecture (Phase B) | [BUSINESS_ARCHITECTURE.md](./BUSINESS_ARCHITECTURE.md) |
| Information Systems (Phase C) | [INFORMATION_SYSTEMS_ARCHITECTURE.md](./INFORMATION_SYSTEMS_ARCHITECTURE.md) |
| Technology Architecture (Phase D) | [TECHNOLOGY_ARCHITECTURE.md](./TECHNOLOGY_ARCHITECTURE.md) |
| Opportunities & Migration (Phase E/F) | [ARCHITECTURE_ROADMAP.md](./ARCHITECTURE_ROADMAP.md) |
| Implementation Governance (Phase G/H) | [IMPLEMENTATION_GOVERNANCE.md](./IMPLEMENTATION_GOVERNANCE.md) |
| Architecture Principles | [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md) |
| Requirements & decisions | [../BHAGYA_RAJU_DISCOVERY.md](../BHAGYA_RAJU_DISCOVERY.md), [../ECOMMERCE_DECISION.md](../ECOMMERCE_DECISION.md) |
| Delivery backlog | [../../Maanvik_Agile_Backlog.html](../../Maanvik_Agile_Backlog.html) |
| **Business architecture (HTML/PDF)** | [../../Maanvik_Enterprise_Architecture.html](../../Maanvik_Enterprise_Architecture.html) — for Bhagya Raju |
| **Zachman matrix (HTML/PDF)** | [Maanvik_Zachman_Matrix.html](./Maanvik_Zachman_Matrix.html) — vendor handover |

---

## ADM phase status

| Phase | Name | Status | Primary artefact |
|---|---|---|---|
| Preliminary | Framework & principles | ✅ Done | ARCHITECTURE_PRINCIPLES.md |
| **A** | Architecture Vision | ✅ Done | ARCHITECTURE_VISION.md |
| **B** | Business Architecture | ✅ Done | BUSINESS_ARCHITECTURE.md |
| **C** | Information Systems Architecture | 🟡 In progress | INFORMATION_SYSTEMS_ARCHITECTURE.md |
| **D** | Technology Architecture | 🟡 In progress | TECHNOLOGY_ARCHITECTURE.md |
| **E** | Opportunities & Solutions | ✅ Done | ARCHITECTURE_ROADMAP.md |
| **F** | Migration Planning | 🔴 Blocked — catalogue | ARCHITECTURE_ROADMAP.md + EPIC-06 |
| **G** | Implementation Governance | 🟡 Active — infra done | IMPLEMENTATION_GOVERNANCE.md |
| **H** | Architecture Change Management | 🟡 Active | Discovery tracker + backlog v1.9 |

---

## Architecture domains (four pillars)

```
┌─────────────────────────────────────────────────────────────┐
│  BUSINESS          Institutional B2B enquiry + selective    │
│  ARCHITECTURE      online checkout (hybrid model)           │
├─────────────────────────────────────────────────────────────┤
│  APPLICATION       Static web, forms, CRM, analytics, CMS   │
│  ARCHITECTURE                                               │
├─────────────────────────────────────────────────────────────┤
│  DATA              Product catalogue (data.js / Sheets),    │
│  ARCHITECTURE      enquiry records, CRM pipeline            │
├─────────────────────────────────────────────────────────────┤
│  TECHNOLOGY        AWS, Google Workspace, GitHub, DNS       │
│  ARCHITECTURE                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Epic → TOGAF mapping

| Epic | TOGAF phase | Domain |
|---|---|---|
| EPIC-01 Website conversion fixes | C → G | Application |
| EPIC-02 B2B enquiry pipeline | B → G | Business + Application |
| EPIC-03 Marketing & CMS | C → G | Application + Data |
| EPIC-04 Growth & CRM | B → E | Business + Application |
| EPIC-05 Hybrid e-commerce | C → E | Application + Business |
| EPIC-06 AWS platform | D → F | Technology |

---

## Reading order

1. ARCHITECTURE_PRINCIPLES.md  
2. **Maanvik_Enterprise_Architecture.html** (business summary for Bhagya Raju — print to PDF)  
3. ARCHITECTURE_VISION.md  
4. BUSINESS_ARCHITECTURE.md  
5. INFORMATION_SYSTEMS_ARCHITECTURE.md + TECHNOLOGY_ARCHITECTURE.md  
6. ARCHITECTURE_ROADMAP.md  
7. **Maanvik_Zachman_Matrix.html** (vendor / handover reference)  
8. IMPLEMENTATION_GOVERNANCE.md  
9. Maanvik_Agile_Backlog.html (execution)
