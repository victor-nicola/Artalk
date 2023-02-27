import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import React from 'react';
import * as Linking from 'expo-linking';
import AuthStack from './routes/AuthStack';

export default function App() {
  const prefix = Linking.createURL('/');
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: '',
        Profile: {
          path: 'profile/:id',
          parse: {
            id: id => `${id}`,
          },
        },
        Search: 'search',
        MakeAPost: 'make_post',
        Followers: {
          path: 'followers/:id',
          parse: {
            id: id => `${id}`,
          },
        },
        Following: {
          path: 'following/:id',
          parse: {
            id: id => `${id}`,
          },
        },
        Likes: {
          path: 'likes/:id',
          parse: {
            id: id => `${id}`,
          },
        },
        Comments: {
          path: 'comments/:id',
          parse: {
            id: id => `${id}`,
          },
        },
        Inbox: 'inbox',
        Chat: {
          path: 'chat/:id',
          parse: {
            id: id => `${id}`,
          },
        },
        Gigs: 'gigs',
        MakeGig: 'make_gig',
        LogIn: 'login',
        SignUp: 'sign_up'
      },
    },
  };
  return (
    <NavigationContainer linking={linking}>
      <AuthStack/>  
    </NavigationContainer>
  );
}
