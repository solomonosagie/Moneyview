---
name: MoneyView mock API readiness
description: Replit workflow readiness behavior for MoneyView's development-only JSON Server.
---

Keep the development JSON Server's global response delay off or very short. A 500 ms delay caused Replit's readiness probes to close requests before a successful HTTP response, so the workflow failed even though JSON Server had started.

**Why:** The artifact workflow checks that its service responds successfully before marking it ready.

**How to apply:** When simulating latency, avoid delaying every request; keep the API's root/readiness response immediate and verify startup through the managed workflow.
