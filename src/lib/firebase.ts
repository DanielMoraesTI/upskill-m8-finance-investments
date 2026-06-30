import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Esta função inicializa o aplicativo Firebase com a configuração fornecida, permitindo que o aplicativo utilize os serviços do Firebase, como autenticação e banco de dados. A configuração é obtida das variáveis de ambiente, garantindo que as credenciais sensíveis não sejam expostas no código-fonte.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initializa o aplicativo Firebase com a configuração fornecida, permitindo que o aplicativo utilize os serviços do Firebase, como autenticação e banco de dados. A configuração é obtida das variáveis de ambiente, garantindo que as credenciais sensíveis não sejam expostas no código-fonte.
const app = initializeApp(firebaseConfig);

// Inicializa o serviço de autenticação do Firebase, permitindo que o aplicativo utilize recursos de autenticação, como login, logout e gerenciamento de usuários. A instância de autenticação é exportada para que possa ser utilizada em outras partes do aplicativo.
const auth = getAuth(app);

export { auth };