import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState } from 'react'
import AuthForm from '../components/AuthForm'
import { supabase } from '../database/supabase'
import  { SignInWithPasswordCredentials, } from '@supabase/supabase-js';

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials: SignInWithPasswordCredentials) => {
    if (!("email" in credentials)) return;
    setLoading(true);
    const { email, password } = credentials;
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);

    console.log(data);
    setLoading(false);
  };
  return (
    <AuthForm loading={loading} onLogin={handleLogin}  />
  );
}