# Hunters Reddit Helper Chrome Extension

Diese Chrome-Erweiterung bietet hilfreiche Funktionen für Reddit:

## Hauptfunktionen

- Automatisches Einklappen von Seitenleisten-Elementen:
  - CUSTOM FEEDS
  - RECENT
  - COMMUNITIES
  - RESOURCES

## Technische Details

Die Erweiterung nutzt:
- Manifest V3
- Content Scripts für DOM-Manipulation
- MutationObserver für dynamische Inhalte
- Event Listener für Navigation
- Popup Interface für manuelle Steuerung

## Implementierte Features

1. **Automatisches Einklappen**
   - Erkennt und klappt Seitenleisten-Elemente automatisch ein
   - Verwendet verschiedene Selektoren-Strategien
   - Berücksichtigt dynamisch nachgeladene Elemente

2. **Navigation**
   - Funktioniert auch bei AJAX-Navigation
   - Setzt Status bei Seitenwechsel zurück

3. **Debugging**
   - Ausführliche Logging-Funktion
   - Prefixed mit "[Hunter]"

## Code-Struktur

- `content.js`: Hauptlogik für DOM-Manipulation
- `popup.html/js`: Benutzeroberfläche
- `manifest.json`: Extension-Konfiguration

## Performance

- Verzögerte Ausführung zur Vermeidung von Race Conditions
- Timeout-Handling für nicht gefundene Elemente
- Effiziente DOM-Traversierung
