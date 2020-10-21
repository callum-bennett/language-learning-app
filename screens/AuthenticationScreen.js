import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";

import * as Colors from "../constants/Colors";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../api/client";
import { setAuthenticated } from "../store/actions/authentication";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";

const AuthenticationScreen = (props) => {
  const dispatch = useDispatch();
  const [loading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const authenticated = useSelector(
    (state) => state.authentication.authenticated
  );

  useEffect(() => {
    if (authenticated) {
      props.navigation.navigate("Category");
    }
  }, [authenticated]);

  useEffect(() => {
    (async () => {
      try {
        const existingToken = await AsyncStorage.getItem("authToken");
        if (existingToken) {
          dispatch(setAuthenticated(existingToken));
        } else {
          const res = await apiClient.get("/login");
          setEmail(res.data.last_username);
        }
      } catch (e) {}
    })();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await apiClient.post("/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data;",
        },
      });

      const authToken = res.headers["x-auth-token"];
      if (authToken) {
        await AsyncStorage.setItem("authToken", authToken);
        dispatch(setAuthenticated(authToken));
      }
    } catch (error) {
      let message = "Something went wrong. Please contact the administrator.";
      if (error.response.status === 401) {
        message = error.response.data.message;
      }
      setErrorMessage(message);
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behaviour="padding"
      keyboardVerticalOffset={30}
    >
      <View style={styles.form}>
        <AppTextInput
          key="email"
          id="email"
          label="Email"
          autoCapitalize="none"
          value={email}
          keyboardType="email-address"
          onChange={(e) => setEmail(e.nativeEvent.text)}
        />
        <View style={styles.passwordContainer}>
          <AppTextInput
            key="password"
            id="password"
            label="Password"
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            value={password}
            onChange={(e) => setPassword(e.nativeEvent.text)}
          />

          <TouchableWithoutFeedback
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="#666"
            />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.buttonContainer}>
          {!loading ? (
            <AppButton onPress={handleSignIn}>Sign in</AppButton>
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <View style={styles.divider}>
          <View style={styles.line}></View>
          <AppText style={styles.or}>or</AppText>
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            style={{
              button: {
                backgroundColor: Colors.accent,
              },
            }}
            onPress={() => {}}
          >
            Create account
          </AppButton>
        </View>
        {errorMessage && (
          <View>
            <AppText style={styles.authError}>{errorMessage}</AppText>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

AuthenticationScreen.navigationOptions = {
  headerTitle: "Sign in or create an account",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 8,
    backgroundColor: "white",
    width: "90%",
    maxWidth: 400,
    height: 320,
    padding: 20,
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  divider: {
    position: "relative",
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "absolute",
    top: 5,
    width: "100%",
  },
  or: {
    backgroundColor: "#FFF",
    color: "#333",
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: "center",
    marginTop: -12,
  },
  buttonContainer: {
    marginBottom: 10,
    height: 30,
  },
  authError: {
    color: "#FF0000",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});

export default AuthenticationScreen;