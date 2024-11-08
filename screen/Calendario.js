import React, { useEffect } from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';

const Calendario = ({ navigation }) => {
  useEffect(() => {
    // Abre Google Calendar cuando la pantalla se carga
    Linking.openURL('https://calendar.google.com').catch((err) =>
      console.error("No se pudo abrir Google Calendar", err)
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text>Redirigiendo a Google Calendar...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Calendario;
