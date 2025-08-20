## Hide Cursor

### *Help needed for GNOME 49 (and beyond)*

*The cursor hiding API changed in the upcoming Gnome 49 release and [I haven't found a way to get this extension working](https://discourse.gnome.org/t/un-hiding-cursor-on-gnome-49/30747).*

<b>⁂</b>

### Install from the [GNOME Shell Extensions website](https://extensions.gnome.org/extension/6727/hide-cursor/)

GNOME Shell extension to hide the cursor on inactivity

For use on Wayland, since `unclutter`, `unclutter-xfixes` and `xbanish` only work on X11.

Works with GNOME Shell 45 and later. The latest version supports GS 48. For GS 45–47, use version 1.3.0.

<b>⁂</b>

The branch `timer`, maintained by [iago-lito](https://github.com/iago-lito) corrects the timer behavior, fixing a [flaw in the current version](https://github.com/elcste/hide-cursor/issues/1), but in a way that [breaks the unfocus inhibition](https://github.com/elcste/hide-cursor/pull/6). We will keep this branch up-to-date for people who want correct timing and are OK with loosing focus until someone finds a way to resolve the latter issue. You can install it by cloing the branch into your GNOME Shell extensions directory: `git clone --branch timer https://github.com/elcste/hide-cursor ~/.local/share/gnome-shell/extensions`
