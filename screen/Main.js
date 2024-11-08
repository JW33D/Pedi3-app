import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Animated, TouchableOpacity, Image } from 'react-native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa FontAwesome
import styles from './styles/styles';
import { supabase } from '../database/supabase';

const Main = () => {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    'Dynalight-Regular': require('../assets/font/Dynalight-Regular.ttf'),
  });

  const fadeAnimText = useRef(new Animated.Value(0)).current;
  const fadeAnimImage = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimText, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnimImage, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
      delay: 500,
    }).start();
  }, [fadeAnimText, fadeAnimImage]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Botón de lista en la parte superior derecha usando un ícono de FontAwesome */}
      <TouchableOpacity 
        style={styles.listButton} 
        onPress={() => navigation.navigate('Pedidos')}
      >
        <Icon name="list-alt" size={30} color="#000" /> 
      </TouchableOpacity>

      <View style={styles.menuContainer}>
        <Text style={styles.title}>SweetArt</Text>
      </View>

      <View style={styles.leftContainer}>
        <TouchableOpacity style={styles.pedidosButton} onPress={() => navigation.navigate('Croquis')}>
          <Text style={styles.PText}>Pedidos</Text>
          <Image
            source={require('../assets/images/IconoP.jpg')}
            style={styles.iconoP}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.inventarioButton]} onPress={() => navigation.navigate('Inventario')}>
          <Text style={styles.buttonText}>Inventario</Text>
          <Image
            source={require('../assets/images/IconoI.png')}
            style={styles.iconoGeneral}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.ButtonV]} onPress={() => navigation.navigate('Ventas')}>
          <Text style={styles.buttonText}>Ventas</Text>
          <Image
            source={require('../assets/images/IconoV.png')}
            style={styles.iconoGeneral}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.ButtonC]} onPress={() => navigation.navigate('Calendario')}>
          <Text style={styles.CText}>Calendario</Text>
          <Image
            source={require('../assets/images/IconoC.png')}
            style={styles.iconoGeneral}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rightContainer}>
        <Animated.View style={{ opacity: fadeAnimText }}>
          <Text style={styles.welcomeText}>BIENVENIDO</Text>
        </Animated.View>
      </View>

      <Animated.Image
        source={require('../assets/images/coffee.png')}
        style={[styles.coffeeImage, { opacity: fadeAnimImage }]}
        resizeMode="contain"
      />

      {/* Ícono de cerrar sesión en la esquina inferior derecha */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => supabase.auth.signOut()}>
        {/* Asegúrate de que este ícono no genere el error */}
        <Text>
          <Icon name="sign-out" size={30} color="#000" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Main;
