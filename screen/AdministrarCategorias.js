import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Button, TextInput  } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchCategorias,getSubcategorias, darDeBajaSubcategoria, eliminarSubcategoria, agregarSubcategoria, actualizarSubcategoria } from "../database/api";


const AdministrarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false); 
  const [editModalVisible, setEditModalVisible] = useState(false); 
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false); // Nuevo estado para el modal de confirmación
  const [confirmBajaModalVisible, setConfirmBajaModalVisible] = useState(false); 
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [newSubcategoriaNombre, setNewSubcategoriaNombre] = useState(""); 
  const [editSubcategoriaNombre, setEditSubcategoriaNombre] = useState(""); 
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const categoriasData = await fetchCategorias();
      setCategorias(categoriasData);
      setLoading(false);
    };
    fetchData();
  }, []);
  const fetchSubcategorias = async (categoriaId) => {
    try {
      setLoading(true);
      const data = await getSubcategorias(categoriaId);
      setSubcategorias(data);
    } catch (error) {
      console.error("Error al traer las subcategorías: ", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCategoriaSelect = (categoria) => {
    setSelectedCategoria(categoria);
    fetchSubcategorias(categoria.idCategoria);
    setModalVisible(false);
  };
  const darDeBaja = async (idSubcategoria) => {
    try {
      await darDeBajaSubcategoria(idSubcategoria);
      fetchSubcategorias(selectedCategoria.idCategoria);
      closeConfirmBajaModal();
    } catch (error) {
      console.error("Error al dar de baja la subcategoría: ", error);
    }
  };
  const deleteSubcategoria = async (idSubcategoria) => {
    try {
      await eliminarSubcategoria(idSubcategoria);
      fetchSubcategorias(selectedCategoria.idCategoria);
      setConfirmDeleteModalVisible(false);
    } catch (error) {
      console.error("Error al eliminar la subcategoría: ", error);
    }
  };
   // Función para actualizar la subcategoría
  const editSubcategoria = async () => {
    if (!editSubcategoriaNombre) {
      Alert.alert("Error", "El nombre de la subcategoría no puede estar vacío.");
      return;
    }
    try {
      await actualizarSubcategoria(selectedSubcategoria.idSubcategoria, editSubcategoriaNombre);
      fetchSubcategorias(selectedCategoria.idCategoria);
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar la subcategoría: ", error);
    }
  };
 // Función para agregar una nueva subcategoría
  const addSubcategoria = async () => {
    if (!newSubcategoriaNombre) {
      Alert.alert("Error", "El nombre de la subcategoría no puede estar vacío.");
      return;
    }
    try {
      await agregarSubcategoria(newSubcategoriaNombre, selectedCategoria.idCategoria);
      fetchSubcategorias(selectedCategoria.idCategoria);
      setAddModalVisible(false);
      setNewSubcategoriaNombre("");
    } catch (error) {
      console.error("Error al añadir la subcategoría: ", error);
    }
  };
  // Función para abrir la modal de confirmación de eliminación
  const openConfirmDeleteModal = (idSubcategoria) => {
    setSelectedSubcategoria(idSubcategoria);
    setConfirmDeleteModalVisible(true);
  };
  // Función para cerrar el modal de confirmación
  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModalVisible(false);
  };
  // Función para abrir la modal de confirmación de eliminación
  const openConfirmBajaModal = (idSubcategoria) => {
    setSelectedSubcategoria(idSubcategoria);
    setConfirmBajaModalVisible(true);
  };
  const closeConfirmBajaModal = () => {
    setConfirmBajaModalVisible(false);
  };
  // Función para abrir la modal de edición
  const openEditModal = (subcategoria) => {
    setSelectedSubcategoria(subcategoria);
    setEditSubcategoriaNombre(subcategoria.Nombre);
    setEditModalVisible(true);
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.showMenuButton} onPress={() => setModalVisible(true)}>
       <Text style={styles.buttonText}>Categorías</Text>
     </TouchableOpacity>

      {/* Modal para mostrar categorías */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.ViewSide}>
        <Text style={styles.title}>Selecciona una Categoría</Text>
          <FlatList
            data={categorias}
            keyExtractor={(item, index) => item.idCategoria ? item.idCategoria.toString() : `${item.nombre}_${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.menuItem} onPress={() => handleCategoriaSelect(item)}>
                <Text style={styles.buttonText}>{item.Nombre}</Text>
              </TouchableOpacity>
            )}
          />
          <Button  title="Cerrar" color="red"   onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      {/* Modal para añadir una nueva subcategoría */}
      <Modal visible={addModalVisible} animationType="slide" onRequestClose={() => setAddModalVisible(false)}>
      <View style={styles.modalContainer}>
      <View style={styles.modal}>
          <Text style={styles.title}>Añadir Subcategoría a {selectedCategoria?.Nombre}</Text>
          <TextInput placeholder="Nombre de la subcategoría"  value={newSubcategoriaNombre}  onChangeText={setNewSubcategoriaNombre} style={styles.input}/>
          <View style={styles.modalButtonContainer}>
          <Button title="Cancelar" color="#FF5722"  onPress={() => setAddModalVisible(false)}/>
            <Button title="Guardar"  onPress={addSubcategoria} />
          </View>
          </View>
        </View>
      </Modal>
      {/* Modal para editar subcategoría */}
      <Modal  visible={editModalVisible}  animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
       <View style={styles.modalContainer}>
         <View style={styles.modal}>
          <Text style={styles.title}>Editar Subcategoría</Text>
          <TextInput placeholder="Nuevo nombre de la subcategoría"  value={editSubcategoriaNombre}  onChangeText={setEditSubcategoriaNombre} style={styles.input}/>
          <View style={styles.modalButtonContainer}>
            <Button title="Cancelar" color="#FF5722" onPress={() => setEditModalVisible(false)} />
            <Button title="Guardar" onPress={editSubcategoria} />
          </View>
          </View>
        </View>
      </Modal>
      {/* Modal de confirmación de eliminación */}
      <Modal visible={confirmDeleteModalVisible} animationType="slide" onRequestClose={closeConfirmDeleteModal}>
        <View style={styles.modalContainer}>
            <View style={styles.modal}>
          <View style={styles.centro}>
          <Text style={styles.title}>Confirmar eliminación</Text>
          <Text style={styles.label}>¿Estás seguro de que deseas eliminar esta subcategoría de forma permanente?</Text>
          </View>
          <View style={styles.modalButtonContainer}>
            <Button title="Cancelar" color="#FF5722" onPress={closeConfirmDeleteModal} />
            <Button title="Eliminar" color="red" onPress={() => deleteSubcategoria(selectedSubcategoria)} />
          </View>
          </View>
        </View>
      </Modal>
      {/* Modal de confirmación de baja */}
      <Modal visible={confirmBajaModalVisible} animationType="slide" onRequestClose={closeConfirmBajaModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <View style={styles.centro}>
          <Text style={styles.title}>Confirmar Baja</Text>
          <Text style={styles.label}>¿Estás seguro de que deseas dar de baja esta subcategoría?</Text>
          </View>
          <View style={styles.modalButtonContainer}>
            <Button title="Cancelar" color="#FF5722" onPress={closeConfirmBajaModal} />
            <Button title="Suspender" color="red" onPress={() => darDeBaja(selectedSubcategoria)} />
          </View>
          </View>
        </View>
      </Modal>
      {/* Mostrar las subcategorías si hay una categoría seleccionada */}
      {selectedCategoria && (
        <>
          <Text style={styles.titleS}>Subcategorías de {selectedCategoria.Nombre}</Text>
          <FlatList data={subcategorias}
            keyExtractor={(item, index) => item.idSubcategoria ? item.idSubcategoria.toString() : `${item.nombre}_${index}`}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item.Nombre}</Text>
                  <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Icon name="edit" size={24} color="#4CAF50" />
                  </TouchableOpacity>
                  <Button title="Suspender" color="#FF5722"  onPress={() => openConfirmBajaModal(item.idSubcategoria)}/>
                  <Button title=" Eliminar " color="red" onPress={() => openConfirmDeleteModal(item.idSubcategoria)} />
                </View>
              </View>
            )}
          />
        </>
      )}
      {/* Botón de añadir siempre visible */}
      <View style={styles.addButtonContainer}>
        <Button title="Añadir Subcategoría" onPress={() => setAddModalVisible(true)} />
      </View>
    </View>
  );
};

export default AdministrarCategorias;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60, 
    backgroundColor: '#f5f5f5',
  },
  ViewSide:{
    flex: 1,
    backgroundColor: '#374151', // Fondo blanco predeterminado
    padding: 20,
    width: 970,
    left: 0,
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,           
  },
  modal:{
    backgroundColor: '#374151', // Color de fondo, predeterminado a blanco
    margin: '5%', // Margen
    padding: 20, // Relleno
    borderRadius: 8,
  },
  modalContainer:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  showMenuButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
  },
  menuItem: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginBottom: 10,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 18,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  }, 
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10, // Añadir espacio extra entre el botón y el título
    color: '#fff',
  },
  titleS: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50, // Añadir espacio extra entre el botón y el título
  },
  label: {
    fontSize: 30,
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color:'#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 30,
  },
  centro:{
    justifyContent: 'center',
    alignItems: 'center',
  }
});
