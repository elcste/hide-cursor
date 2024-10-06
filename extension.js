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
import Gio from 'gi://Gio';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class HideCursor extends Extension {
    enable() {
        this._settings = this.getSettings();

        this._hideCursor = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, this._settings.get_int("timeout"), () => {
            let tracker = Meta.CursorTracker.get_for_display(global.display);
            const seat = Clutter.get_default_backend().get_default_seat();

            if (!seat.is_unfocus_inhibited())
                seat.inhibit_unfocus();
            tracker.set_pointer_visible(false);

            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        this._settings = null;

        if (this._hideCursor) {
            GLib.Source.remove(this._hideCursor);
            this._hideCursor = null;
        }
        let tracker = Meta.CursorTracker.get_for_display(global.display);
        const seat = Clutter.get_default_backend().get_default_seat();

        if (seat.is_unfocus_inhibited())
            seat.uninhibit_unfocus();
        tracker.set_pointer_visible(true);
    }
}
