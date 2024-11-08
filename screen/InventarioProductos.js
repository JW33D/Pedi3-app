import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,  Modal, Alert, Button, TextInput } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchCategorias, getSubcategorias, getProductos, agregarProducto, actualizarProducto, bajaProducto, eliminarProducto, 
  VariacionPrecio, agregarVariacion,  actualizarVariacion, eliminarPrecio, 
  obtenerProductos} from '../database/api';


const AdministrarProductos = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [Tproductos, setTProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [isCategoriaMenuVisible, setCategoriaMenuVisible] = useState(false);
  const [isSubcategoriaMenuVisible, setSubcategoriaMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddModalVisible, setAddModalVisible] = useState(false); // Para mostrar/ocultar la modal
  const [isEditModalVisible, setEditModalVisible] = useState(false); // Para mostrar/ocultar la modal de edición
  const [ productoEditable, setProductoEditable] = useState(null); // Almacenar el producto a editar
  const [nuevoProducto, setNuevoProducto] = useState({nombreProducto: '', cantidad: '', precio: ''});
  const [nuevaVariacion, setNuevaVariacion] = useState({ idSubcategoria:  '',  nombre: '', precio: ''});
  const [bajaModalVisible, setBajaModalVisible] = useState(false);
  const [eliminarModalVisible, setEliminarModalVisible] = useState(false);
  const [productoParaBaja, setProductoParaBaja] = useState(null); // Para almacenar el producto seleccionado
  const [productoParaEliminar, setProductoParaEliminar] = useState(null); // Para almacenar el producto seleccionado
  const [precioParaEliminar, setPrecioParaEliminar] = useState(null); 
  const [variacionPrecio, setVariacionPrecio] = useState([]);
  const [mostrarPreciosExtras, setMostrarPreciosExtras] = useState(false)
  const [modalType, setModalType] = useState('producto');
  const [editarVariacion, setEditarVariacion] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const categoriasData = await fetchCategorias();
      setCategorias(categoriasData);
      setLoading(false);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const cargarProductos = async () => {
        setLoading(true);
        const productosObtenidos = await obtenerProductos();
        setTProductos(productosObtenidos);
        setLoading(false);
    };
    cargarProductos();
  }, []);
  const fetchSubcategorias = async (categoriaId) => {
    setMostrarPreciosExtras(false);
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
      setProductos(data); // Establecer los productos obtenidos
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };
  const AddProducto = async () => {
    if (!nuevoProducto.nombreProducto || !nuevoProducto.cantidad || !nuevoProducto.precio) {
      alert('Todos los campos son obligatorios');
      return;
    }
    try {
      // Llamada a la API para agregar el producto
      await agregarProducto({
        nombreProducto: nuevoProducto.nombreProducto,
        cantidad: nuevoProducto.cantidad,
        precio: nuevoProducto.precio,
        idSubcategoria: selectedSubcategoria.idSubcategoria,
      });
      // Limpiar el formulario y cerrar el modal
      setNuevoProducto({ nombreProducto: '', cantidad: '', precio: '' });
      setAddModalVisible(false);
      // Refrescar la lista de productos
      fetchProductos(selectedSubcategoria.idSubcategoria);
    } catch (error) {
      alert( 'No se pudo añadir el producto');
    }
  };
  const AddVariacion = async () => {
    if (!nuevaVariacion.nombre || !nuevaVariacion.precio || !nuevaVariacion.idInventario) {
      alert( 'Todos los campos son obligatorios');
      return;
    }
    try {
      // Llamada a la API que has definido
      await agregarVariacion({
        nombre: nuevaVariacion.nombre,
        precio: nuevaVariacion.precio,
        idInventario: nuevaVariacion.idInventario,
      });
      // Limpiar el formulario y cerrar el modal
      setNuevaVariacion({ nombre: '', precio: '', idInventario: '' });
      setAddModalVisible(false);
      // Opcional: refrescar lista de variaciones o realizar alguna otra acción
      await handlePreciosExtras();
    } catch (error) {
      alert('Error', 'No se pudo añadir la variación');
    }
    
  };
  const UpdateProducto = async () => {
    const { nombreProducto, cantidad, precio, idInventario } = productoEditable;
    if (!nombreProducto || !cantidad || !precio) {
      alert('Todos los campos son obligatorios');
      return;
    }
    try {
      // Llamada a la API para actualizar el producto
      await actualizarProducto({ nombreProducto, cantidad, precio, idInventario });
      // Cerrar el modal y refrescar los productos
      setEditModalVisible(false);
      fetchProductos(selectedSubcategoria.idSubcategoria);
    } catch (error) {
     alert('No se pudo actualizar el producto');
    }
  };
  const UpdateVariacion = async () => {
    const { nombre, precio,  idVariacion } = editarVariacion;
  
    // Validar que todos los campos estén completos
    if (!nombre || !precio ) {
      alert('Todos los campos son obligatorios');
      return;
    }
  
    try {
      // Llamada a la API para actualizar la variación
      await actualizarVariacion({ nombre, precio,  idVariacion });
  
      // Cerrar el modal y refrescar la lista de variaciones
      setEditModalVisible(false);
      await handlePreciosExtras();
      } catch (error) {
      alert('No se pudo actualizar la variación');
    }
  };
  const confirmarBaja = async () => {
    try {
      // Llamada a la API para dar de baja el producto
      await bajaProducto(productoParaBaja.idInventario);
      
      // Mostrar mensaje de éxito, cerrar modal y refrescar productos
      Alert.alert('Éxito', 'Producto dado de baja');
      setBajaModalVisible(false);
      fetchProductos(selectedSubcategoria.idSubcategoria);
    } catch (error) {
      Alert.alert('Error', 'No se pudo dar de baja el producto');
    }
  };
  const confirmarEliminar = async () => {
    try {
      // Llamada a la API para eliminar el producto
      await eliminarProducto(productoParaEliminar.idInventario);
      
      // Mostrar mensaje de éxito, cerrar modal y refrescar productos
      Alert.alert('Éxito', 'Producto eliminado');
      setEliminarModalVisible(false);
      fetchProductos(selectedSubcategoria.idSubcategoria);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };
  const eliminarPrecios = async () => {
    try {
      // Llamada a la API para eliminar el producto
      await eliminarPrecio(precioParaEliminar.idVariacion);
      
      // Mostrar mensaje de éxito, cerrar modal y refrescar productos
      Alert.alert('Éxito', 'Producto eliminado');
      setEliminarModalVisible(false);
      await handlePreciosExtras();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto');
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
  const handleEditProducto = (item) => {
    setProductoEditable(item); // Establece el producto actual para edición
    setEditarVariacion(item);
    setEditModalVisible(true); // Muestra la modal de edición
  };
  const handleBaja = (producto) => {
    setProductoParaBaja(producto);
    setBajaModalVisible(true);
  };
  const handleEliminar = (producto) => {
    setProductoParaEliminar(producto);
    setPrecioParaEliminar(producto)
    setEliminarModalVisible(true);
  };
  const handlePreciosExtras = async () => {
    try {
      const data = await VariacionPrecio(); // Llamada a la función que trae los datos de la API
      setVariacionPrecio(data); // Actualiza los datos obtenidos
      setMostrarPreciosExtras(true); // Cambia la cabecera para mostrar la vista de "Precios Extras"
    } catch (error) {
      console.error("Error al traer los precios extras: ", error);
    }
  };
  
return (
  <View style={styles.container}>
    {/* Botón para mostrar el menú lateral de categorías en la esquina superior izquierda */}
     <TouchableOpacity style={styles.showMenuButton} onPress={() => setCategoriaMenuVisible(true)}>
       <Text style={styles.buttonText}>Categorías</Text>
     </TouchableOpacity>
     <TouchableOpacity style={styles.showPrecios} onPress={handlePreciosExtras}>
      <Text style={styles.buttonText}>Precios Extras</Text>
    </TouchableOpacity>
    {/* Etiquetas de la tabla */}
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>Nombre</Text>
      <Text style={styles.tableHeaderText}>{mostrarPreciosExtras ? 'Producto' : 'Cantidad'}</Text>
      <Text style={styles.tableHeaderText}>Precio</Text>
      <Text style={styles.tableHeaderText}>Acciones</Text>
    </View>
    {/* Lista de productos o variaciones de precio en formato de tabla */}
    <FlatList data={mostrarPreciosExtras ? variacionPrecio : productos} keyExtractor={(item) => item.idInventario ? item.idInventario.toString() : item.idVariacion.toString()}
  renderItem={({ item }) => {
    // Buscar el nombre de la subcategoría en Tsubcategorias
    const productoSeleccionado = Tproductos.find(
      (producto) => producto.idInventario === item.idInventario
    );

    return (
      <View style={styles.tableRow}>
        {/* Mostrar el nombre del producto */}
        <Text style={styles.tableCell}>{item.nombreProducto || item.nombre}</Text>

        {/* Mostrar cantidad o nombre de la subcategoría */}
        <Text style={styles.tableCell}>
          {!mostrarPreciosExtras ? item.cantidad : (productoSeleccionado ? productoSeleccionado.nombreProducto : "Sin subcategoría")}
        </Text>

        {/* Mostrar el precio */}
        <Text style={styles.tableCell}>{item.precio}</Text>

        {/* Botones de acciones */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity  onPress={() => {
    if (mostrarPreciosExtras) {
      setModalType('variacion'); // Define el tipo de modal a mostrar
    } else {
      setModalType('producto');
    }
    handleEditProducto(item); }}>
            <Icon name="edit" size={24} color="#4CAF50" />
          </TouchableOpacity>
          {!mostrarPreciosExtras && (
            <Button title="Suspender" color="#FF5722" onPress={() => handleBaja(item)} />
          )}
          <Button title=" Eliminar " color="red" onPress={() => {
    if (mostrarPreciosExtras) {
      setModalType('variacion'); // Define el tipo de modal a mostrar
    } else {
      setModalType('producto');
    }
    handleEliminar(item); }}/>
        </View>
      </View>
    );
  }}
/>

{/* Modal para Añadir Producto */}
{modalType === 'producto' && (
  <Modal  visible={isAddModalVisible}  animationType="slide"   transparent={true}  onRequestClose={() => setAddModalVisible(false)}>
  <View style={styles.modalContainer}>
  <View style={styles.modal}>
        <Text style={styles.title}>Añadir Producto</Text>
        <Text style={styles.label}>Categoría: {selectedCategoria?.Nombre}</Text>
        <Text style={styles.label}>Subcategoría: {selectedSubcategoria?.Nombre}</Text>

        {/* Campos para nombre, cantidad y precio del producto */}
        <TextInput 
          placeholder="Nombre del Producto" 
          value={nuevoProducto.nombreProducto} 
          onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, nombreProducto: text })}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Cantidad" 
          value={nuevoProducto.cantidad} 
          keyboardType="numeric" 
          onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, cantidad: text })}
          style={styles.input} 
        />
        <TextInput 
          placeholder="Precio" 
          value={nuevoProducto.precio} 
          keyboardType="numeric" 
          onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, precio: text })}
          style={styles.input} 
        />

        {/* Botones para cancelar o guardar */}
        <View style={styles.modalButtonContainer}>
          <Button title="Cancelar" color="#FF5722" onPress={() => setAddModalVisible(false)} />
          <Button title="Guardar" onPress={AddProducto} />
        </View>
      </View>
    </View>
  </Modal>
)}

{/* Modal para Añadir Variación */}
{modalType === 'variacion' && (
  <Modal  visible={isAddModalVisible}  animationType="slide"  transparent={true}  onRequestClose={() => setAddModalVisible(false)}>
  <View style={styles.modalContainer}>
  <View style={styles.modal}>
          <Text style={styles.title}>Añadir Variación de Precio</Text>
          <Text style={styles.label}>Producto:</Text>
          <Picker selectedValue={nuevaVariacion.idInventario} onValueChange={(itemValue) => {
          setNuevaVariacion({ ...nuevaVariacion, idInventario: itemValue });}}
          style={styles.picker}>
  {Tproductos.map((producto) => (
    <Picker.Item 
      key={producto.idInventario} 
      label={producto.nombreProducto} 
      value={producto.idInventario} 
    />
  ))}
</Picker>
          {/* Campos para nombre y precio */}
          <TextInput  placeholder="Nombre de la Variación"  value={nuevaVariacion.nombre}  onChangeText={(text) => setNuevaVariacion({ ...nuevaVariacion, nombre: text })}  style={styles.input}/>
          <TextInput   placeholder="Precio"  value={nuevaVariacion.precio} 
            keyboardType="numeric" 
            onChangeText={(text) => setNuevaVariacion({ ...nuevaVariacion, precio: text })} 
            style={styles.input}
          />
          {/* Botones para cancelar o guardar */}
          <View style={styles.modalButtonContainer}>
            <Button title="Cancelar" color="#FF5722" onPress={() => setAddModalVisible(false)} />
            <Button title="Guardar" onPress={AddVariacion} />
          </View>
        </View>
      </View>
    </Modal>

)}

{/* Modal para editar*/}
{modalType === 'producto' && (
  <Modal visible={isEditModalVisible} animationType="slide" transparent={true} onRequestClose={() => setEditModalVisible(false)}>
  <View style={styles.modalContainer}>
    <View style={styles.modal}>
      <Text style={styles.title}>Editar Producto</Text>
      {/* Mostrar Categoría y Subcategoría (no editables) */}
        <Text style={styles.label}>Categoría: {selectedCategoria?.Nombre}</Text>
        <Text style={styles.label}>Subcategoría: {selectedSubcategoria?.Nombre}</Text>
      {/* Campos para modificar nombre, cantidad y precio */}
        <TextInput placeholder="Nombre del Producto" value={productoEditable?.nombreProducto} onChangeText={(text) => setProductoEditable({ ...productoEditable, nombreProducto: text })} style={styles.input} />
        <TextInput  placeholder="Cantidad" value={productoEditable?.cantidad} keyboardType="numeric" onChangeText={(text) => setProductoEditable({ ...productoEditable, cantidad: text })} style={styles.input} />
       <TextInput placeholder="Precio" value={productoEditable?.precio} keyboardType="numeric" onChangeText={(text) => setProductoEditable({ ...productoEditable, precio: text })} style={styles.input} />
      <View style={styles.modalButtonContainer}>
            <Button title="Cancelar" color="#FF5722"  onPress={() => setEditModalVisible(false)}/>
            <Button title="Guardar"  onPress={UpdateProducto} />
      </View>
    </View>
  </View>
</Modal>
)}

{/* Modal para Añadir Variación */}
{modalType === 'variacion' && (
  <Modal visible={isEditModalVisible} animationType="slide" transparent={true} onRequestClose={() => setEditModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.title}>Editar Variación de Precio</Text>

          {/* Nombre de la variación */}
          <TextInput
            placeholder="Nombre de la Variación"
            value={editarVariacion?.nombre}
            onChangeText={(text) => setEditarVariacion({ ...editarVariacion, nombre: text })}
            style={styles.input}
          />

          {/* Precio */}
          <TextInput
            placeholder="Precio"
            value={editarVariacion?.precio}
            keyboardType="numeric"
            onChangeText={(text) => setEditarVariacion({ ...editarVariacion, precio: text })}
            style={styles.input}
          />

          {/* Botones */}
          <View style={styles.modalButtonContainer}>
            <Button title="Cancelar" color="#FF5722" onPress={() => setEditModalVisible(false)} />
            <Button title="Guardar" onPress={UpdateVariacion} />
          </View>
        </View>
      </View>
    </Modal>


)}

{/* Modal para mostrar la de baja */}
<Modal animationType="slide" transparent={true} visible={bajaModalVisible} onRequestClose={() => setBajaModalVisible(false)}>
<View style={styles.modalContainer}>
<View style={styles.modal}>
    <View style={styles.centro}>
    <Text style={styles.title}>Dar de baja</Text>
      <Text style={styles.label}>¿Está seguro de dar de baja este producto?</Text>
      </View>
        <View style={styles.modalButtonContainer}>
            <Button title="Cancelar" color="#FF5722" onPress={() => setBajaModalVisible(false)} />
            <Button title="Suspender" color="red" onPress={confirmarBaja} />
      </View>
    </View>
  </View>
</Modal>
{/* Modal para mostrar la de eliminar */}
{modalType == 'producto' &&(
  <Modal animationType="slide" transparent={true} visible={eliminarModalVisible} onRequestClose={() => setEliminarModalVisible(false)}>
  <View style={styles.modalContainer}>
    <View style={styles.modal}>
      <View style={styles.centro}>
      <Text style={styles.title}>Eliminar Producto</Text>
      <Text style={styles.label}>¿Está seguro de eliminar este producto?</Text>
      </View>
      <View style={styles.modalButtonContainer}>
            <Button title="Cancelar" color="#FF5722" onPress={() => setEliminarModalVisible(false)}/>
            <Button title="Eliminar" color="red" onPress={confirmarEliminar} />
      </View>
    </View>
  </View>
</Modal>
)}
{/* Modal para mostrar la de eliminar */}
{modalType == 'variacion' && (
  <Modal animationType="slide" transparent={true} visible={eliminarModalVisible} onRequestClose={() => setEliminarModalVisible(false)}>
  <View style={styles.modalContainer}>
    <View style={styles.modal}>
      <View style={styles.centro}>
      <Text style={styles.title}>Eliminar Precio</Text>
      <Text style={styles.label}>¿Está seguro de eliminar este producto?</Text>
      </View>
      <View style={styles.modalButtonContainer}>
            <Button title="Cancelar" color="#FF5722" onPress={() => setEliminarModalVisible(false)}/>
            <Button title="Eliminar" color="red" onPress={eliminarPrecios} />
      </View>
    </View>
  </View>
</Modal>
)}

{/* Modal para mostrar el menú lateral de categorías */}
<Modal visible={isCategoriaMenuVisible} animationType="slide" transparent={true} onRequestClose={() => setCategoriaMenuVisible(false)}>
        <View style={styles.ViewSide}>
          <Text style={styles.menuTitle}>Seleccionar Categoría</Text>
            <FlatList data={categorias} keyExtractor={(item) => item.idCategoria.toString()} renderItem={({ item }) => (
                <TouchableOpacity style={styles.menuItem} onPress={() => handleSelectCategoria(item)}>
                  <Text style={styles.buttonText}>{item.Nombre}</Text>
               </TouchableOpacity>
               )}
            />
            <View>
            <Button  title="Cerrar" color="red"  onPress={() => setCategoriaMenuVisible(false)} />
            </View>
        </View>
</Modal>
{/* Modal para mostrar el menú lateral de subcategorías */}
<Modal visible={isSubcategoriaMenuVisible} animationType="slide" transparent={true} onRequestClose={() => setSubcategoriaMenuVisible(false)}>
        <View style={styles.ViewSide}>
        <Text style={styles.menuTitle}>Seleccionar Subcategoría</Text>
            <FlatList data={subcategorias} keyExtractor={(item) => item.idSubcategoria.toString()} renderItem={({ item }) => (
                <TouchableOpacity style={styles.menuItem} onPress={() => handleSelectSubcategoria(item)}>
                  <Text style={styles.buttonText}>{item.Nombre}</Text>
                </TouchableOpacity>
                 )}
              />
              <Button  title="Cerrar" color="red"   onPress={() => setSubcategoriaMenuVisible(false)} />
        </View>


</Modal>
      <Button title={mostrarPreciosExtras ? "Añadir Variación" : "Añadir Producto"} color="#007BFF" onPress={() => {
    if (mostrarPreciosExtras) {
      setModalType('variacion'); // Define el tipo de modal a mostrar
    } else {
      setModalType('producto');
    }
    setAddModalVisible(true); }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  showMenuButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  showPrecios: {
    position: 'absolute',
    top: 30,
    left: 150,
    padding: 15,
    backgroundColor: '#af7ead',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tableCell: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    alignItems: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20, // Añadir espacio extra entre el botón y el título
    color: '#fff',
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  centro:{
    justifyContent: 'center',
    alignItems: 'center',
  }
 
});

export default AdministrarProductos;
