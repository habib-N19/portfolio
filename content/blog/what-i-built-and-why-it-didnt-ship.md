---
title: "What I Built and Why It Didn't Ship"
date: "2026-01-05"
description: "Three projects that never made it to production. What went wrong, what I learned, and why showing failure builds more trust than hiding it."
tags: ["Career", "Honesty", "Growth"]
image: "/blog/didnt-ship.jpg"
published: true
---

Every portfolio is a highlight reel. Here are the lowlights.

## Project 1: The Real-Time Collaborative Whiteboard

**What it was:** A multiplayer whiteboard with CRDT-based conflict resolution. Think Figma's infinite canvas, but for wireframing with clients in real time.

**What went wrong:** I spent 6 weeks building the CRDT sync layer from scratch instead of using Yjs. By the time the sync was stable, I'd lost all motivation for the actual product. The whiteboard itself — the thing users would interact with — was an afterthought built in 3 days.

**What I learned:** Infrastructure fascination is the most dangerous form of procrastination. The user doesn't care about your conflict resolution algorithm. They care about whether the pen tool feels good.

## Project 2: The AI-Powered Code Review Bot

**What it was:** A GitHub bot that used GPT-4 to review pull requests, focusing on security vulnerabilities and performance anti-patterns.

**What went wrong:** The reviews were technically accurate about 70% of the time. The other 30% were confidently wrong — the worst kind of wrong. A bot that's usually right but sometimes dangerously wrong is worse than no bot at all, because teams start trusting it and stop reading closely.

**What I learned:** AI code review tools need a certainty threshold. If the model's confidence is below 90%, it should say nothing rather than say something wrong. Silence is better than confident misinformation.

## Project 3: The Portfolio Generator

**What it was:** A CLI tool that generated opinionated portfolio sites from a YAML config file. Pick a style, add your projects, deploy.

**What went wrong:** The irony hit me halfway through: I was building a tool to make portfolios, instead of building *my* portfolio. Worse, the tool would have produced exactly the kind of generic portfolios I was trying to avoid.

**What I learned:** Meta-work — building tools to avoid doing the real work — is a comfortable trap. Sometimes you need to close the IDE, open a blank file, and just build the thing.

## Why Share This?

Portfolios that only show successes tell you nothing about how someone thinks. Failures reveal decision-making patterns, learning speed, and honesty. The question isn't "do you ship everything you start?" — nobody does. The question is "do you understand *why* things fail, and do you fail differently next time?"

I built the CRDT whiteboard before learning about Yjs. I won't make that mistake again — now I research existing solutions before writing infrastructure code.

I built the code review bot before understanding confidence calibration. Now I think about failure modes before I think about features.

I built the portfolio generator before building my portfolio. Now I'm skeptical of any tool that abstracts away the hard part of a creative task.

Three failures. Three lessons. Each one made the next project better.

That's the actual portfolio.
