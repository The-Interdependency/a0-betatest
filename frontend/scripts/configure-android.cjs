// Usage after `npx cap add android`: node scripts/configure-android.cjs.
// Generation remains disposable; this idempotent patch owns the OAuth intent.
const fs = require('node:fs');
const file = 'android/app/src/main/AndroidManifest.xml';
const source = fs.readFileSync(file, 'utf8');
const intent = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="org.interdependentway.a0" android:host="oauth" android:path="/callback" />
            </intent-filter>`;
if (!source.includes('android:host="oauth"')) {
  if (!source.includes('</activity>')) throw new Error('generated MainActivity is missing');
  fs.writeFileSync(file, source.replace('</activity>', intent + '\n        </activity>'));
}
