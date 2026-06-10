# Unkind Rules Reference

> Structured gameplay reference for Unkind by Projekt Lyoon.

This file is intended for search crawlers, LLMs, and players who need a compact rules reference. It reflects the current app card definitions in `Unkind/src/constants/gameConstants.ts`.

## Game Overview

Unkind is a tactical race-home board game. Players move tokens with dice, earn fuel from movement, and spend fuel on cards that change board state, targeting, tempo, captures, and survival.

## Modes

- Standard mode: first player to get all 4 tokens into the Home Triangle wins.
- Unkind mode: tokens have 2 lives and can become DEAD. Sacrifice is removed from the deck in this mode.
- Solo Practice: offline games against Clanker bots.
- Global Arena: online matchmaking.
- Private Match: room-based multiplayer with friends.

## Victory Conditions

- Standard: get all 4 tokens into the Home Triangle.
- Unkind Flawless Victory: get all 4 tokens into the Home Triangle.
- Unkind Survivor's Escape: all remaining living tokens are in the Home Triangle, with at least one token still alive.
- Unkind Last Survivor: only one player has tokens that are not DEAD and not in the Home Triangle.

## Turn Lifecycle

- Each turn starts in `WAITING_FOR_ACTION`.
- Incoming shields are cleared at handover.
- The incoming player's hand refills to 3 unique cards.
- Unpinned cards are flushed to discard at turn end.
- A player can pin 1 card to carry it into their next turn.
- Cards cannot be played while dice movement is pending resolution.
- Roll 6, capture, reaching Home Triangle, and certain cards can grant extra turns.
- Extra turns do not stack as a numeric counter.
- Adrenaline guarantees a second bonus turn.
- Ruin Path lasts for 2 full rounds.

## Dice, Movement, and Fuel

- Dice results are 1 through 6.
- A Yard token needs a 6 to spawn through ordinary dice movement.
- Resolved dice movement grants `7 - dice result` fuel.
- Fuel caps at 12.
- If no legal dice move exists, gain +1 fuel.
- Tokens cannot move backward past their own start.
- Home Triangle entry requires an exact move.
- Overshoots are clamped and canceled.
- Rolling 6 still retains the extra turn.

## Capture, Safety, and Lives

- Capture applies when two active tokens share the same public-loop square.
- Safe squares block capture and most enemy card targeting unless Ruin Path is active.
- Shielded tokens are immune to capture and enemy card effects.
- Home Column and Home Triangle tokens cannot be captured.
- On capture, the captured token owner loses half their fuel rounded down.
- In Unkind mode, each token starts with 2 lives.
- Capture or mine hit removes 1 life.
- At 0 lives, the token becomes DEAD. Otherwise it returns to Yard.
- Endgame points: Home Triangle +5, Active or Home Column +2, Yard +1, Dead 0.

## Card Flow

- Maximum hand size is 3.
- Only movement cards can be burned.
- Burning a movement card grants +2 fuel.
- A player can burn only once per turn.
- Movement cards target active track tokens or the player's own Home Column tokens.
- Opponent safe-zone targets are blocked unless Ruin Path is active.
- Switch requires two active targets from different owners.

## Deck Size and Copy Counts

- Standard deck: 96 cards.
- Unkind-mode deck: 94 cards because Sacrifice is excluded.
- Rarity distribution by unique card definitions: Common Movement, Rare Utility and some Control, Epic Control, Legendary Chaos.

## Movement Cards

| Card | Cost | Copies | Effect |
| --- | ---: | ---: | --- |
| Nudge Forward (+1) | 2 | 6 | Move any eligible token 1 step forward. |
| Nudge Back (-1) | 2 | 6 | Move any eligible token 1 step back. |
| March (+3) | 3 | 6 | Move any eligible token 3 steps forward. |
| Backpedal (-3) | 3 | 6 | Move any eligible token 3 steps back. |
| Dash (+5) | 4 | 6 | Move any eligible token 5 steps forward. |
| Retreat (-5) | 4 | 6 | Move any eligible token 5 steps back. |

## Utility Cards

| Card | Cost | Copies | Effect |
| --- | ---: | ---: | --- |
| Shield | 3 | 6 | Selected token cannot be captured until your next turn. |
| Switch | 5 | 6 | Swap places of your token and an enemy token. |
| Deploy | 5 | 10 | Bring 1 token out of your yard. |

## Control Cards

| Card | Cost | Copies | Effect |
| --- | ---: | ---: | --- |
| Minefield | 4 | 6 | Drop a hidden mine on a cell. |
| Mirror Step | 5 | 6 | Selected enemy token moves opposite your direction on your next roll. |
| U-Turn | 5 | 4 | Flip turn order. Play again. |
| Freeze | 6 | 4 | Skip the next player. Play again. |
| Adrenaline | 6 | 4 | Play now, then get one more bonus turn. |

## Chaos Cards

| Card | Cost | Copies | Effect |
| --- | ---: | ---: | --- |
| Warp Jump | 8 | 4 | Teleport close to home. |
| Sacrifice | 9 | 2 | Remove this token, bring out 2, then play again. Excluded from Unkind-mode decks. |
| Ruin Path | 8 | 4 | Safe and spawn cells are risky for 2 rounds. |
| Parasite | 6 | 4 | If your token is on an enemy start cell, steal their 6 rolls. |

## Tactical Notes

- Fuel is strongest when saved for high-impact control and chaos cards, but movement cards can create exact capture ranges.
- Pinning protects a card from the end-turn hand flush.
- Burning low-value movement cards can fund a stronger card later in the turn.
- Shield changes both capture math and card-targeting safety.
- Minefield punishes predictable routes.
- U-Turn, Freeze, and Adrenaline are tempo cards that can decide who acts next.
- Ruin Path makes normally safe board spaces dangerous.
- Parasite rewards occupying enemy start cells and punishes enemy 6 rolls.

## Links

- [Homepage](https://www.projektlyoon.com/)
- [Homepage markdown](https://www.projektlyoon.com/index.html.md)
- [LLM entrypoint](https://www.projektlyoon.com/llms.txt)
- [Privacy policy](https://www.projektlyoon.com/privacy/index.html.md)
- [App Store](https://apps.apple.com/de/app/unkind/id6760196649?l=en-GB)
- [Google Play](https://play.google.com/store/apps/details?id=com.projektlyoon.unkind)
