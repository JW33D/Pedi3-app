import { StatusBar } from "expo-status-bar";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navitagion";
import { AuthProvider } from "./database/userContext";

export default function App(){
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  if(!isLoadingComplete){
    return null;
  }else{
    return(
      <AuthProvider>
      <Navigation colorScheme={colorScheme}/>
      <StatusBar/>
      </AuthProvider>
    );
  }
}