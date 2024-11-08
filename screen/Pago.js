import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { getPedidos, guardarVenta, eliminarPedido, eliminarPedidosM } from '../database/api';
import { imprimirTicket } from '../components/Ticket';

const PagoScreen = ({ route, navigation }) => {
  const { idMesa } = route.params;
  const [pedido, setPedido] = useState(null);
  const [productosCombinados, setProductosCombinados] = useState([]);
  const [totalCombinado, setTotalCombinado] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [clienteProductos, setClienteProductos] = useState({});
  const [productoCantidades, setProductoCantidades] = useState({});
  const [efectivo, setEfectivo] = useState('');
  const [isPagoHabilitado, setIsPagoHabilitado] = useState(false); // Estado para habilitar el botón

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const registros = await getPedidos(idMesa);
        let productosTotales = [];
        let totalAcumulado = 0;

        registros.forEach((registro) => {
          const { productos, total } = registro.pedidoM;
          totalAcumulado += total;
          
          productos.forEach((producto, index) => {
            productosTotales.push({
              ...producto,
              uniqueId: `${producto.nombreProducto}-${index}-${Math.random()}`,
            });
          });
        });

        setProductosCombinados(productosTotales);
        setTotalCombinado(totalAcumulado);

        const cantidadesIniciales = {};
        productosTotales.forEach((producto) => {
          cantidadesIniciales[producto.uniqueId] = producto.cantidad;
        });
        setProductoCantidades(cantidadesIniciales);

      } catch (error) {
        console.error("Error al obtener el pedido:", error);
      }
    };
    fetchPedido();
  }, [idMesa]);

  useEffect(() => {
    // Actualizar si el botón de pago debe estar habilitado
    setIsPagoHabilitado(parseFloat(efectivo) >= totalCombinado);
  }, [efectivo, totalCombinado]);

  const agregarCliente = () => {
    const nuevoCliente = `Cliente ${clientes.length + 1}`;
    setClientes([...clientes, nuevoCliente]);
    setClienteProductos({ ...clienteProductos, [nuevoCliente]: [] });
  };

  const eliminarCliente = (clienteIndex) => {
    const nuevosClientes = clientes.filter((_, index) => index !== clienteIndex);
    const clienteProductosActualizados = { ...clienteProductos };
    const clienteAEliminar = clientes[clienteIndex];

    // Restaurar las cantidades de productos al eliminar un cliente
    const productosAEliminar = clienteProductosActualizados[clienteAEliminar] || [];
    const cantidadesRestauradas = { ...productoCantidades };
    productosAEliminar.forEach((producto) => {
      cantidadesRestauradas[producto.uniqueId] += producto.cantidad;
    });
    setProductoCantidades(cantidadesRestauradas);

    delete clienteProductosActualizados[clienteAEliminar];
    setClientes(nuevosClientes.map((_, idx) => `Cliente ${idx + 1}`));
    setClienteProductos(clienteProductosActualizados);
  };

  const seleccionarProducto = (producto, cliente) => {
    setClienteProductos((prevState) => {
      const productosAsignados = prevState[cliente] || [];
      const productoExistente = productosAsignados.find((p) => p.uniqueId === producto.uniqueId);

      if (productoExistente) {
        if (productoExistente.cantidad > 1) {
          productoExistente.cantidad -= 1;
        } else {
          return {
            ...prevState,
            [cliente]: productosAsignados.filter((p) => p.uniqueId !== producto.uniqueId),
          };
        }
        setProductoCantidades((prevCantidades) => ({
          ...prevCantidades,
          [producto.uniqueId]: prevCantidades[producto.uniqueId] + 1,
        }));
      } else if (productoCantidades[producto.uniqueId] > 0) {
        productosAsignados.push({ ...producto, cantidad: 1 });
        setProductoCantidades((prevCantidades) => ({
          ...prevCantidades,
          [producto.uniqueId]: prevCantidades[producto.uniqueId] - 1,
        }));
      }

      return { ...prevState, [cliente]: [...productosAsignados] };
    });
  };

  const calcularSubtotal = (productos) => {
    return productos.reduce((total, producto) => total + producto.precioTotal * producto.cantidad, 0);
  };

  const completarPago = async () => {
    try {
      await guardarVenta(totalCombinado, idMesa);
      await eliminarPedido(idMesa);
      await eliminarPedidosM(idMesa);

      // Generar el JSON del ticket y llamar a la función de impresión
      const jsonTicket = generarJSONTicket();
      imprimirTicket(jsonTicket);  // Llamada a la función de impresión

      // Navegar a la pantalla de croquis después de completar el pago
      navigation.navigate('Croquis');
    } catch (error) {
      console.error("Error al completar el pago:", error);
    }
  };

  const cambio = parseFloat(efectivo) >= totalCombinado ? parseFloat(efectivo) - totalCombinado : 0;

  const renderProducto = ({ item }) => (
    <View style={styles.productoContainer}>
      <Text style={styles.nombreProducto}>{item.nombreProducto}</Text>
      <Text style={styles.cantidad}>Cantidad: {item.cantidad}</Text>
      <Text style={styles.precioTotal}>${item.precioTotal}</Text>
      {item.variaciones && (
        <Text style={styles.variaciones}>Variaciones: {JSON.stringify(item.variaciones)}</Text>
      )}
    </View>
  );
  const generarJSONTicket = () => {
    return {
      productos: productosCombinados.map((producto) => ({
        nombre: producto.nombreProducto,
        cantidad: producto.cantidad,
        precio: producto.precioTotal,
        variaciones: producto.variaciones || null,
      })),
      total: totalCombinado,
      efectivo: parseFloat(efectivo),
      cambio: cambio,
    };
  };

  

  return (
    <View style={styles.container}>
    <View style={styles.divisionSection}>
        <Text style={styles.sectionTitle}>Dividir entre clientes</Text>
        <Button title="Agregar cliente" onPress={agregarCliente} />
        {clientes.map((cliente, index) => (
          <View key={index} style={styles.clienteContainer}>
            <View style={styles.clienteHeader}>
              <Text style={styles.clienteNombre}>{cliente}</Text>
              <TouchableOpacity
                onPress={() => eliminarCliente(index)}
                style={styles.eliminarBoton}
              >
                <Text style={styles.eliminarTexto}>X</Text>
              </TouchableOpacity>
            </View>
            <FlatList
  data={productosCombinados}
  keyExtractor={(item) => item.uniqueId}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={[
        styles.productoSeleccionable,
        clienteProductos[cliente]?.find((p) => p.uniqueId === item.uniqueId) ? styles.productoSeleccionado : {},
        productoCantidades[item.uniqueId] === 0 && styles.productoAgotado,
      ]}
      onPress={() => seleccionarProducto(item, cliente)}
      disabled={productoCantidades[item.uniqueId] === 0}
    >
      <Text style={styles.nombreProducto}>{item.nombreProducto}</Text>
      <Text style={styles.precioTotal}>${item.precioTotal}</Text>
      <Text style={styles.cantidadDisponible}>Disponible: {productoCantidades[item.uniqueId]}</Text>
    </TouchableOpacity>
  )}
  horizontal
/>

            <Text style={styles.subtotal}>
              Subtotal: ${calcularSubtotal(clienteProductos[cliente] || [])}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.ticketSection}>
        <Text style={styles.sectionTitle}>Ticket</Text>
        <FlatList
          data={productosCombinados}
          keyExtractor={(item) => item.uniqueId}
          renderItem={renderProducto}
        />
        <Text style={styles.total}>Total: ${totalCombinado}</Text>
        <TextInput
        style={styles.efectivoInput}
        placeholder="Cantidad de efectivo"
        keyboardType="numeric"
        value={efectivo}
        onChangeText={setEfectivo}
      />
      <Text style={styles.cambio}>Cambio: ${cambio}</Text>
      <Button
        title="Completar Pago"
        onPress={completarPago}
        disabled={!isPagoHabilitado} // Deshabilitar el botón según el estado
      />
    </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  divisionSection: {
    flex: 2 / 3,
    padding: 10,
  },
  ticketSection: {
    flex: 1 / 3,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clienteContainer: { marginBottom: 20 },
  clienteHeader: { flexDirection: 'row', alignItems: 'center' },
  clienteNombre: { fontSize: 18, marginRight: 10 },
  productoSeleccionable: { padding: 10, marginVertical: 5, borderRadius: 5, borderWidth: 1 },
  productoSeleccionado: { backgroundColor: '#d0f0c0' },
  productoAgotado: { opacity: 0.5 },
  nombreProducto: {
    fontSize: 14,
  },
  precioTotal: {
    fontSize: 14,
    color: '#333',
  },
  variaciones: {
    fontSize: 12,
    color: '#666',
  },
  cantidad: {
    fontSize: 12,
    color: '#666',
  },
  cantidadDisponible: {
    fontSize: 12,
    color: '#666',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  efectivoInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  cambio: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  eliminarBoton: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#ff0000', borderRadius: 5 },
  eliminarTexto: { color: 'white', fontWeight: 'bold' },
});

export default PagoScreen;
