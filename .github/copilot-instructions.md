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

## Test-Driven Development

1. **Test Framework**

   - Jest als Haupttest-Framework
   - jest-chrome für Chrome API Mocking
   - JSDOM für DOM-Simulation

2. **Testarten**

   - Unit Tests für Utility-Funktionen
   - Integration Tests für DOM-Manipulationen
   - E2E Tests für Gesamtfunktionalität

3. **Test-Struktur**

   - `/tests/unit/`: Unit Tests
   - `/tests/integration/`: Integration Tests
   - `/tests/e2e/`: End-to-End Tests
   - `/tests/mocks/`: Mock-Daten und Fixtures

4. **TDD-Workflow**

   - Red: Schreibe failing Test
   - Green: Implementiere Minimum
   - Refactor: Optimiere Code

5. **Test Coverage**
   - Mindestens 80% Testabdeckung
   - 100% für kritische Komponenten
   - Istanbul/nyc für Coverage Reports

## Code-Struktur

- `content.js`: Hauptlogik für DOM-Manipulation
- `popup.html/js`: Benutzeroberfläche
- `manifest.json`: Extension-Konfiguration

## Code-Organisation

- `__tests__/`: Test Dateien
- `jest.config.js`: Jest Konfiguration
- `coverage/`: Coverage Reports

## Performance

- Verzögerte Ausführung zur Vermeidung von Race Conditions
- Timeout-Handling für nicht gefundene Elemente
- Effiziente DOM-Traversierung
