import { useState } from 'react';

import { View, Image, Text, Linking } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/api';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';

export type Teacher = {
  id: number;
  avatar: string;
  bio: string;
  cost: number;
  name: string;
  subject: string;
  whatsapp: string;
}

type TeacherItem = {
  teacher: Teacher;
  favorited: boolean;
}

export function TeacherItem({ teacher, favorited } : TeacherItem) {
  const [isFavorited, setIsFavorited] = useState(favorited);

  function handleLinkToWhatsapp() {
    api.post('connections', {
      user_id: teacher.id,
    });

    Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`);
  };

  async function handleToggleFavorite() {
    const favorites = await AsyncStorage.getItem('favorites');
    
    let favoritesArray = [];

    if (favorites)
      favoritesArray = JSON.parse(favorites);

    if ( isFavorited ) {
      const favoriteIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
        return teacherItem.id === teacher.id
      });

      favoritesArray.splice(favoriteIndex, 1);
      
      setIsFavorited(false);
    } else {
      favoritesArray.push(teacher);

      setIsFavorited(true);
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image source={{ uri: teacher.avatar }} style={styles.avatar} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>

          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}>
        {teacher.bio}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço por hora {'   '}
          <Text style={styles.priceValue}> R$ {teacher.cost} </Text>        
        </Text>
        
        <View style={styles.buttonsContainer}>
          <RectButton style={[styles.favoriteButton, isFavorited ? styles.favorited : {}]} onPress={handleToggleFavorite}>
            { isFavorited ? (
              <Image source={unfavoriteIcon} resizeMode="contain" />
            ) : (
              <Image source={heartOutlineIcon} resizeMode="contain" />
            )}
          </RectButton>
          
          <RectButton style={styles.contactButton} onPress={handleLinkToWhatsapp}>
            <Image source={whatsappIcon} resizeMode="contain" />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
          </View>
      </View>
    </View>
  );
}