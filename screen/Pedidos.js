import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Image } from 'react-native';
import { fetchPedidos, fetchMesas } from '../database/api';

const PedidoCard = ({ pedido, mesaInfo }) => {
  return (
    <View style={styles.pedidoCard}>
      {/* Mostrar icono y nombre de la mesa */}
      <View style={styles.mesaInfoContainer}>
        <Image source={{ uri: mesaInfo.icono }} style={styles.icono} />
        <Text style={styles.nombreMesa}>{mesaInfo.mesas}</Text>
      </View>

      {Array.isArray(pedido.productos) && pedido.productos.length > 0 ? (
        pedido.productos.map((producto, idx) => (
          <View key={idx} style={styles.productoContainer}>
            <Text style={styles.producto}>
              {producto.cantidad} x {producto.nombreProducto}
            </Text>
            
            {producto.comentario ? (
              <Text style={styles.comentario}>Comentario: {producto.comentario}</Text>
            ) : null}

            {producto.variaciones && Object.keys(producto.variaciones).length > 0 ? (
              <View style={styles.variacionesContainer}>
                <Text style={styles.variacionesTitle}>Variaciones:</Text>
                {Object.entries(producto.variaciones).map(([nombreVariacion, cantidad]) => (
                  <Text key={nombreVariacion} style={styles.variacion}>
                    {cantidad} x {nombreVariacion}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        ))
      ) : (
        <Text>No hay productos</Text>
      )}
    </View>
  );
};

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [mesas, setMesas] = useState({});
  const [cronometros, setCronometros] = useState({});

  useEffect(() => {
    // Fetch de pedidos y suscripción
    const unsubscribe = fetchPedidos(setPedidos);

    // Fetch de mesas
    fetchMesas().then((data) => {
      const mesasMap = data.reduce((acc, mesa) => {
        acc[mesa.idMesa] = mesa;
        return acc;
      }, {});
      setMesas(mesasMap);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    // Iniciar cronómetros para cada pedido nuevo
    pedidos.forEach((pedido) => {
      if (!cronometros[pedido.idPedidos]) {
        iniciarCronometro(pedido.idPedidos);
      }
    });
  }, [pedidos]);

  const iniciarCronometro = (pedidoId) => {
    setCronometros((prevCronometros) => ({
      ...prevCronometros,
      [pedidoId]: { minutos: 0, segundos: 0 },
    }));

    const timer = setInterval(() => {
      setCronometros((prevCronometros) => {
        const tiempoActual = prevCronometros[pedidoId];
        let { minutos, segundos } = tiempoActual;

        if (segundos === 59) {
          minutos += 1;
          segundos = 0;
        } else {
          segundos += 1;
        }

        return {
          ...prevCronometros,
          [pedidoId]: { minutos, segundos },
        };
      });
    }, 1000);

    setCronometros((prevCronometros) => ({
      ...prevCronometros,
      [pedidoId]: { ...prevCronometros[pedidoId], timer },
    }));
  };

  return (
    <FlatList
      data={pedidos}
      renderItem={({ item }) => (
        <View style={styles.pedidoContainer}>
          <Text>
            Tiempo: {cronometros[item.idPedidos]?.minutos}:{cronometros[item.idPedidos]?.segundos}
          </Text>
          <PedidoCard pedido={item.pedido} mesaInfo={mesas[item.idMesa]} /> {/* Pasamos mesaInfo */}
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      numColumns={4}
      contentContainerStyle={styles.listaPedidos}
    />
  );
};

const { width } = Dimensions.get('window');
const cardSize = width / 4 - 20;

const styles = StyleSheet.create({
  listaPedidos: {
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  pedidoCard: {
    width: cardSize,
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200, // Ajustar para incluir icono y nombre de mesa
  },
  mesaInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icono: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  nombreMesa: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productoContainer: {
    marginBottom: 5,
  },
  producto: {
    fontSize: 14,
    textAlign: 'center',
  },
  comentario: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'gray',
    marginTop: 3,
  },
  variacionesContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  variacionesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  variacion: {
    fontSize: 12,
    textAlign: 'center',
  },
  total: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Pedidos;
