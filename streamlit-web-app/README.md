# Conseiller en Investissement - Streamlit Web App

Application web de conseil en investissement développée avec Streamlit. Cette application fournit des recommandations d'allocation d'actifs personnalisées basées sur le capital disponible et la tolérance au risque de l'utilisateur.

## 📋 Fonctionnalités

- **Saisie intuitive**: Entrez votre capital et sélectionnez votre tolérance au risque (faible/élevée)
- **Recommandations personnalisées**: Allocation d'actifs adaptée à votre profil
- **Visualisations interactives**:
  - Graphique en secteurs de l'allocation
  - Barres de progression détaillées
  - Projections temporelles avec volatilité quotidienne
- **Informations détaillées**: Descriptions et statistiques pour chaque classe d'actifs
- **Simulateur de projection**: Visualisez l'évolution de votre portefeuille sur 1 à 30 ans
- **Interface moderne**: Design épuré et responsive

## 🚀 Installation et démarrage

### Prérequis
- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

### Installation

1. Créez un environnement virtuel:
```bash
python3 -m venv venv
```

2. Activez l'environnement virtuel:
```bash
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate  # Windows
```

3. Installez les dépendances:
```bash
pip install -r requirements.txt
```

### Démarrage de l'application

#### Option 1: Script automatique (macOS/Linux)
```bash
./run.sh
```

#### Option 2: Manuelle
```bash
source venv/bin/activate  # Activez d'abord le venv
streamlit run app.py
```

L'application sera accessible à l'adresse: `http://localhost:8501`

## 📁 Structure du projet

```
streamlit-web-app/
├── app.py                      # Application Streamlit principale
├── portfolio_calculations.py   # Calculs d'allocation et projections
├── asset_info.py              # Constantes et informations sur les actifs
├── main.py                    # Version CLI (console) originale
├── requirements.txt           # Dépendances Python
└── README.md                  # Ce fichier
```

## 💡 Utilisation

1. **Entrez votre capital**: Dans la barre latérale, saisissez le montant que vous souhaitez investir
2. **Sélectionnez votre profil de risque**: Choisissez entre "faible" (priorité à la sécurité) ou "élevée" (recherche de croissance)
3. **Obtenez votre recommandation**: Cliquez sur le bouton pour générer votre allocation personnalisée
4. **Explorez les détails**: Consultez les graphiques, les montants par actif, et les informations détaillées
5. **Simulez des projections**: Activez le simulateur pour voir l'évolution possible sur le long terme

## 📊 Classes d'actifs

L'application considère cinq classes d'actifs principales:

- **Obligations**: Titres de créance à faible risque
- **ETF Actions**: Fonds indiciels avec risque moyen à élevé
- **Cash**: Liquidités sans risque
- **Immobilier/REIT**: Fonds d'investissement immobilier
- **Crypto**: Cryptomonnaies à très haute volatilité

## ⚠️ Avertissement

Ceci est un **outil pédagogique** et ne constitue **pas un conseil financier professionnel**. Les projections sont basées sur des rendements historiques moyens et ne garantissent pas les performances futures. Consultez toujours un conseiller financier professionnel avant de prendre des décisions d'investissement.

## 🛠️ Technologies utilisées

- **Streamlit**: Framework pour applications web Python
- **Plotly**: Bibliothèque de visualisation interactive
- **Pandas**: Manipulation et analyse de données
- **NumPy**: Calculs numériques et scientifiques

## 📝 Version CLI

Une version en ligne de commande est également disponible dans le fichier `main.py`. Pour l'exécuter:

```bash
python main.py
```

## 📄 Licence

Outil pédagogique à des fins éducatives.
