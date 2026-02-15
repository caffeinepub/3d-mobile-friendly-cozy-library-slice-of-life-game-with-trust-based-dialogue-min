# Canister Availability Operations Guide

## Overview

This document provides operational guidance for keeping the game canister online and troubleshooting "server offline/stopped" errors that users may encounter.

**For deployment retry and broader failure diagnosis:** See [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md) for step-by-step instructions on retrying failed deployments and diagnosing common deployment issues.

## Important Limitation

**The application cannot guarantee 100% uptime or programmatically start/stop/restart the Internet Computer canister.** When a canister is stopped by its controller or runs out of cycles, it cannot restart itself. Starting and stopping canisters is an operational responsibility that requires controller access via the `dfx` command-line tool or the Internet Computer dashboard.

## Keeping the Canister Online

To ensure the game remains available to users, follow these operational steps:

### 1. Ensure the Canister is Running

The canister must be in a "running" state. Check the status with:

