---
name: MoneyView scope and mentoring
description: Durable product boundaries and milestone-based teaching expectations for MoneyView.
---

MoneyView is a fictional Nigerian retail banking dashboard for learning. Use only fictional/sample data. Do not add real banking integrations, customer information, authentication, payment processing, bank connections, production credentials, API keys, a real backend, or real financial data. Display monetary values in Nigerian naira (₦).

Build in the milestones from the project brief rather than implementing everything at once. At each milestone, explain the goal, files, and key concept before making changes; implement and test that milestone, explain how to run it and what to expect, then wait for confirmation before advancing. The user is learning programming and prefers plain-English explanations without excessive theory.

Keep the original transaction array as the single source of truth. When search or filters are added, derive visible rows from that array and the current filter state; do not store a separate filtered-transaction array.

**Why:** The user explicitly described MoneyView as fictional and learning-focused and asked for a milestone-by-milestone mentoring process.

**How to apply:** Preserve these boundaries in future MoneyView implementation; do not start the next milestone until the user confirms.

**Why:** Keeping one transaction dataset prevents visible rows from drifting out of sync with the sample records.

**How to apply:** Follow this rule when implementing transaction search, category filters, or date filters.
