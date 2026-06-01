---
title: Project Setup
description: Overview of the tools & technology used to build the game
category: technical-breakdown
pubDate: 2026-06-01T00:00:00.000Z
draft: false
---

I'm writing this post a few months after initial development of the game, where some of the nebulous ideas have crystalized somewhat and I have made enough progress to talk about the foundations on the game, and how I set up the project.

The core loop of the game is to climb mountains with friends, so I needed something which would help me make large procedural worlds which work in a multiplayer context. I am mostly experienced with developing in Unreal and the Lyra starter template is Epic's most robust template for building multiplayer experiences, it already provides a lot of what I need OOTB, and I decided to use it as the foundation for the project.

For procedurally generating the world, The Voxel Plugin seemed ideal - this lets me make mountains which have tunnels and overhangs which the default landscape tool struggles with. There are some trade-offs with using the voxel plugin, as the geometry is generated at runtime on the CPU, But I decided to take the risk and use it for this initial prototyping phase. 


