"""
Conseiller en Investissement - Streamlit Web App
Financial investment advisor tool with portfolio allocation and projections
"""
import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from portfolio_calculations import choisir_profil, calculate_projection, format_currency
from asset_info import asset_info, expected_returns, asset_volatility, COLORS

# Page configuration
st.set_page_config(
    page_title="Conseiller en Investissement",
    page_icon="�",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        text-align: center;
        padding: 2rem 0;
    }
    .stAlert {
        margin-top: 1rem;
    }
    .recommendation-box {
        background-color: #EEF2FF;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid #4F46E5;
        margin: 1rem 0;
    }
    .dark-mode .recommendation-box {
        background-color: #312E81;
        border-color: #818CF8;
    }
    .asset-card {
        background-color: #F9FAFB;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
        border: 1px solid #E5E7EB;
    }
    .dark-mode .asset-card {
        background-color: #374151;
        border-color: #4B5563;
    }
    div[data-testid="stMetricValue"] {
        font-size: 1.5rem;
    }
    .info-tooltip {
        background-color: #F3F4F6;
        padding: 0.75rem;
        border-radius: 0.375rem;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        border-left: 3px solid #6366F1;
    }
    .dark-mode .info-tooltip {
        background-color: #1F2937;
        border-color: #818CF8;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar for inputs
with st.sidebar:
    st.markdown("# Paramètres")
    
    # Capital input
    st.markdown("### Capital à investir")
    capital_input = st.text_input(
        "Montant en euros",
        value="5000",
        placeholder="Ex: 5000 ou 5000.50",
        help="Entrez votre capital disponible pour l'investissement"
    )
    
    # Risk tolerance
    st.markdown("### Tolérance au risque")
    risque = st.radio(
        "Choisissez votre profil",
        options=['faible', 'élevée'],
        index=0,
        help="Faible: Priorité à la sécurité | Élevée: Recherche de croissance"
    )
    
    st.divider()
    
    # Submit button
    calculate_button = st.button("Obtenir ma recommandation", type="primary", width='stretch')
    
    st.divider()
    st.markdown("""
    <div style='font-size: 0.8rem; color: #6B7280; padding: 1rem;'>
    <strong>Note:</strong> Ceci est un outil pédagogique, pas un conseil financier professionnel.
    </div>
    """, unsafe_allow_html=True)

# Main content
st.markdown("<h1 style='text-align: center;'>Conseiller en Investissement</h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center; color: gray;'>Outil de décision pédagogique</p>", unsafe_allow_html=True)

# Process input and generate recommendation
if calculate_button:
    try:
        # Parse capital
        capital = float(capital_input.replace(',', '.').replace(' ', ''))
        
        if capital <= 0:
            st.error("Le capital doit être supérieur à 0.")
        else:
            # Get recommendation
            result = choisir_profil(capital, risque)
            
            # Store in session state
            st.session_state.result = result
            st.session_state.capital = capital
            st.session_state.risque = risque
            
    except ValueError:
        st.error("Entrée invalide. Veuillez entrer un nombre valide (ex: 5000 ou 5000.50)")

# Display results if available
if 'result' in st.session_state:
    result = st.session_state.result
    capital = st.session_state.capital
    risque = st.session_state.risque
    
    st.divider()
    
    # Recommendation header
    st.markdown("## Recommandation d'investissement")
    
    # Capital and justification
    col1, col2 = st.columns([1, 2])
    with col1:
        st.metric(label="Capital", value=format_currency(capital))
        st.metric(label="Profil de risque", value=risque.capitalize())
    
    with col2:
        st.info(f"**Justification:** {result['justification']}")
    
    st.divider()
    
    # Create two columns for pie chart and metrics
    viz_col1, viz_col2 = st.columns([1, 1])
    
    with viz_col1:
        st.markdown("### Répartition visuelle")
        
        # Prepare data for pie chart
        allocation_data = {k: v for k, v in result['allocation'].items() if v > 0}
        
        # Create pie chart with Plotly
        fig_pie = go.Figure(data=[go.Pie(
            labels=list(allocation_data.keys()),
            values=list(allocation_data.values()),
            hole=0.3,
            marker=dict(colors=COLORS[:len(allocation_data)]),
            textinfo='label+percent',
            textposition='auto',
        )])
        
        fig_pie.update_layout(
            showlegend=True,
            height=400,
            margin=dict(t=20, b=20, l=20, r=20)
        )
        
        st.plotly_chart(fig_pie, width='stretch')
    
    with viz_col2:
        st.markdown("### Statistiques du portefeuille")
        
        # Calculate portfolio metrics
        weighted_return = sum(
            (pct / 100) * expected_returns[asset]
            for asset, pct in result['allocation'].items()
        )
        
        portfolio_volatility = sum(
            (pct / 100) * asset_volatility[asset]
            for asset, pct in result['allocation'].items()
        )
        
        # Display metrics
        metric_col1, metric_col2 = st.columns(2)
        with metric_col1:
            st.metric(
                label="Rendement attendu",
                value=f"{weighted_return:.1f}%",
                help="Rendement annuel moyen estimé"
            )
        with metric_col2:
            st.metric(
                label="Volatilité",
                value=f"{portfolio_volatility * 100:.1f}%",
                help="Mesure du risque annuel"
            )
        
        st.markdown("---")
        st.markdown("#### Allocation par montant")
        
        # Show allocation amounts
        for asset, pct in result['allocation'].items():
            if pct > 0:
                montant = (capital * pct) / 100
                st.markdown(f"""
                <div style='padding: 0.5rem; margin: 0.25rem 0; background-color: rgba(99, 102, 241, 0.1); border-radius: 0.375rem;'>
                    <strong>{asset}</strong><br/>
                    <small>{pct}% • {format_currency(montant)}</small>
                </div>
                """, unsafe_allow_html=True)
    
    st.divider()
    
else:
    # Initial state - show instructions
    st.markdown("""
    <div style='text-align: center; padding: 3rem; color: gray;'>
        <h3>Commencez par remplir le formulaire</h3>
        <p>Entrez votre capital et sélectionnez votre tolérance au risque dans la barre latérale,<br/>
        puis cliquez sur "Obtenir ma recommandation" pour voir votre allocation suggérée.</p>
    </div>
    """, unsafe_allow_html=True)

# Footer
st.divider()
st.markdown("""
<div style='text-align: center; color: gray; font-size: 0.875rem; padding: 2rem;'>
    <p><strong>Conseiller en Investissement</strong> - Outil pédagogique</p>
    <p>Développé avec Streamlit + Python | Les informations fournies ne constituent pas un conseil financier professionnel</p>
</div>
""", unsafe_allow_html=True)
