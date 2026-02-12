# Conseiller en Investissement

Outil de conseil en investissement disponible en deux versions: React (application web moderne) et Streamlit (application web Python).

## 📁 Structure du projet

```
MaloConseillerFinancier/
├── react-web-app/          # Application React avec Vite
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── ...
├── streamlit-web-app/      # Application Streamlit
│   ├── app.py
│   ├── portfolio_calculations.py
│   ├── asset_info.py
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
└── README.md              # Ce fichier
```

## 🚀 Démarrage rapide

### React Web App

```bash
cd react-web-app
npm install
npm run dev
```

L'application sera accessible à `http://localhost:5173`

### Streamlit Web App

```bash
cd streamlit-web-app
pip install -r requirements.txt
streamlit run app.py
```

L'application sera accessible à `http://localhost:8501`

### Version CLI (Console)

```bash
cd streamlit-web-app
python main.py
```

## 📊 Fonctionnalités

Les deux applications offrent les mêmes fonctionnalités principales:

- ✅ Recommandations d'allocation d'actifs personnalisées
- ✅ Visualisations interactives (graphiques en secteurs, barres)
- ✅ Simulateur de projection temporelle avec volatilité quotidienne
- ✅ Informations détaillées sur chaque classe d'actifs
- ✅ Interface utilisateur moderne et responsive
- ✅ Mode sombre/clair (React uniquement)

## 💼 Classes d'actifs

- **Obligations**: Faible risque, rendement stable (~3% par an)
- **ETF Actions**: Risque moyen à élevé (~8% par an)
- **Cash**: Aucun risque (~1% par an)
- **Immobilier/REIT**: Diversification (~6% par an)
- **Crypto**: Très haute volatilité (~15% par an)

## ⚠️ Avertissement important

Ceci est un **outil pédagogique** à des fins éducatives uniquement. Les informations fournies ne constituent **pas un conseil financier professionnel**. Consultez toujours un conseiller financier qualifié avant de prendre des décisions d'investissement.

## 🛠️ Technologies

### React Web App
- React + Vite
- Tailwind CSS
- Recharts
- Lucide Icons

### Streamlit Web App
- Streamlit
- Plotly
- Pandas
- NumPy

## 📝 Licence

Outil pédagogique à des fins éducatives.
