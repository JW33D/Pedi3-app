/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
    Text as DefaultText,
    View as DefaultView,
    TextInput as DefaultTextInput,
    Button as DefaultButton,
  } from "react-native";
  
  import Colors from "../constants/Colors"
  import useColorScheme from "../hooks/useColorScheme";
  
  export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
  ) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];
  
    if (colorFromProps) {
      return colorFromProps;
    } else {
      return Colors[theme][colorName];
    }
  }
  
  type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
  };
  
  export type TextProps = ThemeProps & DefaultText["props"];
  export type ViewProps = ThemeProps & DefaultView["props"];
  export type TextInputProps = ThemeProps & DefaultTextInput["props"];
  export type ButtonProps = ThemeProps & DefaultButton["props"];
  
  
  export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  
    return <DefaultText style={[{ color }, style]} {...otherProps} />;
  }
  
  export function Viewm(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
  
    // Usamos el hook para obtener el color de fondo según el tema
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );
  
    // Definimos los estilos personalizados
    const customStyle = [
      {
        backgroundColor: backgroundColor || '#fff', // Color de fondo, predeterminado a blanco
        margin: 500, // Margen
        padding: 20, // Relleno
        borderRadius: 8, // Borde redondeado
      },
      style, // Permite sobrescribir con estilos adicionales si se pasa en props
    ];
  
    return <DefaultView style={customStyle} {...otherProps} />;
  }
  export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );
  
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
  }
  
  export function Card(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "card"
    );
  
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
  }
  
  export function Button(props: DefaultButton["props"]) {
    const color = useThemeColor({}, "primary");
    return <DefaultButton color={color} {...props} />;
  }
  
  export function TextInput(props: DefaultTextInput["props"]) {
    const { style, ...otherProps } = props;
    const color = useThemeColor({}, "text");
    const backgroundColor = useThemeColor({}, "card");
    const placeholderColor = useThemeColor(
      {  dark: "#9ca3af" },
      "text"
    );
    const primary = useThemeColor({}, "primary");
    return (
      <DefaultTextInput
        style={[{ backgroundColor, color, fontSize: 16, padding: 8 }, style]}
        placeholderTextColor={placeholderColor}
        cursorColor={primary}
        selectionColor={primary}
        {...props}
      />
    );
  }


  

  