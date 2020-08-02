import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { 
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Linking
   } from 'react-native';

   import moment from 'moment';
   import {Card, Button} from 'react-native-elements';
   import {Icon} from 'react-native-elements';

export default function App() {

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasErrored, setHasApiError] = useState(false);

  const renderArticleItem = ({ item }) => {
    return (
      <Card title={item.title} image={{ uri: item.urlToImage }}>
        <View style={styles.row}>
          <Text style={styles.label}>Source</Text>
          <Text style={styles.info}>{item.source.name}</Text>
        </View>
        <Text style={{ marginBottom: 10 }}>{item.content}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Published</Text>
          <Text style={styles.info}>
            {moment(item.publishedAt).format('LLL')}
          </Text>
        </View>
        <Button
         icon={<Icon />}
          title="Read more"
           backgroundColor="#03A9F4"
           onPress= { () => onPress(item.url)}
           />
      </Card>
    );
  };

  const onPress = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URL: ${url}`);
      }
    });
  };

  const filterForUniqueArticles = arr => {
    const cleaned = [];
    arr.forEach(itm => {
      let unique = true;
      cleaned.forEach(itm2 => {
        const isEqual = JSON.stringify(itm) === JSON.stringify(itm2);
        if (isEqual) unique = false;
      });
      if (unique) cleaned.push(itm);
    });
    return cleaned;
  };

  const getNews =async () => {
    console.log('getNews')

    setLoading(true);
    try {
      const response = await fetch(
        'https://newsapi.org/v2/top-headlines?country=us&apiKey=6f1f179dc42f43a9a38ab4bbe19dde1f'
      );
  
      const jsonData = await response.json();
  
      const newArticleList = filterForUniqueArticles(
        articles.concat(jsonData.articles)
      );
      setArticles(newArticleList);
      //setArticles(articles.concat(jsonData.articles));// update laij sau khi request
      setPageNumber(pageNumber + 1);
    }
    catch(error)
    {
      setHasApiError(true);
    }
  
    
    setLoading(false);
  }

  useEffect(() => {
    getNews();
  } ,[]);

  if(loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator 
        size="large" 
        loading = {loading}
        />
      </View>
    )
  }

  if(hasErrored)
  {
    return (
      <View style = {styles.container}>
        <Text> Error !!! </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
        <View style = {styles.row}>
          <Text style = {styles.article}> Articles Acount: </Text>
          <Text style={styles.infor}>{articles.length}</Text>
        </View>

        <FlatList onEndReached={getNews} onEndReachedThreshold={1} 
          data={articles}
          renderItem={renderArticleItem}
          keyExtractor={item => item.title}
          
          ListFooterComponent={<ActivityIndicator size="large" loading={loading} />}
        />

      {/* {
        articles.map(article => {
          return (
            <Card 
            title={articles[0].title} 
            image={{ uri: articles[0].urlToImage }}>
      
                <View style= {styles.row}>
                  <Text style={styles.article} > Source </Text>
                  <Text style={styles.infor}> {articles[0].source.name} </Text>
          
                </View>
          
                <Text style={styles.content}>
                  {articles[0].content}
                </Text>
          
                <View style= {styles.row}>
                  <Text style={styles.article}> Published</Text>
                  <Text style= {styles.infor}> {moment(articles[0].publishedAt).format('LLL')} </Text>
                </View>
          
                <Button  
                title=" Read more" 
                icon = {<Icon/>} 
                style= {styles.readButton}/>
        </Card>
          )
  
        })
      } */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row'
  },
  article: {
    fontWeight: 'bold',
    fontSize: 20
  },
  infor : {
    fontSize: 15,
    color: "#0080ff",
    marginTop: "3%",
    fontWeight: 'bold'
  },
  content : {
    fontSize: 15,
    color: "#0040ff",
    marginBottom: "3%"
  },
  readButton: {
    marginTop: "2%"
  }

});
