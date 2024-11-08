import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.001, // Padding basado en el ancho de la pantalla
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: width * 0.03, // Incrementa el tamaño de la fuente para el título
    fontWeight: 'bold',
    marginBottom: width * 0.001,
    color: '#333',
  },
  subtitle: {
    fontSize: width * 0.02, // Incrementa el tamaño de la fuente para subtítulos
    marginBottom: width * 0.002,
    color: '#555',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width * 0.01,
  },
  button: {
    padding: width * 0.01,
    backgroundColor: '#007BFF', // Color de fondo del botón por defecto
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#FF6347', // Color de fondo del botón seleccionado (Tomato)
  },
  buttonText: {
    fontSize: width * 0.027, // Ajusta el tamaño del texto en los botones
    color: '#fff', // Color del texto a blanco
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.01,
    backgroundColor: '#e0e0e0',
    marginBottom: width * 0.01,
  },
  tableHeaderText: {
    fontSize: width * 0.02,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  itemContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: width * 0.02,
  backgroundColor: '#fff',
  marginBottom: width * 0.02,
  borderRadius: 5,
  borderColor: '#ddd',
  borderWidth: 1,
  width: '100%',
},
itemText: {
  fontSize: width * 0.03,
  flex: 2, // Da más espacio al nombre
  textAlign: 'left', // Alinea el nombre a la izquierda
},
inlineContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 4, // Cada contenedor de cantidad y precio toma 1 parte del espacio
},
priceContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end', // Alinea el precio a la derecha
  flex: 2,
},
itemTextInput: {
  fontSize: width * 0.025, // Mantén el tamaño de fuente
  borderBottomWidth: 1,
  borderColor: 'gray',
  paddingVertical: 5,
  marginHorizontal: 10,
  width: width * 0.12, // Ancho fijo para los inputs
  textAlign: 'center',
},
itemLabel: {
    fontSize: width * 0.025,
    marginRight: width * 0.01,
  },
  deleteButton: {
  backgroundColor: '#FF6347', // Color rojo tomate para borrar
  padding: 10,
  borderRadius: 5,
  marginLeft: 10,
},
deleteButtonText: {
  color: 'white',
  fontSize: width * 0.025,
  textAlign: 'center',
},
addButton: {
  backgroundColor: '#B0ED74',
  padding: 15,
  borderRadius: 10,
  marginBottom: 20,
  alignSelf: 'center',
},
addButtonText: {
  color: '#000',
  fontSize: width * 0.025,
  textAlign: 'center',
},

// Estilos para la modal
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  width: '90%',
},
modalTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
},
modalInput: {
  borderColor: '#ccc',
  borderWidth: 1,
  padding: 10,
  borderRadius: 5,
  marginBottom: 15,
  fontSize: 16,
},
modalAddButton: {
  backgroundColor: '#B0ED74',
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
},
modalAddButtonText: {
  textAlign: 'center',
  color: '#000',
  fontSize: 20,
},
modalCancelButton: {
  backgroundColor: '#FF6347',
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
},
modalCancelButtonText: {
  textAlign: 'center',
  color: '#fff',
  fontSize: 18,
},

});
