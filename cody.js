return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <StatusBar />
          <View
            style={{
              justifyContent: "center",
              fontFamily: "monospace",
              flex: 1,
              backgroundColor: Colors.dark_gray,
              padding: 24,
            }}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/sbcq.png")}
                style={styles.logo}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput style={styles.input} placeholder="Enter username" />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput style={styles.input} placeholder="Enter password" />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={signIn} style={styles.loginButton}>
                <Text
                  style={[
                    styles.loginText,
                    { color: isPressed ? Colors.dark_gray : Colors.white },
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={signUp} style={styles.loginButton}>
                <Text
                  style={[
                    styles.loginText,
                    { color: isPressed ? Colors.dark_gray : Colors.white },
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 300,
    width: 300,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.slate,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.slate,
    padding: 10,
    borderRadius: 4,
    color: Colors.dark_gray,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    borderColor: Colors.slate,
    backgroundColor: Colors.slate,
  },
  loginText: {
    fontWeight: "bold",
  },
});