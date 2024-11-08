import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getVentas } from '../database/api';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [filtro, setFiltro] = useState('Diarias');

  useEffect(() => {
    fetchVentas();
  }, []);

  useEffect(() => {
    filtrarVentas();
  }, [filtro, ventas]);

  const fetchVentas = async () => {
    try {
      const data = await getVentas();
      setVentas(data);
    } catch (error) {
      console.error('Error fetching ventas:', error);
    }
  };

  const filtrarVentas = () => {
    const hoy = dayjs();
    let ventasFiltradas = [];

    if (filtro === 'Diarias') {
      // Agrupa las ventas por día
      ventasFiltradas = ventas.reduce((acc, venta) => {
        const dia = dayjs(venta.tiempo).format('YYYY-MM-DD');
        if (!acc[dia]) acc[dia] = { dia, total: 0 };
        acc[dia].total += venta.Venta;
        return acc;
      }, {});
      ventasFiltradas = Object.values(ventasFiltradas);

    } else if (filtro === 'Semanales') {
      // Agrupa las ventas por semana dentro del mes
      ventasFiltradas = ventas.reduce((acc, venta) => {
        const semana = `${dayjs(venta.tiempo).year()}-W${dayjs(venta.tiempo).week()}`;
        if (!acc[semana]) acc[semana] = { semana, total: 0 };
        acc[semana].total += venta.Venta;
        return acc;
      }, {});
      ventasFiltradas = Object.values(ventasFiltradas);

    } else if (filtro === 'Mensuales') {
      // Agrupa las ventas por mes del año
      ventasFiltradas = ventas.reduce((acc, venta) => {
        const mes = dayjs(venta.tiempo).format('YYYY-MM');
        if (!acc[mes]) acc[mes] = { mes, total: 0 };
        acc[mes].total += venta.Venta;
        return acc;
      }, {});
      ventasFiltradas = Object.values(ventasFiltradas);
    }

    setFilteredVentas(ventasFiltradas);
  };

  const renderVenta = ({ item }) => (
    <View style={styles.ventaItem}>
      <Text>Monto Total: ${item.total}</Text>
      <Text>{filtro === 'Diarias' ? `Día: ${item.dia}` : filtro === 'Semanales' ? `Semana: ${item.semana}` : `Mes: ${item.mes}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, filtro === 'Diarias' && styles.buttonActive]}
          onPress={() => setFiltro('Diarias')}
        >
          <Text style={styles.buttonText}>Diarias</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, filtro === 'Semanales' && styles.buttonActive]}
          onPress={() => setFiltro('Semanales')}
        >
          <Text style={styles.buttonText}>Semanales</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, filtro === 'Mensuales' && styles.buttonActive]}
          onPress={() => setFiltro('Mensuales')}
        >
          <Text style={styles.buttonText}>Mensuales</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredVentas}
        renderItem={renderVenta}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>No hay ventas para el periodo seleccionado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#cccccc',
    borderRadius: 5,
  },
  buttonActive: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  ventaItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default Ventas;
