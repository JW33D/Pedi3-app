import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    
  },
  leftContainer: {
    flex: 2,
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center',     // Centra horizontalmente
    paddingHorizontal: '5%',
  },
  rightContainer: {
    flex: 1,
    backgroundColor: '#8c8c8c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: '2%',
    left: '3%',
    width:'10000%'
  },
  title: {
    fontSize: 100,
    fontFamily: 'Dynalight-Regular',
    width:'10000%'
    
  },
  welcomeText: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
    left: '5%',
  },
  coffeeImage: {
    position: 'absolute',
    left: '49%',
    top: '20%',
    width: '40%',
    height: '55%',
  },
  pedidosButton: {
    width: '40%',  // Ocupa la mitad del contenedor
    height: '50%',
    backgroundColor: '#c7d8c9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    right: '30%',
    top: '30%',
  },
  inventarioButton: {
    width: '34%',   // Ocupa un cuarto del contenedor
    height: '25%',
    backgroundColor: '#a85958',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    top: '-20%',
    right: '-9%',
  },
  lowerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    
  },
  ButtonC: {
    width: '17%',   // Ocupa un cuarto del contenedor
    height: '22%',
    backgroundColor: '#d1cfe2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    top: '-40%',
    right: '-17%',
  },
  ButtonV: {
    width: '15%',   // Ocupa un cuarto del contenedor
    height: '22%',
    backgroundColor: '#f55c7a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    top: '-18%',
    right: '1%',
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  PText: {
    fontSize: 50,
    color: '#729e78',
    fontWeight: 'bold',
  },
  CText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  iconoGeneral: {
  width: 80,   // Ajusta el tamaño de los íconos según tu preferencia
  height: 80,
  marginTop: 10,  // Espacio entre el texto y el ícono
},
iconoP: {
  width: 200,   // Ancho ajustado a 200
  height: 100,  // Altura ajustada a 100
  marginTop: 10,  // Espacio entre el texto y el ícono
},
logoutButton: {
  position: 'absolute',
  bottom: 20, // Ajusta según sea necesario
  right: 20, // Ajusta según sea necesario
  backgroundColor: 'transparent', // Fondo transparente o ajusta el color según desees
  padding: 10,
  zIndex: 10, // Asegura que el botón esté por encima de otros elementos
},
listButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  padding: 10,
  zIndex: 1,
},
});
