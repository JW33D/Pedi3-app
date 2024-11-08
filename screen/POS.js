import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { fetchCategorias, getSubcategorias, getProductos, VariacionPrecio, guardarPedido, actualizarCantidadProducto, obtenerCantidadActualProducto, guardarPedidosM, actualizarPedidos } from '../database/api';
import { useRoute } from '@react-navigation/native'; // Importar el hook para obtener las rutas
import { useNavigation } from '@react-navigation/native';

const POS = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Obtenemos la información de la ruta
  const { idMesa } = route.params; // Accedemos al ID de la mesa o carro
  const [categorias, setCategorias] = useState([]);
  const modoEdicion = route.params?.modoEdicion || false;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productosPorSubcategoria, setProductosPorSubcategoria] = useState({});
  const [variacionPrecio, setVariacionPrecio] = useState([]); 
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contadorGlobal, setContadorGlobal] = useState({});
  useEffect(() => {
    // Mostrar en consola el ID de la mesa o carro recibido
    console.log('ID de mesa o carro recibido:', idMesa);

    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriasData = await fetchCategorias();
        setCategorias(categoriasData);
        if (categoriasData.length > 0) {
          const defaultCategory = categoriasData[0];
          setSelectedCategory(defaultCategory.idCategoria);
          await fetchAllProductos(defaultCategory.idCategoria);
        }
      } catch (error) {
        console.error("Error al traer las categorías: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idMesa]);

  const fetchAllProductos = async (categoriaId) => {
    try {
      setLoading(true);
      const subcategorias = await getSubcategorias(categoriaId);
      let productosMap = {};
      for (const subcategoria of subcategorias) {
        const productosData = await getProductos(subcategoria.idSubcategoria);
        const productosConSubcategoria = productosData.map((producto) => ({
          ...producto,
          nombreSubcategoria: subcategoria.Nombre, // Agregar nombre de subcategoría
        }));
        console.log("Productos con subcategoría:", productosConSubcategoria); // Verificar la estructura de los productos
        productosMap[subcategoria.Nombre] = productosConSubcategoria;
      }
      setProductosPorSubcategoria(productosMap);
      await handlePreciosExtras();
    } catch (error) {
      console.error("Error al traer los productos: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreciosExtras = async () => {
    try {
      const data = await VariacionPrecio();
      setVariacionPrecio(data);
    } catch (error) {
      console.error("Error al traer los precios extras: ", error);
    }
  };

  const handleSelectCategoria = async (categoriaId) => {
    setSelectedCategory(categoriaId);
    await fetchAllProductos(categoriaId); // Cargar todos los productos de todas las subcategorías de la categoría seleccionada
  };

  const agregarProducto = (producto) => {
    // Obtener el contador actual del producto o inicializar en 0 si no existe
    const contadorActual = contadorGlobal[producto.idInventario] || 0;
  
    console.log(`Contador actual para ${producto.nombreProducto}:`, contadorActual);
  
    // Verificar que el contador no supere la cantidad disponible en inventario
    if (contadorActual < producto.cantidad) {
      setCarrito((prevCarrito) => [
        ...prevCarrito,
        {
          id: `${producto.idInventario}-${Date.now()}`,
          idInventario: producto.idInventario,
          nombreProducto: producto.nombreProducto,
          cantidad: 1,
          precio: producto.precio,
          precioTotal: producto.precio,
          variaciones: {},
          comentario: '',
          nombreSubcategoria: producto.nombreSubcategoria,
        },
      ]);
  
      // Actualizar el contador global para el producto
      setContadorGlobal((prevContador) => ({
        ...prevContador,
        [producto.idInventario]: contadorActual + 1,
      }));
  
      console.log(`Producto ${producto.nombreProducto} agregado. Nuevo contador: ${contadorActual + 1}`);
    } else {
      alert('No se puede agregar más productos que la cantidad en inventario.');
    }
  };
  
  
  
  

  // Agregar variaciones de precio en el carrito
  const agregarVariacion = (producto, variacion) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);

    if (productoEnCarrito) {
      setCarrito((prevCarrito) =>
        prevCarrito.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                precioTotal: item.precioTotal + variacion.precio,
                variaciones: {
                  ...item.variaciones,
                  [variacion.nombre]: (item.variaciones?.[variacion.nombre] || 0) + 1,
                },
              }
            : item
        )
      );
    } else {
      alert('El producto debe estar en el carrito antes de agregar una variación.');
    }
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id, idInventario) => {
    setCarrito((prevCarrito) => {
      const nuevoCarrito = prevCarrito.filter((item) => item.id !== id);
  
      // Actualizar el contador global restando una unidad
      setContadorGlobal((prevContador) => ({
        ...prevContador,
        [idInventario]: (prevContador[idInventario] || 1) - 1,
      }));
  
      console.log(`Producto eliminado. Nuevo contador para ID ${idInventario}:`, contadorGlobal[idInventario] - 1);
      return nuevoCarrito;
    });
  };
  
  

  // Actualizar el comentario de un producto específico en el carrito
  const actualizarComentarioProducto = (id, nuevoComentario) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((item) =>
        item.id === id ? { ...item, comentario: nuevoComentario } : item
      )
    );
  };

  // Calcular el total del precio del carrito
  const totalCarrito = carrito.reduce((total, item) => total + item.precioTotal, 0);

  // Componente para el botón de guardar pedido
  const GuardarPedidoButton = ({ productos, total, idMesa, modoEdicion = false }) => {
    const navigation = useNavigation(); // Instancia de navegación
  
    const handleGuardarPedido = async () => {
      if (productos.length === 0) {
        return; // Evitar que se ejecute si el carrito está vacío
      }
  
      const pedidoJSON = {
        productos: productos.map((producto) => ({
          nombreProducto: `${producto.nombreSubcategoria}-${producto.nombreProducto}`, // Concatenar subcategoría y nombre del producto
          cantidad: producto.cantidad,
          precioUnitario: producto.precio, // Guardar el precio de cada producto
          precioTotal: producto.precioTotal, // Guardar el precio total del producto con variaciones
          variaciones: producto.variaciones,
          comentario: producto.comentario,
        })),
        total: total,
      };
  
      try {
        // Verifica si estamos en modo de edición
        if (modoEdicion) {
          const [response, pedidoMesaResponse] = await Promise.all([
            actualizarPedidos(pedidoJSON, idMesa),
            guardarPedidosM(pedidoJSON, idMesa),
          ]);
          if (response.success && pedidoMesaResponse.success) {
            console.log('Pedido actualizado exitosamente.');
          } else {
            console.error('Error al actualizar el pedido');
            return;
          }
        } else {
          // Guardar el pedido nuevo en ambas tablas
          const [response, pedidoMesaResponse] = await Promise.all([
            guardarPedido(pedidoJSON, idMesa),
            guardarPedidosM(pedidoJSON, idMesa),
          ]);
          if (response.success && pedidoMesaResponse.success) {
            console.log('Pedido guardado exitosamente en ambas tablas.');
          } else {
            console.error('Error al guardar el pedido');
            return;
          }
        }
  
        // Procesar y actualizar inventario
        const productosProcesados = []; // Arreglo para rastrear productos procesados
  
        for (const producto of productos) {
          // Verifica si el producto ya ha sido procesado
          if (productosProcesados.includes(producto.idInventario)) {
            console.log(`Este producto ya se descontó: ${producto.nombreProducto}`);
            continue; // Salta a la siguiente iteración si ya se procesó
          }
  
          // Traer la cantidad actual desde el inventario (de la base de datos)
          const cantidadActualEnInventario = await obtenerCantidadActualProducto(producto.idInventario);
  
          // Usa el contadorGlobal para obtener la cantidad final de cada producto en el carrito
          const contadorCantidad = contadorGlobal[producto.idInventario] || 0;
  
          console.log(`Contador final para ${producto.nombreProducto}: ${contadorCantidad}`);
  
          const nuevaCantidad = cantidadActualEnInventario - contadorCantidad; // Calcula la nueva cantidad
          console.log(`Nueva cantidad de ${producto.nombreProducto} para actualizar en la BD: ${nuevaCantidad}`);
  
          // Actualiza en la base de datos solo si la nueva cantidad es válida
          if (nuevaCantidad >= 0) {
            await actualizarCantidadProducto(producto.idInventario, nuevaCantidad);
  
            // Marca el producto como procesado
            productosProcesados.push(producto.idInventario);
          } else {
            console.warn(`No se puede actualizar. La cantidad de ${producto.nombreProducto} en el inventario sería negativa.`);
          }
        }
  
        navigation.goBack();
        navigation.navigate('Croquis'); // Navega a la pantalla Croquis.js
      } catch (error) {
        console.error('Error inesperado:', error);
      }
    };
  
    return (
      <TouchableOpacity
        style={[styles.saveButton, productos.length === 0 && styles.disabledButton]} // Agregar estilo deshabilitado
        onPress={handleGuardarPedido}
        disabled={productos.length === 0} // Deshabilitar el botón si la lista de compras está vacía
      >
        <Text style={styles.saveButtonText}>Guardar Pedido</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.leftContainer}>
        <View style={styles.tabsContainer}>
          <ScrollView horizontal>
            {categorias.map((item) => (
              <Text
                key={item.idCategoria.toString()}
                style={[
                  styles.tabText,
                  selectedCategory === item.idCategoria && styles.activeTabText,
                ]}
                onPress={() => handleSelectCategoria(item.idCategoria)}
              >
                {item.Nombre}
              </Text>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.productContainer}>
          <Text style={styles.title}>Productos</Text>
          {Object.keys(productosPorSubcategoria).map((subcategoria) => (
            <View key={subcategoria}>
              <Text style={styles.subcategoriaTitle}>{subcategoria}</Text>
              {productosPorSubcategoria[subcategoria].map((producto) => (
                <View key={producto.idInventario.toString()} style={styles.productItem}>
                  <Text style={styles.productText}>Nombre: {producto.nombreProducto}</Text>
                  <Text style={styles.productText}>Cantidad disponible: {producto.cantidad}</Text>
                  <Text style={styles.productText}>Precio: ${producto.precio}</Text>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => agregarProducto(producto)}
                    >
                      <Text style={styles.addButtonText}>Agregar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.cartTitle}>Lista de Compras:</Text>
        <ScrollView>
        {carrito.map((item) => {
  console.log("Item en carrito:", item); // Verificar si nombreSubcategoria está presente
  return (
    <View key={item.id} style={styles.cartThings}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => eliminarProducto(item.id)}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
      <View key={item.id} style={styles.cartItem}>
        <Text style={styles.cartItemText}>
          {item.nombreSubcategoria} - {item.nombreProducto} (x{item.cantidad})
        </Text>
        
        {item.variaciones && Object.keys(item.variaciones).length > 0 ? (
          Object.entries(item.variaciones).map(([nombreVariacion, cantidad]) => (
            <Text key={nombreVariacion} style={styles.variacionText}>
              {nombreVariacion} - {cantidad} veces, precio: ${cantidad * variacionPrecio.find(v => v.nombre === nombreVariacion).precio}
            </Text>
          ))
        ) : (
          <Text style={styles.variacionText}>Sin variaciones disponibles</Text>
        )}
        <Text style={styles.cartItemText}>
          Precio del producto + variaciones = ${item.precioTotal}
        </Text>

        {/* Input para el comentario de cada producto */}
        <TextInput
          style={styles.input}
          placeholder="Comentario del producto"
          value={item.comentario}
          onChangeText={(text) => actualizarComentarioProducto(item.id, text)}
        />

        {/* Botón para agregar variaciones */}
        {variacionPrecio.filter((variacion) => variacion.idInventario === item.idInventario).map((variacion) => (
          <TouchableOpacity
            key={variacion.idVariacion.toString()}
            style={styles.variacionButton}
            onPress={() => agregarVariacion(item, variacion)}
          >
            <Text style={styles.variacionButtonText}>{variacion.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
})}

        </ScrollView>

        <Text style={styles.total}>Total: ${totalCarrito.toFixed(2)}</Text>
        <GuardarPedidoButton productos={carrito} total={totalCarrito} idMesa={idMesa} modoEdicion={modoEdicion}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    padding:20,
  },
  leftContainer: {
    width: '66%', // 2/3 de la pantalla
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  rightContainer: {
    width: '33%', // 1/3 de la pantalla
    backgroundColor: '#dcdcdc',
    padding: 10,
  },
  tabsContainer: {
    marginBottom: 10, // Espacio entre pestañas y productos
  },
  tabText: {
    padding: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeTabText: {
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subcategoriaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  productItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 5,
  },
  productText: {
    fontSize: 14,
  },
  productButtons:{
    flex:1,
    flexDirection:'row',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  variacionButton: {
    backgroundColor: '#17a2b8',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  variacionButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  productContainer: {
    flex: 2,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cartThings:{
  flexDirection: 'row',
  },
  cartItemText: {
    fontSize: 14,
    flex:1,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  commentInput: {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  marginVertical: 10,
  borderRadius: 5,
  fontSize: 14,
},
deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginRight: 10, // Ahora el botón está a la izquierda
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Cambia el color a un gris claro cuando esté deshabilitado
  },
});

export default POS;
