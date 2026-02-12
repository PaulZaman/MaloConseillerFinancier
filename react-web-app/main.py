
def demander_capital():
    while True:
        try:
            capital = float(input("Entrez votre capital à investir (en €) : ").replace(",", "."))
            if capital <= 0:
                print(" Le capital doit être supérieur à 0.")
            else:
                return capital
        except ValueError:
            print(" Entrée invalide. Exemple attendu: 5000 ou 5000.50")

def demander_risque():
    while True:
        risque = input("Tolérance au risque (faible/élevée) : ").strip().lower()

        if risque in ["faible", "élevée", "elevee"]:
            return "élevée" if risque in ["élevée", "elevee"] else "faible"
        print(" Merci d'écrire 'faible' ou 'élevée'.")

def choisir_profil(capital, risque):
    """
    Conditions multiples + logique imbriquée:
    - Si capital faible, on évite de trop diversifier (ou crypto) même si risque élevé
    - Si capital plus élevé, allocation plus 'complète'
    """
    profils = {
        "faible": {
            "sécuritaire": {"Obligations": 50, "ETF Actions": 25, "Cash": 20, "Immobilier/REIT": 5, "Crypto": 0},
            "équilibré":   {"Obligations": 35, "ETF Actions": 40, "Cash": 20, "Immobilier/REIT": 5, "Crypto": 0},
        },
        "élevée": {
            "équilibré":   {"Obligations": 20, "ETF Actions": 60, "Cash": 15, "Immobilier/REIT": 5, "Crypto": 0},
            "dynamique":   {"Obligations": 10, "ETF Actions": 70, "Cash": 10, "Immobilier/REIT": 5, "Crypto": 5},
        }
    }

    # Logique imbriquée: on choisit un "niveau" selon le capital, puis le risque
    if capital < 2000:
        # Capital faible: on privilégie simplicité + sécurité
        if risque == "élevée":
            niveau = "équilibré"  # même si risque élevé, on évite crypto et trop de volatilité
            return profils["faible"][niveau], "Capital < 2 000€ : profil prudent (limitation de la volatilité)."
        else:
            niveau = "sécuritaire"
            return profils["faible"][niveau], "Capital < 2 000€ : profil sécuritaire."
    elif 2000 <= capital < 10000:
        # Capital moyen: plus de flexibilité
        if risque == "élevée":
            niveau = "équilibré"
            return profils["élevée"][niveau], "Capital 2 000–10 000€ : profil équilibré orienté croissance."
        else:
            niveau = "équilibré"
            return profils["faible"][niveau], "Capital 2 000–10 000€ : profil équilibré prudent."
    else:
        # Capital élevé: diversification complète possible
        if risque == "élevée":
            niveau = "dynamique"
            return profils["élevée"][niveau], "Capital ≥ 10 000€ : profil dynamique (diversification + croissance)."
        else:
            niveau = "équilibré"
            return profils["faible"][niveau], "Capital ≥ 10 000€ : profil équilibré (risque maîtrisé)."

def afficher_recommandation(capital, allocation, justification):
    print("\n=================  RECOMMANDATION =================")
    print(f"Capital: {capital:,.2f} €".replace(",", " "))
    print(f"Justification: {justification}")
    print("----------------------------------------------------")

    total_pct = sum(allocation.values())
    if total_pct != 100:
        print(f" Attention: total allocation = {total_pct}% (devrait être 100%).")

    # Boucle for demandée: on parcourt le dictionnaire d'actifs
    for actif, pct in allocation.items():
        montant = capital * pct / 100
        print(f"- {actif:<15} : {pct:>3}%  →  {montant:,.2f} €".replace(",", " "))

    print("====================================================\n")

def main():
    print(" Conseiller en Investissement (outil de décision)\n")
    capital = demander_capital()
    risque = demander_risque()

    allocation, justification = choisir_profil(capital, risque)
    afficher_recommandation(capital, allocation, justification)

    print("Note: ceci est un outil pédagogique (pas un conseil financier).")

# Exécution
main()
