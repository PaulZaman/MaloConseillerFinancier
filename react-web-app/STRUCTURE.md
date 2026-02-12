# Structure du projet

## 📁 Organisation des fichiers

```
src/
├── App.jsx                          # Composant principal (orchestration)
├── main.jsx                         # Point d'entrée
├── index.css                        # Styles globaux + Tailwind
│
├── components/                      # Composants React réutilisables
│   ├── FormInputs.jsx              # Formulaire de saisie (capital + risque)
│   ├── PieChartDisplay.jsx         # Graphique circulaire d'allocation
│   ├── AllocationDisplay.jsx       # Barres d'allocation avec tooltips
│   └── ProjectionChart.jsx         # Graphique de projection temporelle
│
├── constants/                       # Constantes et données
│   └── assetInfo.js                # Infos sur les actifs, rendements, volatilité
│
└── utils/                           # Fonctions utilitaires
    └── portfolioCalculations.js    # Calculs de portefeuille et projections
```

## 🎯 Description des modules

### Composants

- **App.jsx**: Composant racine qui gère l'état global et coordonne les autres composants
- **FormInputs.jsx**: Gère la saisie utilisateur (capital et tolérance au risque)
- **PieChartDisplay.jsx**: Affiche le graphique circulaire de la répartition
- **AllocationDisplay.jsx**: Affiche les barres détaillées avec tooltips informatifs
- **ProjectionChart.jsx**: Simulateur de projection avec scénarios standard et crises

### Utilities

- **portfolioCalculations.js**:
  - `choisirProfil()`: Détermine l'allocation selon capital et risque
  - `calculateProjection()`: Calcule projection avec volatilité réaliste
  - `calculateCrisisProjection()`: Simule des crises économiques
  - `formatCurrency()`: Formatage des montants en euros

### Constants

- **assetInfo.js**:
  - Descriptions des classes d'actifs
  - Rendements annuels moyens
  - Volatilité par actif
  - Palette de couleurs pour les graphiques

## 🔄 Flux de données

1. Utilisateur saisit capital et risque → `FormInputs`
2. Soumission → `App` calcule recommandation via `choisirProfil()`
3. Résultats affichés via:
   - `PieChartDisplay` (visualisation circulaire)
   - `AllocationDisplay` (détails + tooltips)
   - `ProjectionChart` (évolution temporelle)

## 🎨 Améliorations implémentées

### Volatilité adaptative
Le scénario standard utilise désormais une volatilité qui s'adapte à votre portefeuille:
- Portfolio conservateur (obligations, cash) → faible volatilité
- Portfolio agressif (actions, crypto) → haute volatilité

### Simulation de crises
- 2 crises majeures simulées sur la période
- Chutes brutales suivies de récupérations
- Démontre la résilience long terme des marchés
