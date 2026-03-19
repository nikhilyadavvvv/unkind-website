# Unkind Rules Reference

> Structured gameplay notes for the Unkind board game website.

This file summarizes the gameplay rules shown on the homepage. It is intended for quick LLM and human reference.

## Victory Conditions

- Standard: first player to get all 4 tokens into the Home Triangle wins.
- Unkind: win by Flawless Victory, Survivor's Escape, or Last Survivor.
- Flawless Victory: 4 tokens in the Home Triangle.
- Survivor's Escape: all remaining living tokens are in the Home Triangle, with at least one still alive.
- Last Survivor: only one player has tokens that are not DEAD and not in the Home Triangle.

## Board, Path, and Safety

- Safe squares block capture and most enemy card targeting unless Ruin Path is active.
- Force cards can still target opponents on their own start squares.
- Home column and home triangle cannot be captured.

## Turn Lifecycle

- Each turn starts in `WAITING_FOR_ACTION`.
- Incoming shields are cleared at handover.
- Incoming hand refills to 3 unique cards.
- Current hand is flushed to discard at turn end.
- Pin one card to carry it over to your next turn, bypassing the hand flush.
- Ruin Path lasts for 2 full rounds.

## Dice and Movement

- Dice resolve from 1 to 6.
- A Yard token needs 6 to spawn.
- Resolved dice movement grants `7 - dice result` fuel.
- Fuel caps at 12.
- Tokens cannot move backward past their own start.
- Home Triangle requires exact entry.
- Overshoots are clamped and canceled.
- If no legal dice move exists, gain +1 fuel.
- Rolling 6 still retains the extra turn.

## Capture, Lives, and Scoring Pressure

- Capture applies when two active tokens share the same public-loop square.
- Shielded tokens are immune to capture and enemy card effects.
- On capture, the owner loses half their fuel rounded down.
- Unkind tokens start with 2 lives.
- Capture or mine hit removes 1 life.
- At 0 lives the token becomes DEAD, otherwise it returns to Yard.
- Endgame points: Home Triangle +5, Active or Home Column +2, Yard +1, Dead 0.

## Card Constraints and Flow

- Cards cannot be played while a dice movement is pending resolution.
- Only movement cards can be burned.
- Burn grants +2 fuel once per turn.
- Movement cards target active track tokens or your own Home Column tokens.
- Opponent safe-zone targets are blocked unless Ruin Path is active or Force hits a start square.
- Switch requires two active targets from different owners.
- Roll 6, capture, reaching Home Triangle, and certain cards grant extra turns.
- Extra turns do not stack as a counter.
- Adrenaline guarantees a second bonus turn.

## Movement Cards

- Nudge Forward
- Nudge Back
- March
- Backpedal
- Dash
- Retreat

## Force Movement Cards

- Force Nudge Forward
- Force Nudge Back
- Force March
- Force Backpedal
- Force Dash
- Force Retreat

## Utility Cards

- Shield
- Deploy
- Switch

## Control Cards

- Minefield
- Mirror Step
- U-Turn
- Freeze
- Adrenaline

## Chaos Cards

- Warp Jump
- Sacrifice
- Ruin Path

## Links

- [Homepage](https://www.projektlyoon.com/)
- [Homepage markdown](https://www.projektlyoon.com/index.html.md)
- [Privacy policy](https://www.projektlyoon.com/privacy/index.html.md)
