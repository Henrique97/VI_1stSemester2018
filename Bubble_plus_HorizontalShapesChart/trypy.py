
import pandas as pd

df = pd.read_csv("score_by_winery_top100.csv")
df2 = pd.read_csv("winemag-data-130k-v2_with_years.csv")
df2=df2.drop(['Unnamed: 0','Unnamed: 0.1','description','designation','points','price','province','year','taster_name','taster_twitter_handle','title','variety','region_1','region_2'], axis=1)
df2=df2.drop_duplicates()
df['winery']=df['winery'].str.strip()
df2['winery']=df2['winery'].str.strip()
dff=df.merge(df2,on='winery')
dff.to_csv("score_by_winery_top100f.csv")