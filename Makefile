# --- Settings ---
UUID = hide-cursor@elcste.com
SCHEMA_ID = org.gnome.shell.extensions.hide-cursor-elcste-com
DOMAIN = $(UUID)

# Directories
EXTENSION_DIR = $(HOME)/.local/share/gnome-shell/extensions/$(UUID)
SCHEMAS_DIR = $(HOME)/.local/share/glib-2.0/schemas
LOCALE_DIR = $(HOME)/.local/share/locale

# Files
SCHEMA_XML = schemas/$(SCHEMA_ID).gschema.xml
PO_FILES = $(wildcard po/*.po)
LANGUAGES = $(notdir $(PO_FILES:.po=))

# Commands
GLIB_COMPILE_SCHEMAS = glib-compile-schemas
MSGFMT = msgfmt

.PHONY: all install uninstall schemas local-schemas translations pot clean

# --- Main target ---
all: schemas local-schemas translations

# --- Installation ---
install: schemas local-schemas translations
	@echo "Installing extension to $(EXTENSION_DIR)..."
	@mkdir -p "$(EXTENSION_DIR)"
	@cp -r extension.js metadata.json prefs.js schemas po "$(EXTENSION_DIR)/"
	# .mo files already copied by translations → to $(EXTENSION_DIR)/locale/
	@echo "✅ Extension installed."

# --- Global schema compilation (required for GNOME 42+) ---
schemas:
	@echo "Compiling schema to global directory..."
	@mkdir -p "$(SCHEMAS_DIR)"
	@cp "$(SCHEMA_XML)" "$(SCHEMAS_DIR)/"
	@$(GLIB_COMPILE_SCHEMAS) "$(SCHEMAS_DIR)"

# --- Local schema compilation (in extension folder) ---
local-schemas:
	@echo "Compiling schema to extension folder (locally)..."
	@$(GLIB_COMPILE_SCHEMAS) schemas/

# --- Translations ---
translations: $(PO_FILES:.po=.mo)

%.mo: %.po
	@lang=$$(basename $< .po); \
	mkdir -p "$(EXTENSION_DIR)/locale/$$lang/LC_MESSAGES"; \
	$(MSGFMT) -o "$(EXTENSION_DIR)/locale/$$lang/LC_MESSAGES/$(DOMAIN).mo" $<

# --- Uninstallation ---
uninstall:
	@echo "Removing extension $(UUID)..."
	@rm -rf "$(EXTENSION_DIR)"
	@echo "Removing global schema..."
	@rm -f "$(SCHEMAS_DIR)/$(SCHEMA_ID).gschema.xml"
	@$(GLIB_COMPILE_SCHEMAS) "$(SCHEMAS_DIR)" 2>/dev/null || true
	@echo "Removing translations..."
	@for lang in $(LANGUAGES); do \
		if [ -n "$$lang" ]; then \
			echo "  Removing $$lang..."; \
			rm -f "$(LOCALE_DIR)/$$lang/LC_MESSAGES/$(DOMAIN).mo"; \
			rmdir "$(LOCALE_DIR)/$$lang/LC_MESSAGES" 2>/dev/null || true; \
			rmdir "$(LOCALE_DIR)/$$lang" 2>/dev/null || true; \
		fi \
	done
	@echo "✅ Uninstallation completed."

# --- POT Generation (optional) ---
pot:
	@xgettext --from-code=UTF-8 \
		--output=po/$(DOMAIN).pot \
		--keyword=_ \
		--package-name="$(UUID)" \
		extension.js prefs.js

# --- Cleaning local .mo files ---
clean:
	@rm -f po/*.mo schemas/*.compiled
	@echo "Cleaning local .mo files. and compiled schemas"