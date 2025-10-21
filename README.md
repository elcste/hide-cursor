## Hide Cursor

GNOME Shell extension to hide the cursor on inactivity

For use on Wayland, since `unclutter`, `unclutter-xfixes` and `xbanish` only work on X11

<h3>⁂</h3>

#### Install from the [GNOME Shell Extensions website](https://extensions.gnome.org/extension/6727/hide-cursor/)

(Or download the file `hide-cursor@elcste.com.zip` from a [release](https://github.com/elcste/hide-cursor/releases) and run `gnome-extension install hide-cursor@elcste.com.zip`)

The latest version (3.0.1) supports GS 49 only. Much thanks to a contributor: this extension has been essentially rewritten. The timeout value is now followed correctly and this value is configurable with a setting.

Settings are translated to Dutch and Russian, thanks to contributors.

Earlier releases have a fixed 5 second timeout but due to simplistic logic the actual timeout varies under this value.
- GS 48: use version 2.0.1
- GS 45–47: version 1.3.0
- Version 0.1.0 is a backport to GNOME Shell 42 provided by a contributor. I have not tested it myself. (Feedback welcome! Does it work with GS 43 or 44?)
