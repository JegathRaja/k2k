MANDATORY DOCUMENTATION GOVERNANCE RULE

THIS RULE IS PERMANENT.

THIS RULE OVERRIDES ALL FUTURE TASKS.

THIS RULE MUST BE FOLLOWED AFTER EVERY SINGLE PROMPT EXECUTION.

Failure to update documentation shall be treated as an incomplete task.

==================================================
OBJECTIVE
=========

Kadal2Kadaai must maintain complete project memory.

Every architectural change, feature implementation, bug fix, refactor, migration, validation, audit, documentation update, governance update, deployment change, and operational change must be recorded.

The repository documentation must always reflect reality.

==================================================
MANDATORY FILES
===============

The following files are now mandatory system files:

README.md

LOGAUDIT.md

These files are considered source-of-truth documents.

No task is considered complete until both files are reviewed and updated where applicable.

==================================================
RULE 1
LOGAUDIT.md UPDATE REQUIREMENT
==============================

After EVERY execution:

Review whether the change affects:

Architecture

Features

Database

APIs

Authentication

Authorization

RBAC

Frontend

Backend

Operations

Deployment

Documentation

Testing

Validation

Security

Monitoring

Analytics

Integrations

If yes:

LOGAUDIT.md MUST be updated.

==================================================
LOGAUDIT FORMAT
===============

Follow the existing format already present in the repository.

DO NOT invent new formats.

DO NOT replace existing sections.

DO NOT rewrite history.

DO NOT delete previous entries.

APPEND ONLY.

Maintain:

Overall Progress

Completed Modules

In Progress

Pending

AI Agent Handoff

Change History

Architecture Decision Log

Validation Log

Bug Tracking

==================================================
CHANGE HISTORY RULE
===================

Every meaningful task must create a new Change History entry.

Include:

Date

Module

Action Type

Files Created

Files Modified

Files Deleted

Description

Result

Status

Use the exact same structure already used in LOGAUDIT.md.

==================================================
ARCHITECTURE DECISION RULE
==========================

Whenever a major architectural decision is made:

Create a new:

Decision AD-XXX

Include:

Topic

Decision

Reason

Date

Status

Append only.

Never modify previous decisions.

==================================================
VALIDATION RULE
===============

Whenever testing occurs:

Update Validation Log.

Include:

Module

Tests

Passed

Failed

Status

==================================================
AI HANDOFF RULE
===============

After every major milestone:

Update:

AI AGENT HANDOFF SECTION

Must include:

Current Project State

Current Active Phase

Current Architecture

Current Priorities

Current Blockers

Next Recommended Actions

Warnings

Dependencies

A future AI must be able to continue development immediately using only this section.

==================================================
RULE 2
README.md UPDATE REQUIREMENT
============================

README.md must always reflect the CURRENT project reality.

After every task:

Review whether README requires updates.

If yes:

Update immediately.

==================================================
README MUST ALWAYS CONTAIN
==========================

Project Overview

Platform Vision

Current Architecture

Tech Stack

Applications

Folder Structure

Development Setup

Environment Setup

Database Setup

Startup Instructions

Deployment Overview

Governance References

Current Project Status

Roadmap Summary

==================================================
ARCHITECTURE UPDATE RULE
========================

Whenever architecture changes:

README MUST be updated.

Examples:

Admin + Seller merged

New Application Added

Application Removed

Folder Structure Changed

Database Strategy Changed

Deployment Strategy Changed

Authentication Strategy Changed

RBAC Strategy Changed

All architecture diagrams and descriptions must remain synchronized.

==================================================
PROJECT STATUS RULE
===================

README must always show:

Current Phase

Completed Phases

Current Milestone

Current Progress

Next Milestone

This information must match LOGAUDIT.md.

==================================================
RULE 3
DOCUMENTATION SYNCHRONIZATION AUDIT
===================================

At the end of every task perform:

Documentation Synchronization Audit

Verify:

README.md

LOGAUDIT.md

Architecture Documents

Governance Documents

Deployment Documents

Folder Structure Documents

Contain no conflicting information.

Generate:

Synchronization Status

PASS

or

FAIL

==================================================
RULE 4
TASK COMPLETION CRITERIA
========================

A task is NOT complete when:

Code is written.

A task is NOT complete when:

Features are implemented.

A task is ONLY complete when:

Code Complete

Validation Complete

LOGAUDIT Updated

README Updated

Documentation Audit Passed

==================================================
REQUIRED FINAL OUTPUT
=====================

At the end of every future task output:

DOCUMENTATION UPDATE SUMMARY

README Updated:
YES / NO

LOGAUDIT Updated:
YES / NO

Architecture Docs Updated:
YES / NO

Validation Logged:
YES / NO

Synchronization Audit:
PASS / FAIL

Task Status:
COMPLETE / INCOMPLETE

==================================================
PERMANENT RULE
==============

For the remainder of the Kadal2Kadaai project:

No implementation,

No refactor,

No migration,

No architecture change,

No deployment change,

No validation run,

No governance update,

No phase completion

shall be considered complete until LOGAUDIT.md and README.md have been reviewed, synchronized, and updated where necessary.

This rule applies to every future prompt without exception.
