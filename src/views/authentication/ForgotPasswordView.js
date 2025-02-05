import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useCardAnimation } from "@react-navigation/stack";
import { Controller, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

import { CARDS, COLORS, FONTS, RADIUS, SIZES, TEXT_COLOR } from "../../theme";
import { useStore } from "@nanostores/react";
import {
  authenticationStore,
  resetPassword,
  resetValues,
  sendForgotEmail,
  setCanGoBack,
  setEmail,
  setMessage,
  setPasswordVisible,
} from "../../store/authenticationStore";
import Form from "./component/Form";
import { EMAIL_FIELD_PATTERN } from "../../settings";
import Button from "../../component/Button";
import { useEffect } from "react";

export default function ForgotPasswordView({ navigation, route }) {
  const { current } = useCardAnimation();
  // const { email, password } = route?.params;
  const {
    canGoBack,
    loading,
    passwordVisible,
    urlData,
    error,
    message,
    email,
    password,
  } = useStore(authenticationStore);
  const routeName = route.name;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: email,
    },
  });

  useEffect(() => {
      setCanGoBack(false);
      setEmail("");

      return () => {
        reset();
        setEmail("");
      };
    },
    []);

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(153, 153, 153, 0.9)",
          },
        ]}
        onPress={() => {
          resetValues();
          navigation.goBack();
        }}
      />

      <Animated.View
        style={{
          padding: 16,
          width: "90%",
          maxWidth: 400,
          borderRadius: RADIUS.rectangle,
          backgroundColor: "white",
          transform: [
            {
              scale: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        <View style={styles.section}>
          {!canGoBack ? (
            <Text
              style={{
                fontFamily: FONTS.mukta.regular,
                color: TEXT_COLOR.PRIMARY,
              }}
            >
              Entrez votre adresse email et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </Text>
          ) : (
            <Text style={styles.label}>
              Le mail de réinitialisation a bien été envoyé sur : {email}.
            </Text>
          )}
        </View>
        <View style={styles.section}>
          {canGoBack ? (
            <Text
              style={{
                fontFamily: FONTS.mukta.semiBold,
                color: COLORS.SECONDARY_DARK,
                paddingHorizontal: SIZES.xs,
              }}
            >
              Merci de consulter votre boîte mail afin de modifier votre mot de
              passe dans le délai imparti.
            </Text>
          ) : (
            <View>
              <Text style={styles.label}>Identifiant</Text>
              <Controller
                control={control}
                rules={{
                  required: "Ce champs est obligatoire",
                  minLength: {
                    value: 3,
                    message: "Min. 3 caractères",
                  },
                  maxLength: {
                    value: 200,
                    message: "Maximum de caractères",
                  },
                  pattern: {
                    value: EMAIL_FIELD_PATTERN,
                    message: "Format: exemple@mail.com",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Email: exemple@mail.com *"
                    keyboardType="email-address"
                    style={styles.input}
                    maxLength={200}
                    autoCapitalize="none"
                    placeholderTextColor={TEXT_COLOR.SECONDARY}
                  />
                )}
                name="email"
              />
            </View>
          )}
          <Text style={styles.error}>{errors.email?.message}</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!loading ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {!canGoBack ? (
                <Text
                  style={{
                    fontFamily: FONTS.oswald.medium,
                    color: TEXT_COLOR.SECONDARY,
                  }}
                >
                  Annuler
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: FONTS.oswald.medium,
                    color: TEXT_COLOR.SECONDARY,
                  }}
                >
                  Fermer
                </Text>
              )}
            </TouchableOpacity>
            {!canGoBack ? (
              <Button
                label={"Envoyer un email"}
                containerStyle={{ backgroundColor: COLORS.PRIMARY_DARK }}
                onPress={handleSubmit(sendForgotEmail)}
              />
            ) : null}
          </View>
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: COLORS.SECONDARY_DARK,
              fontWeight: "bold",
              fontFamily: FONTS.mukta.medium,
              fontSize: SIZES.base,
            }}
          >
            Chargement en cours...
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  section: {
    marginVertical: SIZES.xs,
  },
  label: {
    paddingLeft: SIZES.xs,
    fontFamily: FONTS.oswald.regular,
    color: TEXT_COLOR.PRIMARY,
  },
  input: {
    borderWidth: 2,
    borderColor: CARDS,
    borderRadius: RADIUS.rectangle,
    height: 40,
    paddingHorizontal: SIZES.xs,
    fontFamily: FONTS.mukta.regular,
  },
  error: {
    color: "red",
    paddingHorizontal: SIZES.xs,
    fontFamily: FONTS.mukta.regular,
  },
  buttonContainer: {
    margin: SIZES.small,
    paddingHorizontal: SIZES.large,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
