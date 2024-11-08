import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Main from '../screen/Main';
import Croquis from '../screen/Croquis';
import Pedidos from '../screen/Pedidos';
import Calendario from '../screen/Calendario';
import Ventas from '../screen/Ventas';
import Inventario from '../screen/Inventario';
import AdministrarCategorias from '../screen/AdministrarCategorias';
import InventarioProductos from '../screen/InventarioProductos';
import InventarioFotos from '../screen/InventarioFotos';
import AuthScreen from '../screen/AuthScreen';
import POS from '../screen/POS';
import Pago from '../screen/Pago';
import { useUserInfo } from '../database/userContext';



function MyStack() {
    const {session} = useUserInfo();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={session ? Main : AuthScreen } options={{ headerShown: false }}/>
      <Stack.Screen name="Croquis" component={Croquis} options={{ headerShown: false }}/>
      <Stack.Screen name="Pedidos" component={Pedidos} />
      <Stack.Screen name="POS" component={POS} options={{ headerShown: false }}/>
      <Stack.Screen name="Pago" component={Pago} options={{ headerShown: false }}/>
      <Stack.Screen name="Inventario" component={Inventario} options={{ headerShown: false }}/>
      <Stack.Screen name="Ventas" component={Ventas} options={{ headerShown: false }}/>
      <Stack.Screen name="Calendario" component={Calendario} options={{ headerShown: false }}/>
      <Stack.Screen name="AdministrarCategorias" component={AdministrarCategorias} options={{ headerShown: false }}/>
      <Stack.Screen name="InventarioProductos" component={InventarioProductos} options={{ headerShown: false }}/>
      <Stack.Screen name="InventarioFotos" component={InventarioFotos} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
});
