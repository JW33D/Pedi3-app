import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, Modal, Button } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/stylesP';
import { fetchMesas } from '../database/api';
import Icon from 'react-native-vector-icons/FontAwesome';

const Croquis = () => {
  const navigation = useNavigation();
  const [mesas, setMesas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [ocupadas, setOcupadas] = useState([]);
  const [carrosCreados, setCarrosCreados] = useState([]);
  const [carrosOcupados, setCarrosOcupados] = useState([]);

  useEffect(() => {
    const loadMesas = async () => {
      const data = await fetchMesas();
      if (data.length >= 4) {
        setMesas(data);
      }
    };

    const loadOcupadas = async () => {
      const ocupadasData = await AsyncStorage.getItem('ocupadas');
      if (ocupadasData) {
        setOcupadas(JSON.parse(ocupadasData));
      }
    };

    const loadCarrosOcupados = async () => {
      const carrosData = await AsyncStorage.getItem('carrosOcupados');
      if (carrosData) {
        setCarrosOcupados(JSON.parse(carrosData));
      }
    };

    loadMesas();
    loadOcupadas();
    loadCarrosOcupados();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const updateStates = async () => {
        const ocupadasData = await AsyncStorage.getItem('ocupadas');
        const carrosData = await AsyncStorage.getItem('carrosOcupados');

        setOcupadas(ocupadasData ? JSON.parse(ocupadasData) : []);
        setCarrosOcupados(carrosData ? JSON.parse(carrosData) : []);
      };
      updateStates();
    }, [])
  );

  const resetStorage = async () => {
    try {
      await AsyncStorage.removeItem('ocupadas');
      await AsyncStorage.removeItem('carrosOcupados');
    } catch (error) {
      console.log('Error al resetear el almacenamiento local:', error);
    }
  };

  const handleAddCar = () => {
    setCarrosCreados((prevCarros) => {
      if (prevCarros.length < 4) {
        const newCarroId = mesas[4 + prevCarros.length]?.idMesa;
        const nuevosCarrosCreados = [...prevCarros, newCarroId];
        return nuevosCarrosCreados;
      }
      return prevCarros;
    });
  };

  const handleCarPress = (index) => {
    const carroId = mesas[4 + index]?.idMesa;

    if (!carroId) return;

    if (carrosOcupados.includes(carroId)) {
      setMesaSeleccionada(carroId);
      setModalVisible(true);
    } else if (carrosCreados.includes(carroId)) {
      const nuevosCarrosOcupados = [...carrosOcupados, carroId];
      setCarrosOcupados(nuevosCarrosOcupados);
      AsyncStorage.setItem('carrosOcupados', JSON.stringify(nuevosCarrosOcupados));
      navigation.navigate('POS', { idMesa: carroId, comentario: 'Pedido desde carro' });
    } else {
      console.log('Este carro aún no ha sido creado.');
    }
  };

  const handleTablePress = async (tableIndex) => {
    const idMesa = mesas[tableIndex - 1]?.idMesa;
    if (!idMesa) return;

    if (ocupadas.includes(idMesa)) {
      setMesaSeleccionada(idMesa);
      setModalVisible(true);
    } else {
      const nuevasOcupadas = [...ocupadas, idMesa];
      setOcupadas(nuevasOcupadas);
      await AsyncStorage.setItem('ocupadas', JSON.stringify(nuevasOcupadas));
      navigation.navigate('POS', { idMesa, comentario: `Pedido desde la mesa ${idMesa}` });
    }
  };

  const handleEditMesa = () => {
    setModalVisible(false);
    navigation.navigate('POS', { idMesa: mesaSeleccionada, comentario: `Editar pedido de la mesa ${mesaSeleccionada}`, modoEdicion: true });
  };

  const handlePayMesa = async () => {
    setModalVisible(false);

    const nuevasOcupadas = ocupadas.filter((id) => id !== mesaSeleccionada);
    setOcupadas(nuevasOcupadas);
    await AsyncStorage.setItem('ocupadas', JSON.stringify(nuevasOcupadas));

    if (carrosOcupados.includes(mesaSeleccionada)) {
      const nuevosCarrosOcupados = carrosOcupados.filter((id) => id !== mesaSeleccionada);
      const nuevosCarrosCreados = carrosCreados.filter((id) => id !== mesaSeleccionada);
      setCarrosOcupados(nuevosCarrosOcupados);
      setCarrosCreados(nuevosCarrosCreados);
      await AsyncStorage.setItem('carrosOcupados', JSON.stringify(nuevosCarrosOcupados));
    }

    navigation.navigate('Pago', { idMesa: mesaSeleccionada, comentario: `Pagar pedido de la mesa ${mesaSeleccionada}` });
  };

  const getImageForMesa = (idMesa) => {
    const index = ocupadas.indexOf(idMesa);
    if (index !== -1) {
      return index === 0
        ? require('../assets/images/mesaRoja.png')
        : index === 1
        ? require('../assets/images/mesaNaranja.png')
        : require('../assets/images/mesaAmarilla.png');
    }
    return require('../assets/images/mesa.png');
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <Image 
          source={require('../assets/images/carretera.png')}
          style={styles.roadImage} 
          resizeMode="cover"
        />
        <View style={styles.carsContainer}>
          {mesas.slice(4, 8).map((mesa, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCarPress(index)}
            >
              {(carrosCreados.includes(mesa.idMesa) || carrosOcupados.includes(mesa.idMesa)) && (
                <Image
                  source={require('../assets/images/carro.png')}
                  style={styles.carImage}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {carrosCreados.length < 4 && (
          <TouchableOpacity style={styles.buttonContainer} onPress={handleAddCar}>
            <Image 
              source={require('../assets/images/mas.png')} 
              style={styles.masImage} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.rightSide}>
        {mesas.length >= 4 ? (
          <>
            <TouchableOpacity style={styles.buttonTopLeft} onPress={() => handleTablePress(1)}>
              <Image source={getImageForMesa(mesas[0]?.idMesa)} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonTopRight} onPress={() => handleTablePress(2)}>
              <Image source={getImageForMesa(mesas[1]?.idMesa)} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonBottomLeft} onPress={() => handleTablePress(3)}>
              <Image source={getImageForMesa(mesas[2]?.idMesa)} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonBottomRight} onPress={() => handleTablePress(4)}>
              <Image source={getImageForMesa(mesas[3]?.idMesa)} style={styles.buttonImage} />
            </TouchableOpacity>
          </>
        ) : (
          <Text>No hay suficientes mesas disponibles.</Text>
        )}
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
          <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton}  onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={handleEditMesa} >
            <Text style={styles.modalText}>Editar</Text>
            </TouchableOpacity><TouchableOpacity  onPress={handlePayMesa} >
            <Text style={styles.modalText}>Pagar</Text>
            </TouchableOpacity>

 
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Croquis;
