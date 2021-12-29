import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { loadBugs, getUnresolvedBugs, resolveBug } from "../store/bugs";
import { useDispatch, useSelector } from "react-redux";
import { loggin, getUser } from "../store/auth";

function Login(props) {
  const dispatch = useDispatch();

  const state = useSelector((state) => state.entities.auth);
  const name = useSelector((state) => state.entities.auth.loading);

  useEffect(() => {
    // const email = "timon@posti.fi";
    // const password = "12345";
    // const result = await authApi.login(email, password);
    // const user = jwtDecode(result.data);

    dispatch(loggin("timon@posti.fi", "12345"));

    // console.log("muista vaihtaa aina oikea ip, koska vaihtelee");
  }, []);

  if (state.token) {
    const user = getUser(state);
    console.log(user);
    console.log("mikä on iat");
    console.log(
      "kyl pitää olla userin tiedot jo valmiiksi palasteltu heti kirjauduttua tuonne stateen"
    );
    console.log(
      "onko tämä useSelector jo valmis, että se ei päity kuin sillon kun state muuttuu, eli jos sen laittaa tarkasti johonkin, niin se toimii oikein. esim state.entities.auth.name"
    );
  }

  return (
    <View style={styles.container}>
      <Text>Login Hello</Text>
      {state.token && <Text>{state.token}</Text>}
      {state.error && <Text>{state.error}</Text>}
      <Text style={{ color: "red" }}>{name.toString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
});

export default Login;
