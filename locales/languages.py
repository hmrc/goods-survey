import pandas as pd
import json

df_locales = pd.read_csv('locales.tsv', delimiter='\t')


df_locales = df_locales[df_locales.columns[:3]]

df_locales.columns = ['label', 'en', 'cy']

df_locales.set_index('label', inplace=True)


with open("en.json", "w") as f:
    print(json.dumps(df_locales['en'].to_dict(), indent=2), file=f)
    
with open("cy.json", "w") as f:
    print(json.dumps(df_locales['cy'].to_dict(), indent=2), file=f)