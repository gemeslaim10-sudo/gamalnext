# How to Deploy to Vercel

Vercel is the creators of Next.js and provides the best hosting experience for it. It handles Server-Side Rendering (SSR) and API Routes automatically without extra cost (on the Hobby plan).

## Option 1: Deploy via Vercel CLI (Recommended)

1.  **Install Vercel CLI**:
    Run this command in your terminal:
    ```bash
    
    
    ```

2.  **Login to Vercel**:
    ```bash
    vercel login
    ```
    (Select "Continue with Email" or "GitHub" and follow the browser instructions).

3.  **Deploy**:
    Run the following command in your project folder:
    ```bash
    vercel
    ```
    
    You will be asked a few questions. Press **Enter** for all of them to accept defaults:
    *   Set up and deploy? [Y/n] **Y**
    *   Which scope do you want to deploy to? **(Select your name)**
    *   Link to existing project? [y/N] **N**
    *   What’s your project’s name? **(Press Enter or type a name like `gamal-portfolio`)**
    *   In which directory is your code located? **(Press Enter for `./`)**
    *   Want to modify these settings? [y/N] **N**

    > **Wait!** The build might fail the first time because we haven't added variables yet. That's normal.

4.  **Add Environment Variables**:
    Go to the URL provided in the terminal (Project Settings) OR run this command for EACH variable below:
    
    ```bash
    vercel env add VariableName
    ```
    *(Then paste the value)*

    **Required Variables (Copy these from your `.env.local` file):**
    *   `NEXT_PUBLIC_FIREBASE_API_KEY`
    *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    *   `NEXT_PUBLIC_FIREBASE_APP_ID`
    *   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
    *   `GEMINI_API_KEY`

    **Example:**
    ```bash
    vercel env add GEMINI_API_KEY production
    ```
    (Paste `AIzaSyD5RNlFA9N1tUdwaLHvEpswwODLc21LzPg`)

5.  **Final Deploy**:
    After adding variables, run:
    ```bash
    vercel --prod
    ```

---

## Option 2: Deploy via GitHub (Easiest UI)

1.  **Push your code to GitHub**.
2.  Go to [Vercel.com](https://vercel.com) and sign up/login.
3.  Click **"Add New Project"** -> **"Import"** (next to your Git repository).
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (Default)
    *   **Environment Variables**: Expand this section and copy-paste all key-value pairs from your `.env.local`.
5.  Click **Deploy**.

## Environment Variables List

Copy values from your local `.env.local` file.

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyD97cG87btuDkXVaPpnH8U-EicySBoZY0s` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `gamal-selim.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `gamal-selim` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `gamal-selim.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `46755219598` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:46755219598:web:f87b9d66ee51375f1ce1df` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-3D9ENY5T40` |
| `GEMINI_API_KEY` | `AIzaSyD5RNlFA9N1tUdwaLHvEpswwODLc21LzPg` |
