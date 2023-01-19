import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES, TEXT_COLOR } from "../../theme";
import Form from "./component/Form";
import Button from "../../component/Button";
import { useStore } from "@nanostores/react";
import {
  authenticationStore,
  setFormContent,
} from "../../store/authenticationStore";

export default function AuthView() {
  const { width, height } = useWindowDimensions();
  const { formContent } = useStore(authenticationStore);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: SIZES.base }}
        >
          <View
            style={[
              styles.logoContainer,
              { height: height * 0.2,/*  backgroundColor: "red"  */},
            ]}
          >
            <Image
              style={styles.logo}
              source={require("../../../assets/logo.png")}
              resizeMode={"contain"}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center" /* height: height * 0.1  */,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.londrinaSolid.black,
                fontSize: SIZES.large * 1.5,
                color: TEXT_COLOR.SECONDARY
              }}
              numberOfLines={1}
            >
              {formContent == "signup" ? "Bienvenue sur" : "Content de vous revoir sur"}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.oswald.bold,
                fontSize: SIZES.large * 2.5,
                color: COLORS.PRIMARY_DARK
              }}
            >
              Listing
            </Text>
          </View>

          {/* <View style={styles.centerContainer}> */}
          <Form formContent={formContent} />
          {/* </View> */}
          {formContent == "login" ? (
            <View style={styles.linkContainer}>
              <TouchableOpacity onPress={() => console.log("MDP oublié")}>
                <Text style={styles.text}>Mot de passe oublié</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            {formContent == "signup" ? (
              <Button
                label={"S'inscrire"}
                containerStyle={{ backgroundColor: COLORS.PRIMARY_DARK }}
                onPress={() => console.log("s'inscrire")}
              />
            ) : (
              <Button
                label={"Se connecter"}
                containerStyle={{ backgroundColor: COLORS.PRIMARY_DARK }}
                onPress={() => console.log("Se connecter")}
              />
            )}
          </View>
          <View style={styles.linkContainer}>
            <Text style={styles.text}>
              {" "}
              {formContent == "signup"
                ? "Déjà inscrit ?"
                : "Pas encore de compte ? "}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                formContent == "signup"
                  ? setFormContent("login")
                  : setFormContent("signup");
              }}
            >
              <Text
                style={{
                  color: COLORS.TERTIARY,
                  fontFamily: FONTS.mukta.semiBold,
                  fontSize: SIZES.base,
                }}
              >
                {formContent == "signup" ? " Se connecter" : "S'inscrire"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.large,
  },
  logo: {
    width: 150,
  },
  buttonContainer: {
    margin: SIZES.small,
    paddingHorizontal: SIZES.large,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: TEXT_COLOR.PRIMARY,
    fontFamily: FONTS.mukta.regular,
    fontSize: SIZES.base,
  },
});