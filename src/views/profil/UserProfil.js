import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "@nanostores/react";
import { FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

import { calendarStore } from "../../store/calendarStore";
import { setOnlyCloseButton } from "../../store/bottomTabNavStore";
import HeaderText from "../home/component/HeaderText";
import Button from "../../component/Button";
import { COLORS, FONTS, SIZES, TEXT_COLOR } from "../../theme";
import BottomTab from "../../component/BottomTab";

import {
  authenticationStore,
  deleteUser,
  logout,
  setPasswordVisible,
  updateUser,
} from "../../store/authenticationStore";
import { useState } from "react";
import { setActive } from "../../store/bottomTabNavStore";
import { setViewActive } from "../../store/bottomTabNavStore";
import { PRIVACY_POLICY } from "../../settings";

export default function UserProfil({ navigation }) {
  const {
    formContent,
    email,
    username,
    password,
    user,
    passwordVisible,
    loading,
    error,
    message,
  } = useStore(authenticationStore);

  const [usernameInputVisible, setUsernameInputVisible] = useState(false);
  const [passwordInputVisible, setPasswordInputVisible] = useState(false);
  const [buttonVisible, setbuttonVisible] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setOnlyCloseButton(false);
    setViewActive("UserProfil");
    return () => {};
  }, [user, username]);

  const {
    control,
    handleSubmit,
    setFocus,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: username,
      password: password,
    },
  });

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(PRIVACY_POLICY, {
      toolbarColor: COLORS.PRIMARY_DARK,
    });
    setResult(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/img/header.png")}
        resizeMode="cover"
        style={{ height: 210 }}
      >
        <HeaderText label={"Mon profil"} />
        <TouchableOpacity
          onPress={() => {
            setViewActive("DayView");
            navigation.goBack();
          }}
          style={{ margin: SIZES.base }}
        >
          <FontAwesome
            name="arrow-left"
            size={27}
            color={TEXT_COLOR.SECONDARY}
          />
        </TouchableOpacity>
      </ImageBackground>

      <ScrollView bounces={false}>
        <View
          style={{
            paddingHorizontal: SIZES.small /* alignItems: "center" */,
          }}
        >
          <View style={styles.section}>
            <Text
              style={{
                fontFamily: FONTS.mukta.extraBold,
                fontSize: SIZES.large,
                color: TEXT_COLOR.PRIMARY,
                marginBottom: SIZES.large,
              }}
            >
              Mon compte
            </Text>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setUsernameInputVisible(!usernameInputVisible);
                }}
                style={styles.labelContainer}
              >
                <Text style={styles.label}>Changer mon username</Text>
                <Ionicons
                  name="md-chevron-down-outline"
                  size={24}
                  color={TEXT_COLOR.SECONDARY}
                />
              </TouchableOpacity>

              {usernameInputVisible ? (
                <Controller
                  control={control}
                  rules={{
                    // required: user.username != username ? true : false,
                    required: "Le username est obligatoire",
                    minLength: {
                      value: 2,
                      message: "Min. 2 caractères",
                    },
                    maxLength: {
                      value: 100,
                      message: "Maximum de caractères",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                      maxLength={100}
                      placeholderTextColor={TEXT_COLOR.SECONDARY}
                      autoCapitalize="none"
                    />
                  )}
                  name="username"
                />
              ) : null}
              <Text style={styles.error}>{errors.username?.message}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View>
              <TouchableOpacity
                onPress={() => setPasswordInputVisible(!passwordInputVisible)}
                style={styles.labelContainer}
              >
                <Text style={styles.label}>Changer mon mot de passe</Text>
                <Ionicons
                  name="md-chevron-down-outline"
                  size={24}
                  color={TEXT_COLOR.SECONDARY}
                />
              </TouchableOpacity>

              {passwordInputVisible ? (
                <Controller
                  control={control}
                  rules={{
                    minLength: {
                      value: 5,
                      message: "Min. 5 caractères",
                    },
                    maxLength: {
                      value: 200,
                      message: "Maximum de caractères",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.input,
                        { flexDirection: "row", alignItems: "center" },
                      ]}
                    >
                      <TextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Mot de passe"
                        textContentType="password"
                        style={{
                          width: "90%",
                          fontFamily: FONTS.mukta.regular,
                          alignItems: "center",
                          marginRight: SIZES.xs,
                        }}
                        maxLength={200}
                        autoCapitalize="none"
                        secureTextEntry={passwordVisible ? false : true}
                        placeholderTextColor={TEXT_COLOR.SECONDARY}
                      />
                      <Ionicons
                        name={
                          passwordVisible ? "eye-outline" : "eye-off-outline"
                        }
                        size={24}
                        color={TEXT_COLOR.SECONDARY}
                        style={styles.inputIcon}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      />
                    </View>
                  )}
                  name="password"
                />
              ) : null}
              <Text style={styles.error}>{errors.password?.message}</Text>
            </View>
          </View>

          {!buttonVisible ? (
            <View>
              {!loading ? (
                <View style={styles.buttonContainer}>
                  <Button
                    label={"Envoyer"}
                    containerStyle={{ backgroundColor: COLORS.PRIMARY_DARK }}
                    // onPress={handleSubmit(logUser)}
                    onPress={handleSubmit(updateUser)}
                  />
                </View>
              ) : (
                <View style={styles.buttonContainer}>
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
                </View>
              )}
            </View>
          ) : null}

          {message ? (
            <View
              style={{
                marginHorizontal: SIZES.base,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  paddingHorizontal: SIZES.xs,
                  fontFamily: FONTS.mukta.semiBold,
                  color: COLORS.SECONDARY_DARK,
                }}
              >
                {message}
              </Text>
            </View>
          ) : null}

          <View
            style={{ marginTop: SIZES.large, marginHorizontal: SIZES.base }}
          >
            <TouchableOpacity
              onPress={() => {
                logout();
              }}
              style={{
                flexDirection: "row",
                // justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Fontisto
                name="power"
                size={30}
                color={COLORS.TERTIARY}
                style={{ marginHorizontal: SIZES.xs }}
              />
              <Text
                style={{
                  fontFamily: FONTS.mukta.bold,
                  textTransform: "uppercase",
                  color: TEXT_COLOR.PRIMARY,
                }}
              >
                Me déconnecter
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{}}>
            <TouchableOpacity
              style={{
                marginTop: SIZES.large,
                alignSelf: "flex-end",
                // width: 150,
              }}
              onPress={_handlePressButtonAsync}
            >
              <Text
                style={{
                  fontFamily: FONTS.mukta.regular,
                  marginRight: SIZES.xs,
                  color: TEXT_COLOR.SECONDARY,
                }}
              >
                Politique de confidentialité
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "ATTENTION SUPPRESSION DÉFINTIVE",
                  "Si vous confirmez la suppression, toutes vos tâches et votre compte seront supprimés",
                  [
                    {
                      text: "Annuler",
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        deleteUser();
                      },
                    },
                  ]
                );
              }}
              style={{
                marginTop: SIZES.large,
                alignSelf: "flex-end",
                // width: 150,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.mukta.regular,
                  marginRight: SIZES.xs,
                  color: TEXT_COLOR.SECONDARY,
                }}
              >
                Supprimer mon compte
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginHorizontal: SIZES.base,
    marginBottom: SIZES.base,
  },
  label: {
    fontFamily: FONTS.mukta.bold,
    fontSize: SIZES.base + 2,
    color: TEXT_COLOR.SECONDARY,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    margin: SIZES.small,
    paddingHorizontal: SIZES.large,
  },
  error: {
    color: "red",
    paddingHorizontal: SIZES.xs,
    fontFamily: FONTS.mukta.regular,
  },
});
