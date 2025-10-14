import GLib from 'gi://GLib'
import Clutter from 'gi://Clutter'
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js'


export default class HideCursor extends Extension {
  TICK_TIMEOUT = 1

  enable() {
    this._settings = this.getSettings()
    this.HIDE_TIMEOUT = this._settings.get_int('timeout') * 1000
    this._settings.connect('changed::timeout', () =>
      this.HIDE_TIMEOUT = this._settings.get_int('timeout') * 1000)

    this._seat = Clutter.get_default_backend().get_default_seat()
    this._timer = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, this.TICK_TIMEOUT, this.tick)
    this._tracker = global.backend.get_cursor_tracker()
    this._positionChangedId = this._tracker.connect('position-invalidated', this.move)
    this._lastMove = Date.now()
  }

  disable() {
    if (this._positionChangedId) {
      this._tracker.disconnect(this._positionChangedId)
      this._positionChangedId = null
    }
    
    if (this._tracker) {
      this._tracker.uninhibit_cursor_visibility()
      this._tracker = null
    }
    
    if (this._timer) {
      GLib.Source.remove(this._timer)
      this._timer = null
    }

    if (this._hasInhibited) {
      this._seat.uninhibit_unfocus()
      this._hasInhibited = false
    }
      
    this._seat = null
    this._lastMove = null
    this.HIDE_TIMEOUT = null
  }

  tick = () => {
    if (Date.now() - this._lastMove > this.HIDE_TIMEOUT && this._tracker.get_pointer_visible()) {
      if (!this._hasInhibited) {
        this._seat.inhibit_unfocus()
        this._hasInhibited = true
      }
      this._tracker.inhibit_cursor_visibility()
    }

    return GLib.SOURCE_CONTINUE
  }
  
  move = () => {
    this._lastMove = Date.now()

    if (this._hasInhibited) {
      this._seat.uninhibit_unfocus()
      this._hasInhibited = false
    }

    if (!this._tracker.get_pointer_visible())
      this._tracker.uninhibit_cursor_visibility()
  }
}
