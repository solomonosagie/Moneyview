---
name: MoneyView scope and mentoring
description: Durable product boundaries and milestone-based teaching expectations for MoneyView.
---

MoneyView is a Nigerian retail banking dashboard. Use sample data only. Do not add real banking integrations, customer information, authentication, payment processing, bank connections, production credentials, API keys, a real backend, or real financial data. Display monetary values in Nigerian naira (₦). Do not describe the app as fictional or for learning in its interface or project copy.

Build in the milestones from the project brief rather than implementing everything at once. At each milestone, explain the goal, files, and key concept before making changes; implement and test that milestone, explain how to run it and what to expect, then wait for confirmation before advancing. The user is learning programming and prefers plain-English explanations without excessive theory.

Keep the original transaction array as the single source of truth. When search or filters are added, derive visible rows from that array and the current filter state; do not store a separate filtered-transaction array.

**Why:** The user asked to remove fictional and learning-purpose labels while keeping the existing sample data and step-by-step explanations.

**How to apply:** Preserve these boundaries in future MoneyView implementation; use sample data only and avoid fictional/learning labels in UI and project copy. For new milestone work, explain the goal, files, and key concept, then wait for confirmation before advancing.

**Why:** Keeping one transaction dataset prevents visible rows from drifting out of sync with the sample records.

**How to apply:** Follow this rule when implementing transaction search, category filters, or date filters.
