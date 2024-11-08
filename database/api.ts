import { supabase } from "./supabase";

// Función para obtener las categorías
export const fetchCategorias = async () => {
  try {
    const { data, error } = await supabase.from("categoria").select("*").order('idCategoria');
    if (error) {
      console.error("Error al traer las categorías: ", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Error inesperado: ", err);
    return [];
  }
};
// Función para obtener las subcategorías por idCategoria
export const getSubcategorias = async (categoriaId) => {
    const { data, error } = await supabase
      .from("subcategoria")
      .select("*")
      .eq("idCategoria", categoriaId)
      .eq("estado", 1).order('idSubcategoria');
    if (error) throw error;
    return data;
  };
// Función para dar de baja una subcategoría
export const darDeBajaSubcategoria = async (idSubcategoria) => {
    const { error } = await supabase
      .from("subcategoria")
      .update({ estado: 0 })
      .eq("idSubcategoria", idSubcategoria);
    if (error) throw error;
  };
// Función para eliminar una subcategoría
export const eliminarSubcategoria = async (idSubcategoria) => {
    const { error } = await supabase
      .from("subcategoria")
      .delete()
      .eq("idSubcategoria", idSubcategoria);
    if (error) throw error;
  };
// Función para editar una subcategoría
export const actualizarSubcategoria = async (idSubcategoria, newName) => {
    const { error } = await supabase
      .from("subcategoria")
      .update({ Nombre: newName })
      .eq("idSubcategoria", idSubcategoria);
    if (error) throw error;
  };
// Función para agregar una nueva subcategoría
export const agregarSubcategoria = async (nombre, idCategoria) => {
    const { error } = await supabase
      .from("subcategoria")
      .insert([{ Nombre: nombre, idCategoria, estado: 1 }]);
    if (error) throw error;
  };
  // Función para obtener productos por subcategoría
export const getProductos = async (subcategoriaId) => {
    const { data, error } = await supabase
      .from('inventario')
      .select('*')
      .eq('idSubcategoria', subcategoriaId)
      .eq('estado', 1).order('idInventario'); // Filtrar por estado igual a 1
    if (error) throw error;
    return data;
  };
  export const agregarProducto = async (producto) => {
    const { error } = await supabase
      .from('inventario')
      .insert([
        {
          nombreProducto: producto.nombreProducto,
          cantidad: producto.cantidad,
          precio: producto.precio,
          idSubcategoria: producto.idSubcategoria,
          estado: 1, // Estado activo
        }
      ]);
    if (error) throw error;
  };
  export const obtenerProductos = async () => {
    const { data, error } = await supabase
      .from('inventario')
      .select('*')
      .eq('estado',1);
  
    if (error) throw error;
    return data;
  };
  export const actualizarProducto = async (producto) => {
    const { error } = await supabase
      .from('inventario')
      .update({
        nombreProducto: producto.nombreProducto,
        cantidad: producto.cantidad,
        precio: producto.precio,
      })
      .eq('idInventario', producto.idInventario); // Actualiza el producto por su ID
  
    if (error) throw error;
  };
  export const actualizarCantidadProducto = async (idInventario, nuevaCantidad) => {
    try {
      const { data, error } = await supabase
        .from('inventario')
        .update({ cantidad: nuevaCantidad })
        .eq('idInventario', idInventario);
  
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
    }
  };
  export const actualizarVariacion = async (variacion) => {
    const { error } = await supabase
      .from('VariacionPrecio')
      .update({
        nombre: variacion.nombre,
        precio: variacion.precio,
      })
      .eq('idVariacion', variacion.idVariacion);
  
    if (error) throw error;
  };
  export const bajaProducto = async (idInventario) => {
    const { error } = await supabase
      .from('inventario')
      .update({ estado: 0 }) // Cambiar estado a 0 (baja)
      .eq('idInventario', idInventario);
  
    if (error) throw error;
  };
  export const eliminarProducto = async (idInventario) => {
    const { error } = await supabase
      .from('inventario')
      .delete()
      .eq('idInventario', idInventario);
  
    if (error) throw error;
  };
  export const eliminarPrecio = async (idVariacion) => {
    const { error } = await supabase
      .from('VariacionPrecio')
      .delete()
      .eq('idVariacion', idVariacion);
  
    if (error) throw error;
  };
export const subirYGuardarFoto = async (idInventario, fileName, uri) => {
  try {
    console.log("URI de la imagen:", uri);

    // Leer la imagen como un archivo blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Subir la imagen al bucket "Galeria"
    const { error: uploadError } = await supabase.storage
      .from("Galeria")  // Bucket "Galeria"
      .upload(fileName, blob, {
        contentType: 'image/jpeg', // Ajusta según sea necesario
      });

    if (uploadError) {
      console.error("Error al subir la imagen: ", uploadError.message);
      throw uploadError;
    }

    // Obtener la URL pública de la imagen subida
    const { data } = supabase
      .storage
      .from("Galeria")  // Bucket "Galeria"
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    console.log('Imagen subida exitosamente:', fileName);
    console.log('URL pública de la imagen:', publicUrl);

    // Actualizar el campo urlFoto en la tabla inventario para el idInventario correspondiente
    const { data: updateData, error: updateError } = await supabase
      .from('inventario')  // Asegúrate de que este sea el nombre correcto de la tabla
      .update({ urlFoto: publicUrl })  // Actualiza el campo urlFoto
      .eq('idInventario', idInventario);  // Donde idInventario sea igual al valor proporcionado

    if (updateError) {
      console.error("Error al actualizar la URL en la tabla inventario: ", updateError.message);
      throw updateError;
    }

    return { success: true, data: updateData }; // Devuelve el resultado de la actualización
  } catch (error) {
    console.error("Error al subir y guardar la imagen: ", error);
    return { success: false, error };
  }
};  
  export const VariacionPrecio = async () => {
    try {
      const { data, error } = await supabase.from("VariacionPrecio").select("*");
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error al traer las variaciones de precio: ", err);
      return [];
    }
  };
  export const agregarVariacion = async (variacion) => {
    if (!variacion.idInventario) {
      alert('Por favor selecciona una subcategoría.');
      return;
    }
    const { error } = await supabase
      .from('VariacionPrecio')
      .insert([
        {
          nombre: variacion.nombre,
          precio: variacion.precio,
          idInventario: variacion.idInventario,
        }
      ]);
    if (error) throw error;
  };
  // Función para guardar un pedido
export const guardarPedido = async (pedidoJSON, idMesa) => {
  try {
    const { error } = await supabase
      .from("pedidos")
      .insert([
        {
          pedido: pedidoJSON,
          idMesa: idMesa, // Guardamos el JSON completo del pedido
        },
      ]);
    if (error) {
      console.error("Error al guardar el pedido: ", error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error("Error inesperado al guardar el pedido: ", error);
    return { success: false, error };
  }
};
export const actualizarPedidos = async (pedidoJSON, idMesa) => {
  try {
    const { error } = await supabase
      .from("pedidos")
      .update({ pedido: pedidoJSON })
      .eq("idMesa", idMesa);

    if (error) {
      console.error("Error al actualizar el pedido: ", error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error("Error inesperado al actualizar el pedido: ", error);
    return { success: false, error };
  }
};
export const guardarPedidosM = async (pedidoJSON, idMesa) => {
  try {
    const { error } = await supabase
      .from("pedidosMesas")
      .insert([
        {
          idMesa: idMesa, 
          pedidoM: pedidoJSON
          
        },
      ]);
    if (error) {
      console.error("Error al guardar el pedido: ", error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error("Error inesperado al guardar el pedido: ", error);
    return { success: false, error };
  }
};
export const fetchPedidos = (setPedidos) => {
  try {
    // Crear un canal para la suscripción en tiempo real
    const pedidosSubscription = supabase
      .channel('realtime-pedidos')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pedidos' }, // Escuchar todos los eventos en la tabla 'pedidos'
        (payload) => {
          const { eventType, new: nuevoPedido, old: pedidoAntiguo } = payload;
          
          if (eventType === 'INSERT') {
            console.log('Nuevo pedido recibido:', nuevoPedido);
            setPedidos((prevPedidos) => [nuevoPedido, ...prevPedidos]); // Añadir el nuevo pedido al principio de la lista
          }

          if (eventType === 'UPDATE') {
            console.log('Pedido actualizado:', nuevoPedido);
            setPedidos((prevPedidos) =>
              prevPedidos.map((pedido) =>
                pedido.idPedidos === nuevoPedido.idPedidos ? nuevoPedido : pedido
              )
            ); // Actualizar el pedido correspondiente
          }

          if (eventType === 'DELETE') {
            console.log('Pedido eliminado:', pedidoAntiguo);
            setPedidos((prevPedidos) =>
              prevPedidos.filter((pedido) => pedido.idPedidos !== pedidoAntiguo.idPedidos)
            ); // Eliminar el pedido correspondiente
          }
        }
      )
      .subscribe();

    return () => {
      // Limpiar la suscripción cuando el componente se desmonte
      supabase.removeChannel(pedidosSubscription);
    };
  } catch (error) {
    console.error('Error al suscribirse a los cambios de pedidos:', error);
  }
};
export const fetchMesas = async () => {
  try {
    const { data, error } = await supabase.from("mesas").select("*").order('idMesa');
    if (error) {
      console.error("Error al traer las mesas: ", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Error inesperado: ", err);
    return [];
  }
};
export const obtenerOGuardarPedido = async (pedidoJSON, idMesa) => {
  try {
    // Primero, intentamos obtener el pedido completo para la mesa especificada
    const { data: existingPedido, error: fetchError } = await supabase
      .from("pedidos")
      .select("pedido") // Traemos todo el contenido del pedido en JSON
      .eq("idMesa", idMesa)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error al obtener el pedido existente: ", fetchError);
      throw fetchError;
    }

    let error;
    if (existingPedido) {
      // Retornamos el pedido existente
      return { success: true, pedido: existingPedido.pedido };
    } else {
      // Si no existe un pedido, hacemos un insert con los datos nuevos
      ({ error } = await supabase
        .from("pedidos")
        .insert([
          {
            pedido: pedidoJSON,
            idMesa: idMesa,
          },
        ]));
      
      if (error) {
        console.error("Error al guardar el pedido: ", error);
        throw error;
      }
      
      // Retornamos el pedido nuevo que acabamos de insertar
      return { success: true, pedido: pedidoJSON };
    }
  } catch (error) {
    console.error("Error inesperado al obtener o guardar el pedido: ", error);
    return { success: false, error };
  }
};
export const getPedidos = async (idMesa) => {
  const { data, error } = await supabase
    .from('pedidosMesas')
    .select('pedidoM')
    .eq('idMesa', idMesa); // Filtrar por idMesa específico
  if (error) throw error;
  return data;
};
export const obtenerCantidadActualProducto = async (idInventario) => {
  const { data, error } = await supabase
    .from('inventario')
    .select('cantidad')
    .eq('idInventario', idInventario)
    .single(); // Añadido `.single()` para devolver un solo objeto

  if (error) throw error;
  return data.cantidad; // Retorna solo el valor de cantidad
};
export const eliminarPedido = async (idMesa) => {
  const { error } = await supabase.from('pedidos').delete().eq('idMesa', idMesa);
  if (error) throw error;
};
export const eliminarPedidosM = async (idMesa) => {
  try {
    const { error } = await supabase
      .from('pedidosMesas')
      .delete()
      .eq('idMesa', idMesa);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error al eliminar los pedidos en pedidosMesas:", error.message);
    throw error;
  }
};
export const guardarVenta = async (venta, idMesa) => {
  const { error } = await supabase
    .from('ventas')
    .insert({ Venta: venta, idMesa: idMesa, tiempo: new Date().toISOString() });

  if (error) throw error;
};
export const getVentas = async () => {
  const { data, error } = await supabase
    .from('ventas')
    .select('*').order('idVentas'); 
  
  if (error) throw error;
  return data;
};