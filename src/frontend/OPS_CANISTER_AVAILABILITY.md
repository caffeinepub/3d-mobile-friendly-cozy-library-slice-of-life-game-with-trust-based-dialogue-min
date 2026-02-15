# Canister Availability Operations Guide

## Overview

This document provides operational guidance for keeping the game canister online and troubleshooting "server offline/stopped" errors that users may encounter.

**For deployment retry and broader failure diagnosis:** See [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md) for step-by-step instructions on retrying failed deployments and diagnosing common deployment issues.

## Important Limitation

**The application cannot guarantee 100% uptime purely through frontend or backend code.** When a canister is stopped by its controller or runs out of cycles, it cannot programmatically restart itself. Starting and stopping canisters is an operational responsibility that requires controller access.

## Keeping the Canister Online

To ensure the game remains available to users:

### 1. Ensure the Canister is Started

The canister must be in a "running" state. Check the status with:

