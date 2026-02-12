# 💰 Conseiller en Investissement

Application web React pour obtenir des recommandations d'investissement personnalisées en fonction de votre capital et de votre tolérance au risque.

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
npm install
```

### Lancement en mode développement

```bash
npm run dev
```

L'application sera accessible à l'adresse: `http://localhost:5173`

### Build pour la production

```bash
npm run build
```

### Prévisualisation du build de production

```bash
npm run preview
```

## 📋 Fonctionnalités

- **Saisie du capital**: Entrez le montant que vous souhaitez investir
- **Choix de la tolérance au risque**: Sélectionnez entre "Faible" ou "Élevée"
- **Recommandation personnalisée**: Obtenez une allocation d'actifs optimisée selon votre profil
- **Visualisation graphique**: Barres de progression pour chaque classe d'actifs
- **Interface responsive**: Fonctionne sur desktop, tablette et mobile

## 🎨 Technologies utilisées

- **React 18** - Framework JavaScript
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **PostCSS** - Transformation CSS

## 📊 Logique d'allocation

L'application utilise une logique à plusieurs niveaux basée sur:

1. **Capital < 2 000€**: Profils prudents/sécuritaires
2. **Capital entre 2 000€ et 10 000€**: Profils équilibrés
3. **Capital ≥ 10 000€**: Profils dynamiques avec plus de diversification

Les classes d'actifs incluent:
- Obligations
- ETF Actions
- Cash
- Immobilier/REIT
- Crypto (uniquement pour les profils dynamiques)

## ⚠️ Avertissement

Ceci est un **outil pédagogique** et ne constitue en aucun cas un conseil financier professionnel.

## 📄 Licence

MIT
