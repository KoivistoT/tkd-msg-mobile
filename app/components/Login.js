import React, { useEffect } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { loadBugs, getUnresolvedBugs, resolveBug } from "../../store/bugs";
import { useDispatch, useSelector } from "react-redux";
import { login, getUser, selectToken } from "../../store/currentUser";

function Login(props) {
  const dispatch = useDispatch();

  const state = useSelector((state) => state.auth.currentUser);
  const name = useSelector((state) => state.auth.currentUser.loading);
  // const token = useSelector(selectToken);
  // console.log(token);

  useEffect(() => {
    // const email = "timon@posti.fi";
    // const password = "12345";
    // const result = await authApi.login(email, password);
    // const user = jwtDecode(result.data);
    // console.log("muista vaihtaa aina oikea ip, koska vaihtelee");
  }, []);

  const _login = () => {
    dispatch(login("timon@posti.fi", "12345"));
  };
  if (state.token) {
    // const user = getUser(state);
    // console.log(state);
    // console.log(user);
    // console.log(
    //   "kyl pitää olla userin tiedot jo valmiiksi palasteltu heti kirjauduttua tuonne stateen"
    // );
    // console.log(
    //   "onko tämä useSelector jo valmis, että se ei päity kuin sillon kun state muuttuu, eli jos sen laittaa tarkasti johonkin, niin se toimii oikein. esim state.entities.auth.name"
    // );
  }

  return (
    <View style={styles.container}>
      <Text>Login Hello</Text>
      <Button title="kirjaudu" onPress={() => _login()} />
      <Text>tee tunnukset</Text>
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
