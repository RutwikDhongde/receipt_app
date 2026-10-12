// Shows the built receipts page full-screen. The page (React, data and all) is
// generated into app-html.js by `npm run build` / `npm run phone` at the repo
// root; when data/app-data.json changes, Metro reloads it on the phone.
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import html from './app-html';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        originWhitelist={['*']}
        style={styles.container}
        bounces={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        setSupportMultipleWindows={false}
      />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
