---
title: "Extending Lyra's Inventory — Part 2: Writing a Custom Fragment"
description: "Build a custom inventory fragment that survives replication and wires cleanly into Lyra's existing item pipeline."
pubDate: 2026-06-22
difficulty: intermediate
engineVersion: "UE 5.7"
series: "Extending Lyra's Inventory"
seriesOrder: 2
tags: ["lyra", "inventory", "replication"]
prerequisites:
  - "Part 1 — The Item Definition"
draft: true
---

> **EXAMPLE TEMPLATE.** Replace or delete. Demonstrates a multi-part series — the
> series navigation box at the bottom of the post links the parts together.

Subclass `ULyraInventoryItemFragment` and override `OnInstanceCreated` to attach
runtime state to the item instance:

```cpp
UCLASS()
class UInventoryFragment_Durability : public ULyraInventoryItemFragment
{
    GENERATED_BODY()
public:
    UPROPERTY(EditDefaultsOnly, Category = Durability)
    int32 MaxDurability = 100;

    virtual void OnInstanceCreated(ULyraInventoryItemInstance* Instance) const override;
};
```

Because durability is per-instance state, it lives on the item *instance*, not the
definition — and the instance already replicates through Lyra's inventory fast array.