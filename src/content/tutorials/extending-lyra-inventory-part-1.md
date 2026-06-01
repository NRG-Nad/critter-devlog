---
title: "Extending Lyra's Inventory — Part 1: The Item Definition"
description: "How Lyra's fragment-based item system is structured, and where to hook in your own item data without forking the framework."
pubDate: 2026-06-15
difficulty: intermediate
engineVersion: "UE 5.7"
series: "Extending Lyra's Inventory"
seriesOrder: 1
tags: ["lyra", "inventory", "gas"]
prerequisites:
  - "A Lyra-based project that compiles"
  - "Comfort reading C++ UCLASS/USTRUCT declarations"
draft: true
---

> **EXAMPLE TEMPLATE.** This is a placeholder showing how a tutorial post is
> structured — series metadata, difficulty, prerequisites, code blocks. Replace
> the body with real content, or delete this file. Flip `draft: false` to publish.

Lyra models items as `ULyraInventoryItemDefinition` assets composed of *fragments*.
Rather than subclassing a giant item class, you attach small, focused fragment
objects — one for the icon, one for stat modifiers, one for equippability.

```cpp
UCLASS(Blueprintable, Const, Abstract)
class ULyraInventoryItemDefinition : public UObject
{
    GENERATED_BODY()
public:
    UPROPERTY(EditDefaultsOnly, Instanced, Category = Display)
    TArray<TObjectPtr<ULyraInventoryItemFragment>> Fragments;
};
```

The key insight: **you almost never modify the definition class itself.** You add
behavior by writing a new fragment. Part 2 walks through building one.