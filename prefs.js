import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class HideCursorPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage({
            title: _('Something title'),
            icon_name: 'dialog-information-symbolic',
        });

        window.add(page);

        const group = new Adw.PreferencesGroup();
        page.add(group);

        const timeoutRow = new Adw.ActionRow({
            title: _('Timeout'),
            subtitle: 'The seconds of inactivity before the cursor vanishes. Requires extension to be restarted to take effect.',
        });

        const timeoutInp = Gtk.SpinButton.new_with_range(0, 120, 1);
        timeoutInp.set_valign(Gtk.Align.CENTER);

        timeoutRow.add_suffix(timeoutInp);
        timeoutRow.set_activatable_widget(timeoutInp);

        group.add(timeoutRow);

        window._settings = this.getSettings();
        window._settings.bind('timeout', timeoutInp, 'value', Gio.SettingsBindFlags.DEFAULT);
    }
}
