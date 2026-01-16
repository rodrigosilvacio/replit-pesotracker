export type Language = "pt" | "en";

export interface Translations {
  app: {
    title: string;
  };
  auth: {
    login: string;
    register: string;
    logout: string;
    username: string;
    password: string;
    confirmPassword: string;
    goalWeight: string;
    goalWeightHint: string;
    loginButton: string;
    registerButton: string;
    noAccount: string;
    hasAccount: string;
    signUp: string;
    signIn: string;
    welcome: string;
    welcomeBack: string;
    createAccount: string;
    trackYourWeight: string;
    usernameRequired: string;
    passwordRequired: string;
    passwordMinLength: string;
    passwordsMatch: string;
    invalidCredentials: string;
    usernameTaken: string;
    registerFailed: string;
    loginFailed: string;
  };
  summary: {
    current: string;
    change: string;
    lowest: string;
    highest: string;
    goal: string;
    kg: string;
  };
  form: {
    addWeight: string;
    editRecord: string;
    date: string;
    time: string;
    weight: string;
    addRecord: string;
    update: string;
    cancel: string;
    validWeight: string;
    weightRange: string;
  };
  chart: {
    title: string;
    noData: string;
    noDataDescription: string;
  };
  table: {
    title: string;
    dateTime: string;
    weight: string;
    diff: string;
    actions: string;
    noEntries: string;
    noEntriesDescription: string;
  };
  deleteModal: {
    title: string;
    message: string;
    cancel: string;
    delete: string;
  };
  goalReached: {
    title: string;
    message: string;
    dismiss: string;
  };
  loading: {
    loadingData: string;
  };
  errors: {
    duplicateDate: string;
    saveFailed: string;
  };
  settings: {
    language: string;
    portuguese: string;
    english: string;
  };
}

export const translations: Record<Language, Translations> = {
  pt: {
    app: {
      title: "Peso Tracker",
    },
    auth: {
      login: "Entrar",
      register: "Cadastrar",
      logout: "Sair",
      username: "Nome de usuário",
      password: "Senha",
      confirmPassword: "Confirmar senha",
      goalWeight: "Peso meta (kg)",
      goalWeightHint: "O peso que você deseja alcançar",
      loginButton: "Entrar",
      registerButton: "Criar conta",
      noAccount: "Não tem uma conta?",
      hasAccount: "Já tem uma conta?",
      signUp: "Cadastre-se",
      signIn: "Entre",
      welcome: "Bem-vindo ao",
      welcomeBack: "Bem-vindo de volta!",
      createAccount: "Crie sua conta",
      trackYourWeight: "Acompanhe seu peso e alcance suas metas",
      usernameRequired: "Nome de usuário é obrigatório",
      passwordRequired: "Senha é obrigatória",
      passwordMinLength: "A senha deve ter pelo menos 6 caracteres",
      passwordsMatch: "As senhas não coincidem",
      invalidCredentials: "Usuário ou senha inválidos",
      usernameTaken: "Este nome de usuário já está em uso",
      registerFailed: "Falha ao criar conta",
      loginFailed: "Falha ao entrar",
    },
    summary: {
      current: "Atual",
      change: "Variação",
      lowest: "Menor",
      highest: "Maior",
      goal: "Meta",
      kg: "kg",
    },
    form: {
      addWeight: "Adicionar Peso",
      editRecord: "Editar Registro",
      date: "Data",
      time: "Hora",
      weight: "Peso",
      addRecord: "Adicionar",
      update: "Atualizar",
      cancel: "Cancelar",
      validWeight: "Digite um peso válido",
      weightRange: "O peso deve ser entre 0 e 500 kg",
    },
    chart: {
      title: "Evolução do Peso",
      noData: "Sem dados ainda",
      noDataDescription: "Adicione seu primeiro registro para ver o gráfico de progresso",
    },
    table: {
      title: "Histórico de Peso",
      dateTime: "Data/Hora",
      weight: "Peso",
      diff: "Dif",
      actions: "Ações",
      noEntries: "Nenhum registro",
      noEntriesDescription: "Comece a registrar seu peso hoje",
    },
    deleteModal: {
      title: "Excluir Registro?",
      message: "Tem certeza que deseja excluir este registro de peso? Esta ação não pode ser desfeita.",
      cancel: "Cancelar",
      delete: "Excluir",
    },
    goalReached: {
      title: "Parabéns!",
      message: "Você chegou na meta!",
      dismiss: "Continuar",
    },
    loading: {
      loadingData: "Carregando seus dados de peso...",
    },
    errors: {
      duplicateDate: "Já existe um registro para esta data e hora",
      saveFailed: "Falha ao salvar registro de peso",
    },
    settings: {
      language: "Idioma",
      portuguese: "Português",
      english: "English",
    },
  },
  en: {
    app: {
      title: "Weight Tracker",
    },
    auth: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm password",
      goalWeight: "Goal weight (kg)",
      goalWeightHint: "The weight you want to achieve",
      loginButton: "Sign In",
      registerButton: "Create Account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      signUp: "Sign Up",
      signIn: "Sign In",
      welcome: "Welcome to",
      welcomeBack: "Welcome back!",
      createAccount: "Create your account",
      trackYourWeight: "Track your weight and reach your goals",
      usernameRequired: "Username is required",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 6 characters",
      passwordsMatch: "Passwords do not match",
      invalidCredentials: "Invalid username or password",
      usernameTaken: "This username is already taken",
      registerFailed: "Failed to create account",
      loginFailed: "Failed to sign in",
    },
    summary: {
      current: "Current",
      change: "Change",
      lowest: "Lowest",
      highest: "Highest",
      goal: "Goal",
      kg: "kg",
    },
    form: {
      addWeight: "Add Weight",
      editRecord: "Edit Record",
      date: "Date",
      time: "Time",
      weight: "Weight",
      addRecord: "Add Record",
      update: "Update",
      cancel: "Cancel",
      validWeight: "Please enter a valid weight",
      weightRange: "Weight must be between 0 and 500 kg",
    },
    chart: {
      title: "Weight Evolution",
      noData: "No data yet",
      noDataDescription: "Add your first weight entry to see your progress chart",
    },
    table: {
      title: "Weight History",
      dateTime: "Date/Time",
      weight: "Weight",
      diff: "Diff",
      actions: "Actions",
      noEntries: "No entries yet",
      noEntriesDescription: "Start tracking your weight today",
    },
    deleteModal: {
      title: "Delete Record?",
      message: "Are you sure you want to delete this weight record? This action cannot be undone.",
      cancel: "Cancel",
      delete: "Delete",
    },
    goalReached: {
      title: "Congratulations!",
      message: "You've reached your goal!",
      dismiss: "Continue",
    },
    loading: {
      loadingData: "Loading your weight data...",
    },
    errors: {
      duplicateDate: "A weight record already exists for this date and time",
      saveFailed: "Failed to save weight record",
    },
    settings: {
      language: "Language",
      portuguese: "Português",
      english: "English",
    },
  },
};
