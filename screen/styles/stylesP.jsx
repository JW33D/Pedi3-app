import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Divide la pantalla en 2 columnas
  },
  leftSide: {
    width: width * 0.30, // 1/3 de la pantalla
    height: height,
  },
  rightSide: {
    width: width * 0.70, // 2/3 de la pantalla
    height: height,
    backgroundColor: '#B0ED74', // Fondo verde
  },
  roadImage: {
    width: '100%',
    height: '100%',
  },
  carsContainer: {
    position: 'absolute',
    top: 10, 
    bottom: 0, 
    justifyContent: 'space-around', // Para distribuir los carros verticalmente
    alignItems: 'center',
    width: '100%',
  },
  carImage: {
    width: 100, 
    height: 100, // Ajusta la altura del carro
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10, // Ubicación en la parte baja
    alignSelf: 'center',
    width: 50, // Tamaño del botón, ajusta según tus necesidades
    height: 80,
    left: '37%',
  },
  masImage: {
    width: '150%',
    height: '100%',
  },
   // Estilos para las mesas
   buttonImage: {
    width: '350%',
    height: '200%',
  },
  buttonTopLeft: {
    position: 'absolute',
    top: 24,
    left: 0,
    width: '10%',
    height: '20%',
  },
  buttonTopRight: {
    position: 'absolute',
    top: 24,
    right: 200,
    width: '10%',
    height: '20%',
  },
  buttonBottomLeft: {
    position: 'absolute',
    bottom: 115,
    left: 0,
    width: '10%',
    height: '20%',
  },
  buttonBottomRight: {
    position: 'absolute',
    bottom: 115,
    right: 200,
    width: '10%',
    height: '20%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '40%',
    height: '20%',
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative', // Necesario para el posicionamiento absoluto del botón de cierre
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalText: {
    fontSize: 40,
    backgroundColor: '#007BFF',
    color:'white',
    marginBottom: 0,
    borderRadius: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  
  closeButtonText: {
    color: 'gray',
    fontSize: 16,
  },
});

export default styles;