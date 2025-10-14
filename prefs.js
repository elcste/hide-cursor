import Adw from 'gi://Adw'
import Gio from 'gi://Gio'
import Gtk from 'gi://Gtk'
import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'


export default class HideCursorPrefs extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const page = new Adw.PreferencesPage({
      title: 'General',
      icon_name: 'dialog-information-symbolic',
    })
    window.add(page)

    const group = new Adw.PreferencesGroup({
      title: _('Cursor Hiding'),
    })
    page.add(group)

    const timeoutRow = new Adw.SpinRow({
      title: _('Hide cursor after (seconds)'),
      adjustment: new Gtk.Adjustment({
        lower: 1,
        upper: 30,
        step_increment: 1,
        page_increment: 5,
        value: this.getSettings().get_int('timeout'),
      }),
      numeric: true,
    })

    this.getSettings().bind('timeout', timeoutRow, 'value', Gio.SettingsBindFlags.DEFAULT)

    group.add(timeoutRow)
  }
}