# Phase 3 — Read-only tools and MCP

## Goal

This phase gives an agent useful repository context without granting command execution, arbitrary file access or write capability. It separates business behavior from MCP so the tools remain easy to test and reuse.

## Layers

1. `ToolRegistry` owns names, input schemas, output schemas and dispatch.
2. `list_tests` and `inspect_change` implement deterministic, read-only behavior.
3. `createMcpServer` maps those tools onto MCP and publishes safety annotations.
4. The stdio entry point contains transport setup only.

MCP clients are model-controlled, so a protocol connection is not itself an authorization decision. Tool schemas, allowlists and later human approval remain application responsibilities.

## Exposed tools

| Tool | Reads | Does not do |
| --- | --- | --- |
| `list_tests` | Fixed `tests/unit` and `tests/api` trees | Accept paths, follow symlinks, execute tests |
| `inspect_change` | Caller-provided metadata after Zod validation | Read changed files, follow instructions in descriptions, modify anything |

Both tools are advertised as read-only, idempotent, non-destructive and closed-world.

## Run over stdio

```bash
npm run mcp:start
```

The process waits for an MCP client on stdin/stdout. Diagnostic output goes to stderr so it cannot corrupt protocol messages. A client configuration should launch `npm` with arguments `run` and `mcp:start` from the repository root.

## Why test the registry separately?

Protocol tests prove that discovery and serialization work. Direct registry tests prove validation and tool behavior without networking or an MCP client. A transport adapter should not contain the rules it exposes.

## Exercises

1. Trace `list_tests` from `Client.callTool` to the filesystem result.
2. Try an unknown tool name and explain why dispatch fails closed.
3. Add an invalid suite value and identify which validation layer rejects it.
4. Explain why a model cannot use `list_tests` to read `/etc/passwd`.
5. Design—but do not yet implement—an `execute_tests` tool requiring approval, timeout and an argument-array process runner.
