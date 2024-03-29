import React, { useEffect, useRef, useState, useReducer } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Button from "@components/ui/Button";
import TextInput from "@components/ui/TextInput";

import FormControl from "./FormControl";
import * as Colors from "@constants/Colors";

const INPUT_CHANGE = "input_change";
const SWITCH_FORM = "switch_form";
const SET_DIRTY = "set_dirty";

const initialState = {
  fields: {
    username: {
      value: "",
      valid: false,
    },
    password: {
      value: "",
      valid: false,
    },
    confirmPassword: {
      value: "",
      valid: false,
    },
  },
  valid: false,
  dirty: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case SWITCH_FORM: {
      let newState = { ...initialState };
      if (action.isSignIn) {
        newState.fields.confirmPassword.valid = true;
      }
      return newState;
    }

    case INPUT_CHANGE: {
      let newState = { ...state };
      newState.fields[action.id] = {
        value: action.value,
        valid: action.valid,
      };

      newState.valid = Object.values(newState.fields).every(
        (field) => field.valid
      );
      return newState;
    }

    case SET_DIRTY: {
      return {
        ...state,
        dirty: true,
      };
    }

    default:
      return state;
  }
};

const AuthForm = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: SWITCH_FORM, isSignIn: props.isSignIn });
  }, [props.isSignIn]);

  const handleChange = (id, value, valid) => {
    dispatch({
      type: INPUT_CHANGE,
      id,
      value,
      valid,
    });
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (!state.valid) {
      dispatch({ type: SET_DIRTY });
    } else {
      const { username, password } = state.fields;
      props.onSubmit(username.value, password.value);
    }
  };

  const ShowHideToggle = () => (
    <TouchableWithoutFeedback
      onPress={() => setShowPassword(!showPassword)}
      hitSlop={{ top: 30, right: 40, bottom: 20, left: 40 }}
    >
      <View style={styles.passwordIcon}>
        <MaterialCommunityIcons
          name={showPassword ? "eye" : "eye-off"}
          size={24}
          color="#666"
        />
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.form}>
      <FormControl>
        <TextInput
          key="username"
          id="username"
          label="Username"
          autoCapitalize="none"
          required
          maxLength={25}
          minLength={3}
          value={state.fields.username.value}
          onChange={handleChange}
          blurOnSubmit={false}
          returnKeyType={"next"}
          onSubmitEditing={() => {
            passwordInputRef.current?.focus();
          }}
          changed={props.isSignIn}
          validate={state.dirty}
        />
      </FormControl>
      <FormControl>
        <TextInput
          key="password"
          id="password"
          label="Password"
          ref={passwordInputRef}
          autoCapitalize="none"
          required
          maxLength={30}
          minLength={8}
          returnKeyType={props.isSignIn ? "done" : "next"}
          secureTextEntry={!showPassword}
          value={state.fields.password.value}
          onChange={handleChange}
          blurOnSubmit={props.isSignIn}
          onSubmitEditing={() => {
            confirmPasswordInputRef.current?.focus();
          }}
          changed={props.isSignIn}
          validate={state.dirty}
          icon={<ShowHideToggle />}
        />
      </FormControl>
      {!props.isSignIn && (
        <FormControl>
          <TextInput
            key="confirmPassword"
            id="confirmPassword"
            label="Confirm Password"
            ref={confirmPasswordInputRef}
            autoCapitalize="none"
            required
            maxLength={30}
            minLength={8}
            equalTo={{
              message: "Passwords don't match",
              value: state.fields.password.value,
            }}
            secureTextEntry={true}
            value={state.fields.confirmPassword.value}
            onChange={handleChange}
            changed={props.isSignIn}
            validate={state.dirty}
          />
        </FormControl>
      )}
      <FormControl>
        {!props.loading ? (
          <Button onPress={handleSubmit}>
            {props.isSignIn ? "Log in" : "Create Account"}
          </Button>
        ) : (
          <ActivityIndicator style={{ height: 36 }} color={Colors.accent} />
        )}
      </FormControl>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    width: "90%",
    maxWidth: 400,
  },
  passwordIcon: {
    marginLeft: 10,
  },
});

export default AuthForm;
