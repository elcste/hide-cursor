/*
 * Copyright 2024-25 Alexander Browne
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

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class HideCursor extends Extension {
    enable() {

        this._hideCursor = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
            const seat = Clutter.get_default_backend().get_default_seat();

            if (!seat.is_unfocus_inhibited())
                seat.inhibit_unfocus();
            //tracker.set_pointer_visible(false);
            this._hidePointerUntilMotion();

            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        const seat = Clutter.get_default_backend().get_default_seat();

        if (seat.is_unfocus_inhibited())
            seat.uninhibit_unfocus();
        //tracker.set_pointer_visible(true);
        this._showPointer();

        if (this._hideCursor) {
            GLib.Source.remove(this._hideCursor);
            this._hideCursor = null;
        }
    }

    _showPointer() {
        this._cursorTracker = global.backend.get_cursor_tracker();

        if (this._cursorVisibleInhibited) {
            this._cursorTracker.uninhibit_cursor_visibility();
            this._cursorVisibleInhibited = false;
        }

        if (this._motionId) {
            global.stage.disconnect(this._motionId);
            this._motionId = 0;
        }
    }

    _hidePointer() {
        this._cursorTracker = global.backend.get_cursor_tracker();

        if (!this._cursorVisibleInhibited) {
            this._cursorTracker.inhibit_cursor_visibility();
            this._cursorVisibleInhibited = true;
        }
    }

        _hidePointerUntilMotion() {
        this._motionId = global.stage.connect('captured-event', (stage, event) => {
            if (event.type() === Clutter.EventType.MOTION)
                this._showPointer();

            return Clutter.EVENT_PROPAGATE;
        });
        this._hidePointer();
    }
}
