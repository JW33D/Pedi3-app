import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, Alert, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { fetchCategorias, getSubcategorias, getProductos, subirYGuardarFoto } from '../database/api';


const InventarioFotos = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [isCategoriaMenuVisible, setCategoriaMenuVisible] = useState(false);
  const [isSubcategoriaMenuVisible, setSubcategoriaMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

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

  const fetchProductos = async (subcategoriaId) => {
    try {
      setLoading(true);
      const data = await getProductos(subcategoriaId);
      setProductos(data);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategoria = (categoria) => {
    setSelectedCategoria(categoria);
    fetchSubcategorias(categoria.idCategoria);
    setCategoriaMenuVisible(false);
    setSubcategoriaMenuVisible(true);
  };

  const handleSelectSubcategoria = (subcategoria) => {
    setSelectedSubcategoria(subcategoria);
    fetchProductos(subcategoria.idSubcategoria);
    setSubcategoriaMenuVisible(false);
  };

  const handlePickImage = async (idInventario) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Se necesita permiso para acceder a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      const uri = selectedAsset.uri;
      let fileName = selectedAsset.fileName || uri.split('/').pop();

      const uploadResponse = await subirYGuardarFoto(idInventario, fileName, uri);
      
      if (uploadResponse.success) {
        console.log("Imagen subida y guardada exitosamente:", uploadResponse.data);
        // Actualizar la lista de productos para reflejar la nueva imagen
        fetchProductos(selectedSubcategoria.idSubcategoria);
      } else {
        console.log("Error al subir y guardar la imagen:", uploadResponse.error);
      }
    }
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setImageModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.showMenuButton} onPress={() => setCategoriaMenuVisible(true)}>
       <Text style={styles.buttonText}>Categorías</Text>
     </TouchableOpacity>

      <FlatList  data={productos} keyExtractor={(item) => item.idInventario.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity  style={styles.productContainer} 
            onPress={() => item.urlFoto ? handleImagePress(item.urlFoto) : handlePickImage(item.idInventario)}>
            <Text style={styles.productName}>{item.nombreProducto}</Text>
            {item.urlFoto ? (
              <Image source={{ uri: item.urlFoto }} style={styles.productImage} />
            ) : (
              <Text style={styles.noImageText}>Sin imagen</Text>
            )}
          </TouchableOpacity>
        )}
        numColumns={3}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal para mostrar la imagen grande */}
      <Modal visible={isImageModalVisible} transparent={true} onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setImageModalVisible(false)}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedImageUrl }} style={styles.modalImage} />
        </View>
      </Modal>

      <Modal visible={isCategoriaMenuVisible} animationType="slide" transparent={true} onRequestClose={() => setCategoriaMenuVisible(false)}>
        <View style={styles.ViewSide}>
          <Text style={styles.menuTitle}>Seleccionar Categoría</Text>
          <FlatList
            data={categorias}
            keyExtractor={(item) => item.idCategoria.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.menuItem} onPress={() => handleSelectCategoria(item)}>
                <Text style={styles.buttonText}>{item.Nombre}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Cerrar" color="red" onPress={() => setCategoriaMenuVisible(false)} />
        </View>
      </Modal>

      <Modal visible={isSubcategoriaMenuVisible} animationType="slide" transparent={true} onRequestClose={() => setSubcategoriaMenuVisible(false)}>
        <View style={styles.ViewSide}>
          <Text style={styles.menuTitle}>Seleccionar Subcategoría</Text>
          <FlatList
            data={subcategorias}
            keyExtractor={(item) => item.idSubcategoria.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.menuItem} onPress={() => handleSelectSubcategoria(item)}>
                <Text style={styles.buttonText}>{item.Nombre}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Cerrar" color="red" onPress={() => setSubcategoriaMenuVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

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
  productContainer: {
    marginHorizontal: 10,
    marginVertical: 40,
    width:300,
    alignItems: 'center',
  },
  productList: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productName: {
    fontSize: 20,
    marginBottom: 10,
    marginRight: 50,
  },
  productImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: 1000,
    height: 1000,
    resizeMode: 'contain',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  menuTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  menuItem: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default InventarioFotos;
