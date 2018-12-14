
import pandas as pd

#df = pd.read_csv("score_by_winery_top100.csv")
df2 = pd.read_csv("winemag-data-130k-v2_with_years.csv")
df2=df2.drop(['Unnamed: 0','Unnamed: 0.1','description','designation','province','year','taster_name','taster_twitter_handle','variety','region_1','region_2'], axis=1)
#df2=df2.drop_duplicates()
#df['winery']=df['winery'].str.strip()
df2['winery']=df2['winery'].str.strip()
#dff=df.merge(df2,on='winery')
df2=df2.sort_values(['country','points'],ascending=[True, False])
#dff.to_csv("score_by_winery_top100f.csv")
countrycomp='Argentina'
counter=0
name=""

df=pd.DataFrame(columns=df2.columns)
for index, row in df2.iterrows():
    if row['country'] != '' and row['country'] != 'nan':
        if row['country']==countrycomp:
            if(counter<100):
                df=df.append(row)
                counter+=1
        else:
            countrycomp=row['country']
            counter=0
            name=df.iloc[0:1,0:1].values[0][0]
            df.to_csv('{}.{}'.format(name.strip(), 'csv'))
            df=pd.DataFrame(columns=df2.columns)
            df=df.append(row)
            counter+=1
