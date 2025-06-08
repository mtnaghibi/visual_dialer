# شماره‌گیر تصویری (Visual Dialer)

یک اپلیکیشن شماره‌گیر تصویری برای افراد کم‌بینا که امکان افزودن مخاطبین با تصاویر بزرگ را فراهم می‌کند.

## ویژگی‌ها

- افزودن مخاطبین با تصاویر بزرگ
- ذخیره‌سازی اطلاعات در حافظه مرورگر
- رابط کاربری ساده و بزرگ برای استفاده آسان
- پشتیبانی از RTL
- قابلیت نصب به عنوان PWA
- سازگار با حالت کنتراست بالا

## تکنولوژی‌ها

- Next.js
- TypeScript
- Tailwind CSS
- PWA

## نصب و راه‌اندازی

1. نصب وابستگی‌ها:
```bash
yarn install
```

2. اجرای نسخه توسعه:
```bash
yarn dev
```

3. ساخت نسخه نهایی:
```bash
yarn build
```

4. اجرای نسخه نهایی:
```bash
yarn start
```

## نحوه استفاده

1. روی دکمه "افزودن مخاطب" کلیک کنید
2. نام و شماره تلفن مخاطب را وارد کنید
3. یک تصویر برای مخاطب انتخاب کنید
4. روی دکمه "افزودن" کلیک کنید
5. برای تماس با مخاطب، روی تصویر آن کلیک کنید یا از دکمه تماس در بالای کارت استفاده کنید
6. برای حذف مخاطب، از دکمه حذف در بالای کارت استفاده کنید

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Building for Android

This project can be packaged as an Android application using Capacitor.

### Prerequisites

- Node.js (version 20.x or later recommended)
- npm or yarn
- Android Studio and Android SDK (ensure `ANDROID_SDK_ROOT` environment variable is set, or `local.properties` in the `android` folder points to your SDK).
- Java Development Kit (JDK) (usually comes with Android Studio)

### Build Steps

1.  **Install Project Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Build the Next.js Web App:**
    Ensure your `next.config.js` or `next.config.ts` has `output: 'export'` set for static site generation.
    ```bash
    npm run build
    ```
    This will generate the static web assets in the `out` directory.

3.  **Initialize Capacitor (if not already done):**
    If this is the first time building for Android or the `capacitor.config.ts` and `android` directory are missing:
    ```bash
    # Install Capacitor CLI (if not already a dev dependency)
    # npm install -D @capacitor/cli @capacitor/core
    # npm install @capacitor/android

    npx cap init --web-dir=out "Your App Name" "com.example.yourapp"
    npx cap add android
    ```
    Make sure `webDir` in `capacitor.config.ts` is set to `"out"`.

4.  **Sync Web Assets with Android Project:**
    Every time you make changes to the web app and rebuild it, you need to sync with the Android project:
    ```bash
    npx cap sync android
    ```

5.  **Build the Android App:**
    Navigate to the Android project directory:
    ```bash
    cd android
    ```
    Clean and build the debug APK:
    ```bash
    ./gradlew clean assembleDebug
    ```
    The APK will be located in `android/app/build/outputs/apk/debug/app-debug.apk`.

    For a release build (AAB - Android App Bundle), you would typically run:
    ```bash
    ./gradlew bundleRelease
    ```
    This requires setting up signing configurations.

### Troubleshooting

-   **SDK Not Found:** Ensure `ANDROID_SDK_ROOT` is set or `android/local.properties` has `sdk.dir=/path/to/your/sdk`.
-   **License Issues:** Use Android Studio's SDK Manager to accept licenses, or `sdkmanager --licenses` via the command line tools.
-   **Gradle Errors:** Consult Gradle error messages. Sometimes, cleaning the build (`./gradlew clean`) or syncing files in Android Studio can help.
-   **Capacitor Cordova Plugins:** If you were using Cordova plugins, the `capacitor-cordova-android-plugins` module might be needed. This guide assumes it's not. If build fails related to it, you might need to uncomment it in `android/settings.gradle` and `android/app/build.gradle` and ensure it's correctly configured.
