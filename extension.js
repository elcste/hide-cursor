/*
 * Copyright 2024 Alexander Browne
 * Copyright 2020 Evan Welsh (https://gjs.guide/extensions/review-guidelines/review-guidelines.html#remove-main-loop-sources)
 * Copyright 2020 Jeff Channell (https://github.com/jeffchannell/jiggle/blob/master/cursor.js)
 */

/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Meta from 'gi://Meta';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class HideCursor extends Extension {
    enable() {

        // Configuration.
        this.checkEvery = 1; // Seconds.
        this.disappearAfter = 5; // Seconds.

        // Internals.
        this._tracker = Meta.CursorTracker.get_for_display(global.display);
        this._tick = Date.now(); // Reset on every cursor move.
        this._visible = true; // Lower when hidden to perform less work.

        // Callbacks.
        this._reset = this._tracker.connect("position-invalidated", () => {
            this._tick = Date.now();
            this._visible = true; // (cursor automatically made visible on move by gnome).
        });
        this._hide = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, this.checkEvery, () => {
            if (this._visible) {
                const now = Date.now();
                const elapsed = now - this._tick; // Milliseconds.
                if (elapsed >= 1000 * this.disappearAfter) {

                    // (original extension code to hide cursor)
                    const seat = Clutter.get_default_backend().get_default_seat();
                    if (!seat.is_unfocus_inhibited())
                        seat.inhibit_unfocus();
                    this._tracker.set_pointer_visible(false);

                    this._visible = false; // Stop calculating as long as it's hidden.
                }
            }
            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        // Disconnect callbacks.
        if (this._reset) {
            this._tracker.disconnect(this._reset);
            this._reset = null;
        }
        if (this._hide) {
            GLib.Source.remove(this._hide);
            this._hide = null;
        }

        // (original extension code to.. ?)
        const seat = Clutter.get_default_backend().get_default_seat();
        if (seat.is_unfocus_inhibited())
            seat.uninhibit_unfocus();
        this._tracker.set_pointer_visible(true);
    }
}
