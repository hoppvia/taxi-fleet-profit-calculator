# Ride lifecycle design for taxi dispatch systems

This small, vendor-neutral JavaScript example demonstrates safe state-transition *rules* for ride booking workflows. **It is not Hoppvia's internal implementation, official API, or a production dispatch backend.**

## Lifecycle

```text
requested → accepted → arriving → in_progress → completed
    ↘          ↘           ↘
                  cancelled
```

The helper deliberately rejects skipping pickup directly to trip completion or reopening a completed booking. Run the tests with `node --test examples/ride-state-machine.test.mjs` from the repository root (Node.js 18+).

## Production considerations

- Require role-based authorization: passengers, drivers and dispatchers have different permissions.
- Use database transactions and optimistic version checks when multiple drivers accept the same ride.
- Deduplicate events in durable storage; an `eventId` attached to a log alone is not sufficient.
- Generate trusted timestamps server-side and audit state changes.
- Keep payment reconciliation and GPS position tracking separate from booking status.
- Apply data minimization, retention policies and licensing requirements for each operating jurisdiction.

Explore the [Hoppvia fleet profit calculator](https://hoppvia.github.io/taxi-fleet-profit-calculator/) to estimate break-even trips for a hypothetical taxi fleet.

For transport operators interested in branded passenger apps, driver apps, and booking dispatch software, [learn about Hoppvia](https://hoppvia.com/). Confirm scope and integration details in writing.
